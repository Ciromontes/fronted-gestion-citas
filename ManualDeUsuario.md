# Manual de Usuario

Proyecto: Gestión de Citas - GA10-220501097-AA11-EV01
Versión: 1.0
Autor: Equipo de formación
Fecha: 2025-10-26

---

## Portada

Manual de Usuario

Aplicación: Gestión de Citas (Frontend)
Código de evidencia: GA10-220501097-AA11-EV01

---

## Tabla de contenidos

1. Introducción
2. Alcance y público objetivo
3. Requisitos previos e instrucciones de instalación
4. Instrucciones de ingreso (Login)
5. Guía de uso por funcionalidades
   - Dashboard por roles
   - Gestión de citas
   - Citas de hoy
   - Agendar cita
   - Historial clínico y formularios de entrada
   - Gestión de mascotas
   - Gestión de usuarios (Administración)
6. Flujos de trabajo principales
   - Flujo: Ingreso y verificación de usuario
   - Flujo: Agendar una cita
   - Flujo: Atención / registrar entrada de historia clínica
   - Flujo: Consultar historial de una mascota
7. Instrucciones de ingreso y consulta de información
8. Capturas de pantalla e imágenes representativas
9. Buenas prácticas y recomendaciones
10. Solución de problemas (FAQ)
11. Glosario
12. Referencias y anexos

---

## 1. Introducción

Este manual de usuario describe el uso de la aplicación "Gestión de Citas" desarrollada como parte del proyecto formativo. El propósito es guiar a usuarios finales (administradores, recepcionistas, veterinarios y clientes) para realizar las tareas habituales: iniciar sesión, gestionar citas, consultar historiales y administrar mascotas y usuarios.


## 2. Alcance y público objetivo

- Público: Personal administrativo, recepcionistas, veterinarios y propietarios/ clientes.
- Alcance: Interfaz web frontend de la aplicación de gestión de citas. No cubre la instalación del backend en detalle, salvo requisitos mínimos para conexión.

---

## 3. Requisitos previos e instrucciones de instalación

Requisitos mínimos:
- Navegador moderno (Chrome, Edge, Firefox) actualizado.
- Conectividad con el backend (URL base de la API configurada en `config/api.config.ts`).

Si recibes el código fuente localmente:
1. Instala Node.js y npm (recomendado Node >= 16).
2. En la carpeta del frontend ejecuta:

    npm install
    npm run dev

3. Abrir http://localhost:5173 (o el puerto configurado) en el navegador.

Nota: estos pasos son orientativos para desarrolladores; el usuario final normalmente accederá a una URL de producción.

---

## 4. Instrucciones de ingreso (Login)

Objetivo: acceder al sistema con credenciales válidas.

Pasos:
1. Abrir la URL de la aplicación.
2. En la pantalla de inicio localizar el formulario de inicio de sesión.
3. Ingresar correo electrónico/usuario y contraseña.
4. Pulsar "Ingresar" o el botón equivalente.
5. Si las credenciales son válidas, el sistema dirigirá al Dashboard según el rol asignado.

Errores comunes:
- Credenciales incorrectas: el sistema mostrará un mensaje de error. Revisar usuario y contraseña.
- Cuenta inactiva: contactar al administrador.

---

## 5. Guía de uso por funcionalidades

A continuación se describen las principales secciones y componentes de la aplicación (nombres basados en la interfaz):

### 5.1 Dashboard

- DashboardAdmin: panel principal para administradores. Muestra métricas, accesos a gestión de usuarios, citas y reportes.
- DashboardRecepcionista: vista para recepcionistas con enfoque en agendamiento y atención de citas.
- DashboardVeterinario: vista para veterinarios con la lista de citas asignadas y acceso a historias clínicas.
- DashboardCliente: vista para clientes con su historial de citas y mascotas.

Elemento típico: `TarjetaMetrica` muestra conteos o KPIs.

### 5.2 Menú y Navegación

