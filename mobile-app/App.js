import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';

// Android Studio emulator: http://10.0.2.2:3000
// Expo en dispositivo físico: http://TU_IP_LOCAL:3000
// iOS simulator o WEB: http://localhost:3000
const API_URL = 'http://localhost:3000/tareas';

export default function App() {
  // ============================================
  // ESTADOS - Variables reactivas de la app
  // ============================================
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);

  // ============================================
  // useEffect - Se ejecuta al montar el componente
  // ============================================
  useEffect(() => {
    obtenerTareas();
  }, []);

  // ============================================
  // FUNCIONES PARA CONSUMIR LA API REST
  // ============================================

  // GET - Obtener todas las tareas
  const obtenerTareas = async () => {
    try {
      setCargando(true);
      console.log(' Obteniendo tareas de la API...');
      
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      
      if (datos.success) {
        setTareas(datos.data);
        console.log(`✅ ${datos.cantidad} tareas obtenidas`);
      }
    } catch (error) {
      console.error('❌ Error al obtener tareas:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  // POST - Crear nueva tarea
  const crearTarea = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos');
      return;
    }

    try {
      setCargando(true);
      console.log(' Enviando nueva tarea a la API...');

      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo,
          descripcion: descripcion
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        console.log('✅ Tarea creada:', datos.data);
        setTitulo('');
        setDescripcion('');
        obtenerTareas(); // Recargar la lista
        Alert.alert('Éxito', 'Tarea creada correctamente');
      }
    } catch (error) {
      console.error('❌ Error al crear tarea:', error);
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setCargando(false);
    }
  };

  // PUT - Actualizar estado de tarea (marcar como completada)
  const toggleCompletada = async (tarea) => {
    try {
      console.log(` Actualizando tarea ${tarea.id}...`);

      const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completada: !tarea.completada
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        console.log('✅ Tarea actualizada');
        obtenerTareas(); // Recargar la lista
      }
    } catch (error) {
      console.error('❌ Error al actualizar tarea:', error);
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  // DELETE - Eliminar tarea
  const eliminarTarea = async (id) => {
    // Confirmación compatible con web y móvil
    const confirmar = confirm('¿Estás seguro de eliminar esta tarea?');
    
    if (confirmar) {
      try {
        console.log(`🗑️ Eliminando tarea ${id}...`);

        const respuesta = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        const datos = await respuesta.json();

        if (datos.success) {
          console.log('✅ Tarea eliminada');
          obtenerTareas(); // Recargar la lista
        }
      } catch (error) {
        console.error('❌ Error al eliminar tarea:', error);
        alert('Error: No se pudo eliminar la tarea');
      }
    }
  };

  // ============================================
  // COMPONENTE PARA RENDERIZAR CADA TAREA
  // ============================================
  const TareaItem = ({ item }) => (
    <View style={styles.tareaItem}>
      <TouchableOpacity 
        style={styles.tareaContenido}
        onPress={() => toggleCompletada(item)}
      >
        <View style={[
          styles.checkbox,
          item.completada && styles.checkboxCompletado
        ]}>
          {item.completada && <Text style={styles.checkmark}>✓</Text>}
        </View>
        
        <View style={styles.tareaTexto}>
          <Text style={[
            styles.tareaTitulo,
            item.completada && styles.tareaCompletada
          ]}>
            {item.titulo}
          </Text>
          <Text style={styles.tareaDescripcion}>
            {item.descripcion}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botonEliminar}
        onPress={() => eliminarTarea(item.id)}
      >
        <Text style={styles.textoEliminar}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}> Gestor de Tareas</Text>
        <Text style={styles.subtitulo}>Demo API REST + React Native</Text>
      </View>

      {/* Formulario para crear tareas */}
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Título de la tarea"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción de la tarea"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TouchableOpacity 
          style={styles.botonAgregar}
          onPress={crearTarea}
          disabled={cargando}
        >
          <Text style={styles.textoBoton}>
            {cargando ? ' Cargando...' : ' Agregar Tarea'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas */}
      {cargando && tareas.length === 0 ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={TareaItem}
          style={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={() => {
                setRefrescando(true);
                obtenerTareas();
              }}
            />
          }
          ListEmptyComponent={
            <Text style={styles.listaVacia}>
              No hay tareas. ¡Crea una nueva!
            </Text>
          }
        />
      )}
    </View>
  );
}

// ============================================
// ESTILOS
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  formulario: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  botonAgregar: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lista: {
    flex: 1,
  },
  tareaItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tareaContenido: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompletado: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tareaTexto: {
    flex: 1,
  },
  tareaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tareaCompletada: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  tareaDescripcion: {
    fontSize: 14,
    color: '#666',
  },
  botonEliminar: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  textoEliminar: {
    fontSize: 24,
  },
  loader: {
    marginTop: 50,
  },
  listaVacia: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
