# AlertaUTEC Frontend

AlertaUTEC es una plataforma web para reportar, monitorear y gestionar incidentes dentro del campus UTEC. Este repositorio contiene el frontend construido con Vite, React y TypeScript, diseñado con una identidad visual inspirada en la marca UTEC.

## Requisitos previos

- Node.js 18+
- npm 9+

## Configuración del proyecto

1. Clona el repositorio y navega al directorio del proyecto.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia el archivo `.env.example` y actualiza las variables de entorno necesarias:

   ```bash
   cp .env.example .env
   ```

   - `VITE_API_URL`: URL base del backend HTTP.
   - `VITE_WS_URL`: URL del backend WebSocket.

4. Ejecuta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Estado actual

- Los servicios (`authService`, `incidentService`) están mockeados y simulan las llamadas HTTP mediante datos en memoria. Existen comentarios `TODO` señalando dónde integrar las peticiones reales con Axios.
- Existe un hook `useWebSocket` listo para conectarse a `VITE_WS_URL` cuando el backend esté disponible.
- El layout ya incluye rutas protegidas y un panel administrativo básico para autoridades.

## Estructura principal

```
src/
├── components/
├── context/
├── hooks/
├── lib/axios/
├── pages/
├── router/
├── services/
├── styles/
├── types/
└── constants/
```

Cada carpeta agrupa la lógica y los componentes necesarios para continuar la construcción del frontend de AlertaUTEC.
