import { supabase, isSupabaseConfigured } from './supabase.js'

// Funciones para trabajar con dolencias
export const dolenciasService = {
  // Buscar dolencias por nombre o descripción
  async buscar(query) {
    if (!query.trim()) return { data: [], error: null }

    if (!isSupabaseConfigured || !supabase) {
      return {
        data: [],
        error: new Error('Supabase not configured - using local data fallback')
      }
    }

    const { data, error } = await supabase
      .from('dolencias')
      .select('*')
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%,palabras_clave.cs.{${query}}`)
      .order('nombre')

    return { data: data || [], error }
  },

  // Obtener todas las dolencias
  async obtenerTodas() {
    const { data, error } = await supabase
      .from('dolencias')
      .select('*')
      .order('nombre')
    
    return { data: data || [], error }
  },

  // Obtener dolencias por categoría
  async obtenerPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('dolencias')
      .select('*')
      .eq('categoria', categoria)
      .order('nombre')
    
    return { data: data || [], error }
  },

  // Obtener una dolencia específica
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('dolencias')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  }
}

// Funciones para trabajar con el progreso del usuario
export const progresosService = {
  // Obtener progresos del usuario
  async obtenerProgresos(usuarioId) {
    const { data, error } = await supabase
      .from('progresos')
      .select(`
        *,
        dolencias (
          id,
          nombre,
          categoria
        )
      `)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  },

  // Crear un nuevo progreso
  async crearProgreso(progreso) {
    const { data, error } = await supabase
      .from('progresos')
      .insert([progreso])
      .select()
    
    return { data: data?.[0], error }
  },

  // Actualizar progreso
  async actualizarProgreso(id, actualizacion) {
    const { data, error } = await supabase
      .from('progresos')
      .update(actualizacion)
      .eq('id', id)
      .select()
    
    return { data: data?.[0], error }
  },

  // Eliminar progreso
  async eliminarProgreso(id) {
    const { data, error } = await supabase
      .from('progresos')
      .delete()
      .eq('id', id)
    
    return { data, error }
  }
}

// Funciones para dolencias guardadas
export const dolenciasGuardadasService = {
  // Obtener dolencias guardadas del usuario
  async obtenerGuardadas(usuarioId) {
    const { data, error } = await supabase
      .from('dolencias_guardadas')
      .select(`
        *,
        dolencias (
          id,
          nombre,
          descripcion,
          categoria
        )
      `)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  },

  // Guardar una dolencia
  async guardarDolencia(usuarioId, dolenciaId, notas = '') {
    const { data, error } = await supabase
      .from('dolencias_guardadas')
      .insert([{
        usuario_id: usuarioId,
        dolencia_id: dolenciaId,
        notas_personales: notas
      }])
      .select()
    
    return { data: data?.[0], error }
  },

  // Verificar si una dolencia está guardada
  async estaGuardada(usuarioId, dolenciaId) {
    const { data, error } = await supabase
      .from('dolencias_guardadas')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('dolencia_id', dolenciaId)
      .single()
    
    return { guardada: !!data, error }
  },

  // Eliminar dolencia guardada
  async eliminarGuardada(usuarioId, dolenciaId) {
    const { data, error } = await supabase
      .from('dolencias_guardadas')
      .delete()
      .eq('usuario_id', usuarioId)
      .eq('dolencia_id', dolenciaId)
    
    return { data, error }
  }
}

// Funciones para consultas online
export const consultasService = {
  // Obtener consultas del usuario
  async obtenerConsultas(usuarioId) {
    const { data, error } = await supabase
      .from('consultas_online')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  },

  // Crear nueva consulta
  async crearConsulta(consulta) {
    const { data, error } = await supabase
      .from('consultas_online')
      .insert([consulta])
      .select()
    
    return { data: data?.[0], error }
  },

  // Actualizar estado de consulta
  async actualizarEstado(id, estado) {
    const { data, error } = await supabase
      .from('consultas_online')
      .update({ estado })
      .eq('id', id)
      .select()
    
    return { data: data?.[0], error }
  }
}

// Funciones para el perfil del usuario
export const perfilService = {
  // Obtener perfil del usuario
  async obtenerPerfil(usuarioId) {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', usuarioId)
      .single()
    
    return { data, error }
  },

  // Crear o actualizar perfil
  async upsertPerfil(perfil) {
    const { data, error } = await supabase
      .from('perfiles')
      .upsert([perfil])
      .select()
    
    return { data: data?.[0], error }
  }
}

// Funciones de autenticación
export const authService = {
  // Registrar usuario
  async registrar(email, password, datosAdicionales = {}) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error('Supabase authentication not configured')
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: datosAdicionales
      }
    })

    return { data, error }
  },

  // Iniciar sesión
  async iniciarSesion(email, password) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: new Error('Supabase authentication not configured')
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  },

  // Cerrar sesión
  async cerrarSesion() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtener usuario actual
  async obtenerUsuarioActual() {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: new Error('Supabase not configured') }
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Escuchar cambios en la autenticación
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured || !supabase) {
      // Return a mock subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    }

    return supabase.auth.onAuthStateChange(callback)
  }
}
