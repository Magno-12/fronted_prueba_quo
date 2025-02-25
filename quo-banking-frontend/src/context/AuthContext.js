import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  UPDATE_USER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      user
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updateProfile: () => Promise.resolve()
});

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Set up axios interceptors for authentication
  useEffect(() => {
    const setupAxios = () => {
      axios.interceptors.request.use(
        (config) => {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    };

    setupAxios();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
          const response = await axios.get(`${apiUrl}/auth/me/`);
          
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: response.data
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, [apiUrl]);

  const login = async (email, password) => {
    const response = await axios.post(`${apiUrl}/auth/login/`, { email, password });
    const { tokens, user } = response.data;
    
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    
    dispatch({
      type: 'LOGIN',
      payload: { user }
    });
    
    return user;
  };

  const register = async (email, password, firstName, lastName) => {
    await axios.post(`${apiUrl}/users/`, {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });
    
    return login(email, password);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        await axios.post(`${apiUrl}/auth/logout/`, {
          refresh_token: refreshToken
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = async (email, code, newPassword) => {
    await axios.post(`${apiUrl}/users/reset_password/`, {
      email,
      code,
      new_password: newPassword,
      confirm_password: newPassword
    });
  };

  const requestPasswordReset = async (email) => {
    await axios.post(`${apiUrl}/users/request_code/`, { email });
  };

  const updateProfile = async (userData) => {
    const response = await axios.patch(`${apiUrl}/users/me/`, userData);
    
    dispatch({
      type: 'UPDATE_USER',
      payload: { user: response.data }
    });
    
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        requestPasswordReset,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
