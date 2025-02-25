import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../hooks/useAuth';

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await requestPasswordReset(values.email);
        enqueueSnackbar('Si el correo existe, recibirás un código de recuperación', { variant: 'success' });
        resetForm();
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.error || 'Error al solicitar el código';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Recuperar contraseña
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress size={24} /> : 'Enviar código'}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Volver al inicio de sesión
          </Link>
          <Link component={RouterLink} to="/reset-password" variant="body2">
            ¿Ya tienes un código?
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;
