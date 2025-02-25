import { createTheme } from '@mui/material/styles';

// Dos colores primarios
const PRIMARY_COLOR = "#3f51b5";  // Azul índigo
const SECONDARY_COLOR = "#00acc1"; // Verde azulado

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: "#757de8",
      dark: "#002984",
      contrastText: "#fff",
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: "#5ddef4",
      dark: "#007c91",
      contrastText: "#fff",
    },
  },
  shape: {
    borderRadius: 12, // Bordes redondeados en todo
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25, // Botones más redondeados
          textTransform: "none",
          padding: "10px 20px",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      fontWeight: 600,
    },
  },
});

export default theme;
