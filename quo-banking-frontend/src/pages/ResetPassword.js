import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
      code: Yup.string()
        .required('El código de verificación es obligatorio'),
      newPassword: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .required('La nueva contraseña es obligatoria'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await resetPassword(values.email, values.code, values.newPassword);
        enqueueSnackbar('¡Contraseña actualizada exitosamente!', { variant: 'success' });
        navigate('/login');
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.error || 'Error al restablecer la contraseña';
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
        Restablecer contraseña
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Ingresa el código de verificación y tu nueva contraseña.
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
          id="code"
          label="Código de verificación"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
          InputProps={{
            sx: { borderRadius: 3 }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="Nueva contraseña"
          type={showPassword ? 'text' : 'password'}
          id="newPassword"
          autoComplete="new-password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar contraseña"
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
          {formik.isSubmitting ? <CircularProgress size={24} /> : 'Restablecer contraseña'}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Volver al inicio de sesión
          </Link>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Solicitar nuevo código
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;