La aplicación cuenta con una `Navbar` y un `Sidebar` desde donde se accede a:
- Citas
- Citas Hoy
- Historias / Historial de mascotas
- Mascotas
- Usuarios (solo administradores)
- Perfil / Logout

### 5.3 Gestión de Citas

Componentes relacionados: `Citas.tsx`, `CitaCard.tsx`, `CitasHoyTable.tsx`, `AgendarCitaModal.tsx`.

Funciones principales:
- Ver lista de citas: filtrar por fecha, profesional o estado.
- Agendar cita: abrir modal, completar datos (mascota, fecha, hora, profesional, motivo) y guardar.
- Editar / cancelar cita: seleccionar cita y editar o cancelar según permisos.

Campos típicos de una cita:
- Fecha y hora
- Mascota
- Cliente
- Profesional (veterinario)
- Estado (agendada, atendida, cancelada)
- Observaciones

### 5.4 Citas de Hoy

Componente `CitasHoyPage.tsx` y `CitasHoyTable.tsx`:
- Vista diaria con las citas agendadas para el día actual.
- Permite marcar asistencia, iniciar atención o registrar observaciones rápidas.

### 5.5 Agendar Cita

Usualmente mediante `AgendarCitaModal`:
1. Abrir el modal (botón "Agendar cita" o similar).
2. Seleccionar cliente y mascota.
3. Seleccionar profesional y fecha/hora disponibles.
4. Escribir motivo/observaciones.
5. Confirmar para crear la cita.

Validaciones:
- Fecha/hora en el futuro.
- Campos obligatorios completados.

### 5.6 Historial clínico y formularios de entrada

Componentes: `HistoriasPage.tsx`, `HistorialMascota.tsx`, `FormEntradaHistoria.tsx`, `HistorialMascotaModal.tsx`.

Funciones:
- Consultar historial de una mascota.
- Añadir nueva entrada de historia clínica (diagnóstico, tratamiento, notas, archivos adjuntos).
- Consultar y filtrar entradas por fecha o profesional.

### 5.7 Gestión de mascotas

Componentes: `MascotaCard.tsx`, `HistorialMascota.tsx`.

Funciones:
- Registrar nueva mascota (nombre, especie, edad, rasgos, dueños).
- Editar datos de la mascota.
- Consultar historial y citas asociadas.

### 5.8 Gestión de usuarios (Administración)

Componente: `TablaUsuarios.tsx`.

Funciones:
- Listar usuarios del sistema.
- Crear/editar roles y permisos básicos.
- Activar / desactivar cuentas.

---

## 6. Flujos de trabajo principales

A continuación se describen los flujos más comunes con pasos detallados.

### Flujo: Ingreso y verificación de usuario

1. Usuario abre la URL de la aplicación.
2. Completa credenciales y pulsa "Ingresar".
3. Sistema valida credenciales.
4. Si es correcto, redirige al Dashboard según rol.
5. Si no, muestra mensaje de error y opción para recuperar contraseña (si implementado).

### Flujo: Agendar una cita (Recepcionista o Cliente)

1. Ir a `Citas` o `Agendar cita`.
2. Pulsar el botón "Agendar cita".
3. En el modal seleccionar cliente y mascota.
4. Elegir profesional y seleccionar fecha/hora disponible.
5. Añadir motivo y observaciones.
6. Confirmar. El sistema mostrará la cita en la lista y enviará notificación si está configurada.

Resultado esperado: nueva cita con estado "Agendada".

### Flujo: Atención / registrar entrada de historia clínica (Veterinario)

1. En `Citas Hoy` seleccionar la cita y abrir la entrada de atención.
2. Completar `FormEntradaHistoria` con hallazgos, diagnóstico y tratamiento.
3. Guardar la entrada. Si aplica, cambiar estado de la cita a "Atendida".
4. Adjuntar archivos o imágenes si es necesario.

Resultado esperado: la entrada se agrega al historial de la mascota y la cita se actualiza.

### Flujo: Consultar historial de una mascota

1. Buscar la mascota (desde `Mascotas` o `BuscadorHistorias`).
2. Seleccionar la mascota.
3. Visualizar `HistorialMascota` con entradas previas ordenadas por fecha.
4. Filtrar por rango de fechas o por profesional si se requiere.

---

## 7. Instrucciones de ingreso y consulta de información

- Formatos de fecha: usar el formato establecido por la aplicación (ej. YYYY-MM-DD).
- Búsquedas: utilizar el buscador por nombre de mascota, identificación del cliente o número de cita.
- Exportes: si la aplicación tiene funcionalidad para exportar, seguir los botones de exportar / imprimir en cada vista.

---

## 8. Capturas de pantalla e imágenes representativas

Incluye capturas de las pantallas principales para facilitar el uso. Se recomienda añadir los siguientes archivos en `public/docs/screenshots/`:
- `login.png` – pantalla de ingreso
- `dashboard_admin.png` – dashboard administrador
- `citas_lista.png` – lista de citas
- `agendar_cita_modal.png` – modal de agendar cita
- `citas_hoy.png` – vista de citas del día
- `historial_mascota.png` – vista de historial

En el Markdown puedes incrustarlas así (una vez añadidas):

![Login](/docs/screenshots/login.png)

(Sustituir la ruta según la ubicación real dentro del proyecto)

---

## 9. Buenas prácticas y recomendaciones

- Mantener actualizada la información de contacto del cliente y de la mascota.
- Revisar el calendario antes de agendar para evitar solapamientos.
- Anotar observaciones relevantes en cada entrada de historia clínica.
- Respetar la confidencialidad y la normativa de datos del paciente.

---

## 10. Solución de problemas (FAQ)

Q: No puedo iniciar sesión.
A: Verifica usuario/contraseña, conexión al backend y que la cuenta esté activa.

Q: No veo citas agendadas para hoy.
A: Comprueba filtros de fecha, rol de usuario y sincronización con el backend.

Q: La carga de una imagen falla al adjuntar documentos.
A: Verifica el tamaño y tipo de archivo y revisa la configuración del backend para aceptar adjuntos.

---

## 11. Glosario

- Cita: registro de una atención programada.
- Mascota: paciente del servicio veterinario.
- Historia clínica: registro de atenciones y observaciones médicas.
- Dashboard: panel principal con métricas y accesos.

---

## 12. Referencias y anexos

- Guía para la elaboración de manuales de usuario (DNP): https://bit.ly/31aMsek
- Archivo anexo sugerido: `Guia_Manual_Usuario` (si está disponible en los materiales de la formación).

---

## Anexo A — Campos y descripciones (ejemplo de datos)

Mascota:
- Nombre
- Especie
- Raza
- Edad
- Propietario (nombre, contacto)

Cita:
- ID
- Fecha
- Hora
- Mascota
- Cliente
- Profesional
- Estado
- Observaciones

Historia clínica (entrada):
- Fecha
- Profesional
- Motivo de consulta
- Diagnóstico
- Tratamiento
- Observaciones
- Archivos adjuntos

---

## Conversión a PDF (opcional)

Si deseas generar el PDF localmente puedes usar `pandoc` o la extensión "Markdown PDF" de tu editor. Ejemplo con pandoc (Windows cmd.exe):

pandoc ManualDeUsuario.md -o ManualDeUsuario.pdf

Asegúrate de que las rutas de las imágenes sean relativas y estén presentes para que aparezcan en el PDF.

---

## Evidencias para entrega

- Archivo: ManualDeUsuario.md (esta versión)
- Formato solicitado en la evidencia: PDF. Convertir el Markdown a PDF y entregar `ManualDeUsuario.pdf`.
- Incluir portada, introducción y referencias (ya incluidas).

---

Si deseas, puedo:
- Añadir capturas de pantalla directamente en `public/docs/screenshots/` si me proporcionas las imágenes.
- Exportar el archivo a PDF y subirlo al repositorio (necesitaré acceso a una herramienta de conversión aquí o que ejecutes el comando localmente).

Fin del documento.

