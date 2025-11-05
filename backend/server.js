// Importamos las dependencias necesarias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializamos la aplicación Express
const app = express();
const PORT = 3000;

// Middleware - Configuraciones que se ejecutan antes de las rutas
app.use(cors()); // Permite peticiones desde cualquier origen 
app.use(bodyParser.json()); // Permite recibir datos en formato JSON

// Base de datos simulada en memoria (array de objetos)
let tareas = [
  { id: 1, titulo: 'Aprender React Native', descripcion: 'Estudiar componentes y navegación', completada: false },
  { id: 2, titulo: 'Crear API REST', descripcion: 'Implementar CRUD con Express', completada: true },
  { id: 3, titulo: 'Practicar JavaScript', descripcion: 'Repasar ES6+ y async/await', completada: false }
];

// Variable para generar IDs únicos
let siguienteId = 4;

// ============================================
// RUTAS / ENDPOINTS
// ============================================

// Ruta raíz - Bienvenida
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Bienvenido a la API REST de Tareas!',
    version: '1.0.0',
    endpoints: {
      'GET /tareas': 'Obtener todas las tareas',
      'GET /tareas/:id': 'Obtener una tarea específica',
      'POST /tareas': 'Crear una nueva tarea',
      'PUT /tareas/:id': 'Actualizar una tarea',
      'DELETE /tareas/:id': 'Eliminar una tarea'
    }
  });
});

// GET - Obtener todas las tareas
app.get('/tareas', (req, res) => {
  console.log('📋 GET /tareas - Obteniendo todas las tareas');
  res.json({
    success: true,
    cantidad: tareas.length,
    data: tareas
  });
});

// GET - Obtener una tarea por ID
app.get('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`🔍 GET /tareas/${id} - Buscando tarea`);
  
  const tarea = tareas.find(t => t.id === id);
  
  if (tarea) {
    res.json({
      success: true,
      data: tarea
    });
  } else {
    res.status(404).json({
      success: false,
      mensaje: `Tarea con ID ${id} no encontrada`
    });
  }
});

// POST - Crear una nueva tarea
app.post('/tareas', (req, res) => {
  console.log('➕ POST /tareas - Creando nueva tarea');
  
  const { titulo, descripcion } = req.body;
  
  // Validación básica
  if (!titulo || !descripcion) {
    return res.status(400).json({
      success: false,
      mensaje: 'Se requieren título y descripción'
    });
  }
  
  // Crear la nueva tarea
  const nuevaTarea = {
    id: siguienteId++,
    titulo,
    descripcion,
    completada: false
  };
  
  tareas.push(nuevaTarea);
  
  res.status(201).json({
    success: true,
    mensaje: 'Tarea creada exitosamente',
    data: nuevaTarea
  });
});

// PUT - Actualizar una tarea existente
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(` PUT /tareas/${id} - Actualizando tarea`);
  
  const index = tareas.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      mensaje: `Tarea con ID ${id} no encontrada`
    });
  }
  
  // Actualizar solo los campos proporcionados
  const { titulo, descripcion, completada } = req.body;
  
  if (titulo !== undefined) tareas[index].titulo = titulo;
  if (descripcion !== undefined) tareas[index].descripcion = descripcion;
  if (completada !== undefined) tareas[index].completada = completada;
  
  res.json({
    success: true,
    mensaje: 'Tarea actualizada exitosamente',
    data: tareas[index]
  });
});

// DELETE - Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(` DELETE /tareas/${id} - Eliminando tarea`);
  
  const index = tareas.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      mensaje: `Tarea con ID ${id} no encontrada`
    });
  }
  
  const tareaEliminada = tareas.splice(index, 1)[0];
  
  res.json({
    success: true,
    mensaje: 'Tarea eliminada exitosamente',
    data: tareaEliminada
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` API REST de Tareas - Lista para usar`);
  console.log('='.repeat(50));
});
