import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
      password: Yup.string()
        .required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email, values.password);
        enqueueSnackbar('¡Iniciaste sesión correctamente!', { variant: 'success' });
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.error || 'Ocurrió un error al iniciar sesión';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        setErrors({ submit: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          InputProps={{
            sx: { borderRadius: 3 }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            sx: { borderRadius: 3 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link component={RouterLink} to="/register" variant="body2">
            ¿No tienes cuenta? Regístrate
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Login;
