import { useState, useEffect } from 'react'
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { consultasService } from '../lib/database.js'
import './ConsultasOnline.css'

function ConsultasOnline({ onNavigate }) {
  const { usuario, estaAutenticado } = useAuth()
  const [consultas, setConsultas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)
  const [enviandoConsulta, setEnviandoConsulta] = useState(false)
  
  const [formulario, setFormulario] = useState({
    mensaje: '',
    dolencia_relacionada: '',
    prioridad: 'normal'
  })

  useEffect(() => {
    if (estaAutenticado && usuario) {
      cargarConsultas()
    }
  }, [usuario, estaAutenticado])

  const cargarConsultas = async () => {
    setCargando(true)
    try {
      const { data, error } = await consultasService.obtenerConsultas(usuario.id)
      if (!error) {
        setConsultas(data)
      }
    } catch (error) {
      console.error('Error cargando consultas:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formulario.mensaje.trim()) {
      alert('Por favor escribe tu mensaje')
      return
    }

    setEnviandoConsulta(true)
    
    try {
      const nuevaConsulta = {
        usuario_id: usuario.id,
        mensaje: formulario.mensaje.trim(),
        dolencia_relacionada: formulario.dolencia_relacionada.trim() || null,
        prioridad: formulario.prioridad,
        estado: 'pendiente'
      }

      const { data, error } = await consultasService.crearConsulta(nuevaConsulta)
      
      if (!error) {
        setFormulario({
          mensaje: '',
          dolencia_relacionada: '',
          prioridad: 'normal'
        })
        setMostrandoFormulario(false)
        await cargarConsultas() // Recargar la lista
        alert('Consulta enviada exitosamente. Te responderemos pronto.')
      } else {
        throw error
      }
    } catch (error) {
      console.error('Error enviando consulta:', error)
      alert('Error enviando la consulta. Por favor intenta de nuevo.')
    } finally {
      setEnviandoConsulta(false)
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="estado-icon pendiente" size={16} />
      case 'en_revision':
        return <AlertCircle className="estado-icon revision" size={16} />
      case 'respondida':
        return <CheckCircle className="estado-icon respondida" size={16} />
      default:
        return <Clock className="estado-icon" size={16} />
    }
  }

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente'
      case 'en_revision':
        return 'En revisión'
      case 'respondida':
        return 'Respondida'
      case 'cerrada':
        return 'Cerrada'
      default:
        return 'Desconocido'
    }
  }

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'baja':
        return '#10b981'
      case 'normal':
        return '#6b7280'
      case 'alta':
        return '#f59e0b'
      case 'urgente':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  if (!estaAutenticado) {
    return (
      <div className="consultas-no-auth">
        <div className="no-auth-content">
          <MessageCircle size={64} />
          <h2>Consultas con Expertos</h2>
          <p>Inicia sesión para enviar consultas a nuestros expertos en biodescodificación</p>
          <button 
            className="auth-button"
            onClick={() => onNavigate('auth')}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  if (cargando) {
    return (
      <div className="consultas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tus consultas...</p>
      </div>
    )
  }

  return (
    <div className="consultas-online">
      <div className="consultas-container">
        <header className="consultas-header">
          <h1>Consultas con Expertos</h1>
          <p>Conecta con profesionales en biodescodificación para resolver tus dudas</p>
          
          <button 
            className="nueva-consulta-btn"
            onClick={() => setMostrandoFormulario(true)}
          >
            <Plus size={18} />
            Nueva consulta
          </button>
        </header>

        {mostrandoFormulario && (
          <div className="consulta-formulario">
            <div className="formulario-header">
              <h3>Nueva consulta</h3>
              <button 
                className="cerrar-formulario"
                onClick={() => setMostrandoFormulario(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="dolencia_relacionada">Dolencia relacionada (opcional)</label>
                <input
                  type="text"
                  id="dolencia_relacionada"
                  name="dolencia_relacionada"
                  value={formulario.dolencia_relacionada}
                  onChange={handleInputChange}
                  placeholder="ej: dolor de cabeza, ansiedad, gastritis..."
                  disabled={enviandoConsulta}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prioridad">Prioridad</label>
                <select
                  id="prioridad"
                  name="prioridad"
                  value={formulario.prioridad}
                  onChange={handleInputChange}
                  disabled={enviandoConsulta}
                >
                  <option value="baja">Baja</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Tu consulta *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formulario.mensaje}
                  onChange={handleInputChange}
                  placeholder="Describe tu situación, síntomas, emociones o cualquier duda que tengas sobre biodescodificación..."
                  rows={6}
                  required
                  disabled={enviandoConsulta}
                />
              </div>

              <div className="formulario-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrandoFormulario(false)}
                  disabled={enviandoConsulta}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-enviar"
                  disabled={enviandoConsulta || !formulario.mensaje.trim()}
                >
                  <Send size={16} />
                  {enviandoConsulta ? 'Enviando...' : 'Enviar consulta'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="consultas-lista">
          {consultas.length === 0 ? (
            <div className="empty-state">
              <MessageCircle size={48} />
              <h3>No tienes consultas</h3>
              <p>Envía tu primera consulta a nuestros expertos en biodescodificación</p>
              <button 
                className="primera-consulta-btn"
                onClick={() => setMostrandoFormulario(true)}
              >
                Enviar primera consulta
              </button>
            </div>
          ) : (
            <>
              <div className="lista-header">
                <h2>Tus consultas ({consultas.length})</h2>
              </div>
              
              {consultas.map((consulta) => (
                <div key={consulta.id} className="consulta-card">
                  <div className="consulta-meta">
                    <div className="meta-left">
                      {getEstadoIcon(consulta.estado)}
                      <span className="estado-texto">{getEstadoTexto(consulta.estado)}</span>
                      <span 
                        className="prioridad-badge"
                        style={{ backgroundColor: getPrioridadColor(consulta.prioridad) }}
                      >
                        {consulta.prioridad}
                      </span>
                    </div>
                    <div className="meta-right">
                      <span className="fecha">
                        <Calendar size={14} />
                        {new Date(consulta.fecha_consulta).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {consulta.dolencia_relacionada && (
                    <div className="dolencia-relacionada">
                      <strong>Relacionado con:</strong> {consulta.dolencia_relacionada}
                    </div>
                  )}

                  <div className="consulta-mensaje">
                    <h4>Tu consulta:</h4>
                    <p>{consulta.mensaje}</p>
                  </div>

                  {consulta.respuesta && (
                    <div className="consulta-respuesta">
                      <h4>Respuesta del experto:</h4>
                      <p>{consulta.respuesta}</p>
                      {consulta.fecha_respuesta && (
                        <div className="respuesta-fecha">
                          Respondido el {new Date(consulta.fecha_respuesta).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsultasOnline
