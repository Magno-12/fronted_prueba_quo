import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Link, Grid, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('El nombre es obligatorio'),
      lastName: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
      password: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .required('La contraseña es obligatoria'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await register(values.email, values.password, values.firstName, values.lastName);
        enqueueSnackbar('¡Cuenta creada exitosamente!', { variant: 'success' });
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.error || 'Error al crear la cuenta';
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
        Crear cuenta
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="Nombre"
              autoFocus
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              InputProps={{
                sx: { borderRadius: 3 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Apellido"
              name="lastName"
              autoComplete="family-name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              InputProps={{
                sx: { borderRadius: 3 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                sx: { borderRadius: 3 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
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
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress size={24} /> : 'Registrarse'}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Register;
