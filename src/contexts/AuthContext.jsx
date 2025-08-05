import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../lib/database.js'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const verificarUsuario = async () => {
      try {
        const { user } = await authService.obtenerUsuarioActual()
        setUsuario(user)
      } catch (error) {
        console.error('Error verificando usuario:', error)
      } finally {
        setCargando(false)
      }
    }

    verificarUsuario()

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      console.log('Cambio de autenticación:', event, session?.user?.email)
      setUsuario(session?.user ?? null)
      setCargando(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const iniciarSesion = async (email, password) => {
    const resultado = await authService.iniciarSesion(email, password)
    if (resultado.data?.user) {
      setUsuario(resultado.data.user)
    }
    return resultado
  }

  const registrarse = async (email, password, datosAdicionales) => {
    const resultado = await authService.registrar(email, password, datosAdicionales)
    if (resultado.data?.user) {
      setUsuario(resultado.data.user)
    }
    return resultado
  }

  const cerrarSesion = async () => {
    const resultado = await authService.cerrarSesion()
    if (!resultado.error) {
      setUsuario(null)
    }
    return resultado
  }

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    estaAutenticado: !!usuario
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}
