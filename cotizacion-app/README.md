# Sistema de Cotizaciones

Un sistema web para manejar solicitudes de cotización de productos y su proceso de confirmación.

## Requisitos

- Node.js (LTS version)
- MongoDB
- Una cuenta de correo electrónico para enviar notificaciones

## Instalación

1. Instalar Node.js desde: https://nodejs.org/
2. Clonar este repositorio
3. Instalar las dependencias:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```
4. Configurar las variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Agregar las siguientes variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     ```

## Estructura del Proyecto

- `/client`: Aplicación React para el frontend
- `/server`: Servidor Express para el backend
- `package.json`: Dependencias y scripts del proyecto

## Funcionalidades

- Solicitar cotización de productos
- Enviar notificaciones por correo electrónico
- Administrar cotizaciones pendientes
- Confirmar cotizaciones
- Seguimiento de estado (pendiente, cotizado, confirmado)
