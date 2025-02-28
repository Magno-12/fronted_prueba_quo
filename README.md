# fronted_prueba_quo

## 📋 Descripción

Quo Digital Banking es una aplicación web que simula una plataforma de banca digital, permitiendo a los usuarios gestionar sus cuentas bancarias, visualizar transacciones, analizar gastos y más. Este proyecto implementa el frontend de la aplicación utilizando tecnologías modernas de desarrollo web.

## 🚀 Características

- **Autenticación completa**: Registro de usuarios, inicio de sesión, recuperación de contraseña
- **Dashboard interactivo**: Resumen de cuentas y bancos conectados
- **Gestión de cuentas bancarias**: Visualización y análisis de cuentas de diferentes bancos
- **Análisis de transacciones**: Historial detallado y categorización de movimientos
- **Gráficos y estadísticas**: Visualización de ingresos, gastos y distribución por categorías
- **Diseño responsive**: Adaptable a dispositivos móviles y escritorio
- **Integración con API**: Conexión con backend para gestión de datos bancarios

## 🛠️ Tecnologías

- **React 19**: Biblioteca para la construcción de interfaces de usuario
- **React Router 6**: Para el enrutamiento de la aplicación
- **Material UI 6**: Framework de componentes UI para React
- **Axios**: Para realizar peticiones HTTP
- **Formik & Yup**: Para la gestión y validación de formularios
- **Chart.js**: Para la visualización de datos
- **Notistack**: Para mostrar notificaciones
- **JWT**: Para la autenticación basada en tokens

## 📦 Estructura del Proyecto

```
quo-banking-frontend/
├── public/                  # Archivos públicos y HTML base
├── src/                     # Código fuente principal
│   ├── components/          # Componentes reutilizables
│   │   └── auth/            # Componentes de autenticación
│   ├── context/             # Contextos de React (GlobalState)
│   │   └── AuthContext.js   # Contexto de autenticación
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.js       # Hook para acceder al contexto de auth
│   ├── layouts/             # Estructuras de página
│   │   ├── AuthLayout.js    # Layout para páginas de autenticación
│   │   └── MainLayout.js    # Layout principal con navegación
│   ├── pages/               # Páginas/vistas de la aplicación
│   │   ├── Dashboard.js     # Página principal
│   │   ├── BanksList.js     # Lista de bancos
│   │   ├── BankDetails.js   # Detalles de cuentas bancarias
│   │   └── ...              # Otras páginas
│   ├── services/            # Servicios para API
│   │   └── bankService.js   # Servicios relacionados con bancos
│   ├── styles/              # Estilos globales
│   │   ├── global.css       # Estilos CSS globales
│   │   └── theme.js         # Configuración del tema Material UI
│   ├── App.js               # Componente principal y rutas
│   └── index.js             # Punto de entrada
├── .env                     # Variables de entorno
├── package.json             # Dependencias y scripts
└── README.md                # Documentación
```

## 🔧 Requisitos previos

- Node.js (v16 o superior)
- npm o yarn
- Acceso al backend de Quo Banking API (en ejecución)

## ⚙️ Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/yourusername/quo-banking-frontend.git
   cd quo-banking-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   # o 
   yarn install
   ```

3. **Configurar variables de entorno**:
   
   Crea o edita el archivo `.env` en la raíz del proyecto:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```
   
   Asegúrate de que esta URL coincida con la ubicación de tu backend.

## 🚀 Ejecución

1. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   # o
   yarn start
   ```

2. **Acceder a la aplicación**:
   
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Construcción para producción

Para generar una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

Los archivos de la aplicación compilada se generarán en el directorio `build/`.

## 🧪 Pruebas

Para ejecutar las pruebas:

```bash
npm test
# o
yarn test
```

## 📱 Uso de la aplicación

1. **Registro e inicio de sesión**:
   - Regístrate con un correo electrónico y contraseña
   - Inicia sesión con tus credenciales

2. **Dashboard**:
   - Visualiza un resumen de tus cuentas
   - Crea links de prueba para ver datos de demostración

3. **Gestión de bancos**:
   - Navega a la sección "Bancos" para ver bancos disponibles
   - Conéctate a bancos (funcionalidad simulada)

4. **Detalles de cuentas**:
   - Selecciona un banco para ver sus cuentas
   - Consulta saldos y movimientos
   - Analiza gráficos de ingresos y gastos

## 🔌 Integración con el backend

La aplicación se comunica con el backend a través de una API REST. Las principales rutas utilizadas son:

- `/auth/login/`: Autenticación de usuarios
- `/auth/me/`: Obtener datos del usuario actual
- `/belvo/institutions/`: Listar bancos disponibles
- `/belvo/accounts/`: Obtener cuentas de un banco
- `/belvo/transactions/`: Obtener movimientos de una cuenta
- `/belvo/create_test_links/`: Crear datos de prueba

## 🛡️ Autenticación

La aplicación utiliza autenticación JWT:

1. **Token flow**:
   - Al iniciar sesión, el servidor devuelve tokens de acceso y refresco
   - El token de acceso se envía en cada petición posterior
   - El token de refresco puede renovar el token de acceso expirado

2. **Almacenamiento**:
   - Los tokens se almacenan en localStorage
   - Un interceptor de Axios añade el token a cada petición

3. **Protección de rutas**:
   - Componente `RequireAuth` verifica la autenticación
   - Redirecciona al login si el usuario no está autenticado

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).

*Desarrollado como prueba técnica - Quo Digital Banking, 2025*
