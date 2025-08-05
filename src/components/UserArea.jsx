import { useState, useEffect } from 'react'
import { Heart, BookOpen, TrendingUp, Calendar, Plus, Edit3, Trash2, Save, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { progresosService, dolenciasGuardadasService } from '../lib/database.js'
import './UserArea.css'

function UserArea({ onNavigate }) {
  const { usuario } = useAuth()
  const [activeTab, setActiveTab] = useState('guardadas')
  const [dolenciasGuardadas, setDolenciasGuardadas] = useState([])
  const [progresos, setProgresos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [editandoNota, setEditandoNota] = useState(null)
  const [nuevaNota, setNuevaNota] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [usuario])

  const cargarDatos = async () => {
    if (!usuario) return

    setCargando(true)
    try {
      const [guardadasResult, progresosResult] = await Promise.all([
        dolenciasGuardadasService.obtenerGuardadas(usuario.id),
        progresosService.obtenerProgresos(usuario.id)
      ])

      if (!guardadasResult.error) {
        setDolenciasGuardadas(guardadasResult.data)
      }

      if (!progresosResult.error) {
        setProgresos(progresosResult.data)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setCargando(false)
    }
  }

  const crearProgreso = async (dolenciaId, nota = '') => {
    try {
      const nuevoProgreso = {
        usuario_id: usuario.id,
        dolencia_id: dolenciaId,
        nota_personal: nota,
        nivel_mejora: 5, // Valor inicial
        estado: 'activo'
      }

      const { data, error } = await progresosService.crearProgreso(nuevoProgreso)
      
      if (!error && data) {
        await cargarDatos() // Recargar datos
      }
    } catch (error) {
      console.error('Error creando progreso:', error)
    }
  }

  const actualizarNota = async (progresoId, nuevaNotaTexto) => {
    try {
      const { data, error } = await progresosService.actualizarProgreso(progresoId, {
        nota_personal: nuevaNotaTexto
      })

      if (!error) {
        setProgresos(prev => 
          prev.map(p => p.id === progresoId ? { ...p, nota_personal: nuevaNotaTexto } : p)
        )
        setEditandoNota(null)
        setNuevaNota('')
      }
    } catch (error) {
      console.error('Error actualizando nota:', error)
    }
  }

  const eliminarProgreso = async (progresoId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este progreso?')) return

    try {
      const { error } = await progresosService.eliminarProgreso(progresoId)
      
      if (!error) {
        setProgresos(prev => prev.filter(p => p.id !== progresoId))
      }
    } catch (error) {
      console.error('Error eliminando progreso:', error)
    }
  }

  const iniciarEdicion = (progreso) => {
    setEditandoNota(progreso.id)
    setNuevaNota(progreso.nota_personal || '')
  }

  const cancelarEdicion = () => {
    setEditandoNota(null)
    setNuevaNota('')
  }

  if (cargando) {
    return (
      <div className="user-area-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tu área personal...</p>
      </div>
    )
  }

  return (
    <div className="user-area">
      <div className="user-area-container">
        <header className="user-area-header">
          <h1>Mi Área Personal</h1>
          <p>Seguimiento de tu camino hacia la sanación emocional</p>
        </header>

        <div className="user-tabs">
          <button 
            className={`tab ${activeTab === 'guardadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('guardadas')}
          >
            <Heart size={18} />
            <span>Dolencias Guardadas</span>
            <span className="tab-count">{dolenciasGuardadas.length}</span>
          </button>
          
          <button 
            className={`tab ${activeTab === 'progresos' ? 'active' : ''}`}
            onClick={() => setActiveTab('progresos')}
          >
            <TrendingUp size={18} />
            <span>Mi Progreso</span>
            <span className="tab-count">{progresos.length}</span>
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'guardadas' && (
            <div className="guardadas-section">
              <div className="section-header">
                <h2>Dolencias que has guardado</h2>
                <p>Revisa las dolencias que has marcado para seguimiento</p>
              </div>

              {dolenciasGuardadas.length === 0 ? (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <h3>No tienes dolencias guardadas</h3>
                  <p>Busca dolencias en la página principal y guárdalas para hacer seguimiento</p>
                  <button 
                    className="cta-button"
                    onClick={() => onNavigate('home')}
                  >
                    Buscar dolencias
                  </button>
                </div>
              ) : (
                <div className="dolencias-grid">
                  {dolenciasGuardadas.map((item) => (
                    <div key={item.id} className="dolencia-card">
                      <div className="dolencia-header">
                        <h3>{item.dolencias.nombre}</h3>
                        <span className="dolencia-categoria">{item.dolencias.categoria}</span>
                      </div>
                      <p className="dolencia-descripcion">{item.dolencias.descripcion}</p>
                      {item.notas_personales && (
                        <div className="notas-personales">
                          <strong>Tus notas:</strong> {item.notas_personales}
                        </div>
                      )}
                      <div className="dolencia-actions">
                        <button 
                          className="action-btn create-progress"
                          onClick={() => crearProgreso(item.dolencias.id)}
                        >
                          <Plus size={16} />
                          Crear progreso
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'progresos' && (
            <div className="progresos-section">
              <div className="section-header">
                <h2>Tu progreso de sanación</h2>
                <p>Registra y sigue tu evolución emocional</p>
              </div>

              {progresos.length === 0 ? (
                <div className="empty-state">
                  <TrendingUp size={48} />
                  <h3>No tienes registros de progreso</h3>
                  <p>Guarda algunas dolencias y crea registros de progreso para hacer seguimiento</p>
                  <button 
                    className="cta-button"
                    onClick={() => setActiveTab('guardadas')}
                  >
                    Ver dolencias guardadas
                  </button>
                </div>
              ) : (
                <div className="progresos-lista">
                  {progresos.map((progreso) => (
                    <div key={progreso.id} className="progreso-card">
                      <div className="progreso-header">
                        <div className="progreso-info">
                          <h3>{progreso.dolencias?.nombre || 'Dolencia'}</h3>
                          <div className="progreso-meta">
                            <span className="progreso-categoria">{progreso.dolencias?.categoria}</span>
                            <span className="progreso-fecha">
                              <Calendar size={14} />
                              {new Date(progreso.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="progreso-actions">
                          <button 
                            className="action-btn edit"
                            onClick={() => iniciarEdicion(progreso)}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => eliminarProgreso(progreso.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="progreso-content">
                        {editandoNota === progreso.id ? (
                          <div className="editar-nota">
                            <textarea
                              value={nuevaNota}
                              onChange={(e) => setNuevaNota(e.target.value)}
                              placeholder="Escribe tus notas sobre este progreso..."
                              rows={4}
                            />
                            <div className="nota-actions">
                              <button 
                                className="action-btn save"
                                onClick={() => actualizarNota(progreso.id, nuevaNota)}
                              >
                                <Save size={16} />
                                Guardar
                              </button>
                              <button 
                                className="action-btn cancel"
                                onClick={cancelarEdicion}
                              >
                                <X size={16} />
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="nota-display">
                            {progreso.nota_personal ? (
                              <p>{progreso.nota_personal}</p>
                            ) : (
                              <p className="nota-vacia">No hay notas. Haz clic en editar para agregar tus reflexiones.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserArea
