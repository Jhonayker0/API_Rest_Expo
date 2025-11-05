# 📱 API REST + React Native - Demo para Exposición

Este proyecto es una demostración completa de cómo funciona una API REST con una aplicación móvil React Native. Incluye un backend con Node.js/Express y un frontend móvil.

## 📂 Estructura del Proyecto

```
Rest-Api/
├── backend/                 # Servidor API REST
│   ├── server.js           # Código del servidor
│   └── package.json        # Dependencias del backend
│
├── mobile-app/             # Aplicación React Native
│   ├── App.js              # Código de la aplicación móvil
│   ├── app.json            # Configuración de Expo
│   └── package.json        # Dependencias de la app
│
├── GUIA_EXPOSICION.md      # Guía completa para tu exposición
└── README.md               # Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (versión 14 o superior) - [Descargar aquí](https://nodejs.org/)
- npm (viene con Node.js)
- Expo CLI: `npm install -g expo-cli`
- Un emulador Android/iOS o la app Expo Go en tu teléfono

### Paso 1: Instalar Backend

```powershell
# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

✅ **Verás:** "🚀 Servidor corriendo en http://localhost:3000"

### Paso 2: Instalar Aplicación Móvil

Abre una **NUEVA terminal** (deja el servidor corriendo):

```powershell
# Navegar a la carpeta de la app móvil
cd mobile-app

# Instalar dependencias
npm install

# Iniciar Expo
npx expo start
```

### Paso 3: Configurar la URL de la API

**⚠️ IMPORTANTE:** Antes de ejecutar la app, debes configurar la URL correcta en `mobile-app/App.js`

Abre el archivo `App.js` y busca esta línea (línea 18):

```javascript
const API_URL = 'http://10.0.2.2:3000/tareas';
```

Cámbiala según tu caso:

| Caso | URL a usar |
|------|------------|
| 🤖 Android Emulator (Android Studio) | `http://10.0.2.2:3000/tareas` |
| 🍎 iOS Simulator (Xcode) | `http://localhost:3000/tareas` |
| 📱 Dispositivo físico (con Expo Go) | `http://TU_IP_LOCAL:3000/tareas` |

**Para obtener tu IP local:**

```powershell
# En Windows PowerShell
ipconfig
# Busca "Dirección IPv4" (algo como 192.168.1.X)
```

### Paso 4: Ejecutar la App Móvil

Después de iniciar Expo (`npx expo start`), verás un menú con opciones:

```
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
```

**Opciones:**

1. **Android Emulator:**
   - Presiona `a`
   - Se abrirá en Android Studio emulator

2. **iOS Simulator (solo Mac):**
   - Presiona `i`
   - Se abrirá en Xcode simulator

3. **Dispositivo físico:**
   - Descarga "Expo Go" desde Play Store/App Store
   - Escanea el QR que aparece en la terminal
   - **IMPORTANTE:** Tu teléfono y computadora deben estar en la misma red WiFi

## 🧪 Probar la API manualmente

Puedes probar los endpoints de la API usando el navegador o herramientas como Postman:

### En el navegador:

- **Ver todas las tareas:** http://localhost:3000/tareas
- **Ver información de la API:** http://localhost:3000

### Con PowerShell (ejemplos):

```powershell
# GET - Obtener todas las tareas
Invoke-RestMethod -Uri "http://localhost:3000/tareas" -Method Get

# POST - Crear una nueva tarea
$body = @{
    titulo = "Nueva tarea"
    descripcion = "Descripción de prueba"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/tareas" -Method Post -Body $body -ContentType "application/json"

# PUT - Actualizar tarea (cambiar ID según corresponda)
$body = @{
    completada = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/tareas/1" -Method Put -Body $body -ContentType "application/json"

# DELETE - Eliminar tarea
Invoke-RestMethod -Uri "http://localhost:3000/tareas/1" -Method Delete
```

## 📱 Funcionalidades de la App

La aplicación móvil incluye todas las operaciones CRUD:

1. ✅ **Ver tareas** (GET)
   - Se cargan automáticamente al abrir la app
   - Pull-to-refresh para actualizar

2. ➕ **Crear tareas** (POST)
   - Formulario en la parte superior
   - Validación de campos vacíos

3. ✏️ **Marcar como completada** (PUT)
   - Toca el círculo junto a la tarea
   - Cambia el estilo visual

4. 🗑️ **Eliminar tareas** (DELETE)
   - Toca el ícono de basura
   - Confirmación antes de eliminar

## 🎯 Conceptos Demostrados

### Backend (server.js)
- ✅ Configuración de servidor Express
- ✅ Middleware (CORS, body-parser)
- ✅ Endpoints RESTful
- ✅ Métodos HTTP (GET, POST, PUT, DELETE)
- ✅ Manejo de respuestas JSON
- ✅ Códigos de estado HTTP
- ✅ Validación básica de datos

### Frontend (App.js)
- ✅ Consumo de API con `fetch`
- ✅ Async/await para peticiones asíncronas
- ✅ Estados con `useState`
- ✅ Efectos con `useEffect`
- ✅ Manejo de errores con try/catch
- ✅ Loading states
- ✅ Pull-to-refresh
- ✅ FlatList para listas eficientes

## 🐛 Solución de Problemas Comunes

### Error: "No se pudo conectar con el servidor"

**Causa:** La app no puede alcanzar el servidor

**Soluciones:**
1. Verifica que el servidor esté corriendo (debe aparecer el mensaje en la terminal)
2. Revisa la URL en `App.js` (línea 18)
3. Si usas dispositivo físico, verifica que estén en la misma red WiFi
4. En Android Emulator, usa `http://10.0.2.2:3000`
5. Desactiva temporalmente el firewall/antivirus

### Error: "Cannot find module 'express'"

**Causa:** No se instalaron las dependencias

**Solución:**
```powershell
cd backend
npm install
```

### Error: "Port 3000 is already in use"

**Causa:** Ya hay algo corriendo en el puerto 3000

**Soluciones:**
1. Cierra otras instancias del servidor
2. Cambia el puerto en `server.js`:
   ```javascript
   const PORT = 3001; // Cambiar a otro puerto
   ```
3. Actualiza la URL en `App.js` al nuevo puerto

### La app se ve en blanco

**Soluciones:**
1. Presiona `r` en la terminal de Expo para recargar
2. Revisa la consola del terminal por errores
3. Asegúrate de que todas las dependencias estén instaladas

### No aparece el emulador de Android

**Soluciones:**
1. Asegúrate de tener Android Studio instalado
2. Configura un emulador en Android Studio (AVD Manager)
3. Inicia el emulador manualmente desde Android Studio
4. Luego presiona `a` en la terminal de Expo

## 📚 Recursos de Aprendizaje

### APIs REST:
- [Tutorial REST API - MDN](https://developer.mozilla.org/es/docs/Web/HTTP/Methods)
- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Tutorial](https://restfulapi.net/)

### React Native:
- [Documentación oficial](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)

### Node.js/Express:
- [Express.js Guide](https://expressjs.com/es/guide/routing.html)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)

## 🎓 Para tu Exposición

Lee el archivo **`GUIA_EXPOSICION.md`** que incluye:

- ✅ Estructura completa de la presentación (30-45 min)
- ✅ Conceptos explicados con analogías
- ✅ Diagramas para dibujar o mostrar
- ✅ Script paso a paso para la demo en vivo
- ✅ Análisis detallado del código
- ✅ Posibles preguntas y respuestas
- ✅ Tips para el día de la exposición

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

---

## 🆘 ¿Necesitas ayuda?

Si tienes problemas durante la instalación o ejecución:

1. Revisa la sección "Solución de Problemas" arriba
2. Verifica que Node.js esté instalado: `node --version`
3. Verifica que npm esté instalado: `npm --version`
4. Lee los mensajes de error completos en la terminal
5. Googlea el error específico

---

**¡Éxito en tu exposición! 🎉🚀**
