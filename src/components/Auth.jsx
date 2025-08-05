import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Heart, Sparkles } from 'lucide-react'
import { authService } from '../lib/database.js'
import './Auth.css'

function Auth({ onAuthSuccess }) {
  const [modo, setModo] = useState('login') // 'login' o 'registro'
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const validarFormulario = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingresa un email válido')
      return false
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    if (modo === 'registro') {
      if (!formData.nombreCompleto.trim()) {
        setError('Por favor ingresa tu nombre completo')
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) return

    setCargando(true)
    setError('')
    setMensaje('')

    try {
      if (modo === 'registro') {
        const { data, error } = await authService.registrar(
          formData.email,
          formData.password,
          { nombreCompleto: formData.nombreCompleto }
        )

        if (error) {
          throw error
        }

        setMensaje('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.')
        setModo('login')
        setFormData({ email: formData.email, password: '', confirmPassword: '', nombreCompleto: '' })
        
      } else {
        const { data, error } = await authService.iniciarSesion(formData.email, formData.password)

        if (error) {
          throw error
        }

        setMensaje('¡Bienvenido de vuelta!')
        if (onAuthSuccess) {
          onAuthSuccess(data.user)
        }
      }
    } catch (error) {
      console.error('Error de autenticación:', error)
      
      // Mensajes de error más amigables
      let mensajeError = 'Ocurrió un error inesperado'
      
      if (error.message.includes('Invalid login credentials')) {
        mensajeError = 'Email o contraseña incorrectos'
      } else if (error.message.includes('Email not confirmed')) {
        mensajeError = 'Por favor confirma tu email antes de iniciar sesión'
      } else if (error.message.includes('User already registered')) {
        mensajeError = 'Este email ya está registrado. ¿Quieres iniciar sesión?'
      } else if (error.message.includes('Password should be at least 6 characters')) {
        mensajeError = 'La contraseña debe tener al menos 6 caracteres'
      } else if (error.message) {
        mensajeError = error.message
      }
      
      setError(mensajeError)
    } finally {
      setCargando(false)
    }
  }

  const cambiarModo = () => {
    setModo(modo === 'login' ? 'registro' : 'login')
    setError('')
    setMensaje('')
    setFormData({ email: '', password: '', confirmPassword: '', nombreCompleto: '' })
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-elements">
          <Sparkles className="floating-icon icon-1" />
          <Heart className="floating-icon icon-2" />
          <Sparkles className="floating-icon icon-3" />
        </div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-circle">
              <User className="user-icon" />
            </div>
          </div>
          <h2>{modo === 'login' ? 'Bienvenido de vuelta' : 'Únete a nosotros'}</h2>
          <p>{modo === 'login' 
            ? 'Continúa tu camino de sanación emocional' 
            : 'Comienza tu viaje hacia la sanación integral'
          }</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="alert alert-success">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {modo === 'registro' && (
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre completo</label>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  disabled={cargando}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                disabled={cargando}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                disabled={cargando}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                disabled={cargando}
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {modo === 'registro' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma tu contraseña"
                  disabled={cargando}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={cargando}
          >
            {cargando 
              ? (modo === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...') 
              : (modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta')
            }
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button"
              className="link-button"
              onClick={cambiarModo}
              disabled={cargando}
            >
              {modo === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
