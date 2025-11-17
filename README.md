# AlertAUTEC – Gestión de Incidencias en Campus (Hackathon Cloud)

## Descripción general

Este proyecto busca centralizar el reporte y seguimiento de incidencias dentro del campus UTEC, permitiendo que estudiantes, staff y autoridades registren y gestionen incidentes de manera más ágil.

La arquitectura propuesta incluye:

- **Frontend** en React + Vite (SPA).
- **Backend** serverless en AWS (Lambdas + API Gateway + DynamoDB + S3).
- **Orquestación y monitoreo** con **Apache Airflow**, desplegado en ECS.

> ⚠️ **Importante:** Por motivos de tiempo, **no se terminó de integrar completamente el frontend con el backend**. Varias pantallas funcionan con lógica mock/cliente y no consumen todavía todos los endpoints del backend.

---

## Estado actual

### Frontend

- Login y registro de usuario implementados a nivel de interfaz.
- Flujo de:
  - iniciar sesión,
  - listar incidentes,
  - ver detalle,
  - reportar incidente,
  - panel admin,
  
  está maquetado y funcional desde el punto de vista de UI/UX.
- Sin embargo, **las conexiones reales contra los endpoints del backend (API Gateway) están incompletas / parciales**:
  - Algunos llamados usan servicios mock.
  - Otros llamados están empezados pero no del todo alineados con la estructura final de las Lambdas.

### Backend (Serverless – AWS)

Se desplegó un backend usando **Serverless Framework** con las siguientes funciones Lambda:

- `registerUser` – Registro de usuario en DynamoDB.
- `loginUser` – Login, validación de credenciales y emisión de token.
- `validateToken` – Validación de token.
- `createIncident` – Creación de incidencias.
- `updateIncident` – Actualización de fase de incidencias.
- `getIncidentHistory` – Consulta de historial de incidencias (según rol).

También se crearon:

- Tablas DynamoDB para:
  - Usuarios
  - Tokens
  - Incidencias
  - Notificaciones
- Bucket S3 para almacenar notificaciones en formato JSON.

> A pesar de que el backend está desplegado y los recursos existen, **el acoplamiento/contrato final (shape de datos y headers) entre frontend y backend no quedó 100 % cerrado**.

---

## Airflow – Orquestación

Como parte del entregable de cloud y observabilidad, se dejó desplegada una instancia de **Apache Airflow** accesible públicamente (solo para fines demostrativos/academicos) en:

👉 **Airflow Web UI:**  
`http://54.172.59.16:8080/home`

Desde ahí se pueden:

- Visualizar DAGs de ejemplo.
- Ver el estado de las tareas.
- Validar la infraestructura de orquestación montada para el proyecto.

---

## Pendientes principales

1. **Conexión completa Frontend ↔ Backend**
   - Ajustar los servicios del frontend (`authService`, `incidentService`, etc.) para usar únicamente los endpoints reales del API Gateway.
   - Alinear los nombres de campos entre el modelo de frontend (`Incident`, `User`, etc.) y las estructuras reales de DynamoDB/Lambdas.
   - Manejo de errores y estados de carga desde el backend real.

2. **Autenticación real en frontend**
   - Reemplazar almacenamiento mock de usuario en `localStorage` por flujo completo:
     - Registro → Lambda `registerUser`
     - Login → Lambda `loginUser`
     - Validación de sesión → Lambda `validateToken`.

3. **Sincronización en tiempo real**
   - Conectar correctamente la infraestructura de WebSockets (API Gateway) con los cambios de estado de incidencias y notificaciones.

---

## Nota final

El proyecto deja montada la base:

- Arquitectura cloud con Lambdas, API Gateway, DynamoDB, S3 y Airflow.
- Frontend funcional a nivel visual y de flujo de usuario.
- Scripts y recursos listos para terminar de conectar ambas capas.

Por tiempos de hackathon, el trabajo se enfocó en levantar toda la infraestructura y demostrar el potencial del flujo, dejando como **trabajo futuro** la integración completa entre **backend y frontend**.
