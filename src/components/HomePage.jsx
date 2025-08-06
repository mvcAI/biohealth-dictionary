import { useState, useEffect } from 'react'
import { Search, Heart, Sparkles, Flower2 } from 'lucide-react'
import SearchBar from './SearchBar'
import WelcomeSection from './WelcomeSection'
import { dolenciasService, dolenciasGuardadasService } from '../lib/database.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext'
import dolenciasData from '../data/dolenciasEjemplo.json'
import './HomePage.css'

function HomePage({ onNavigate }) {
  const { usuario, estaAutenticado } = useAuth()
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [guardandoDolencia, setGuardandoDolencia] = useState(null)
  const [currentQuery, setCurrentQuery] = useState('')

  const handleSearch = async (query) => {
    setCurrentQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      // Intentar buscar en Supabase primero
      const { data, error } = await dolenciasService.buscar(query)

      if (error) {
        console.log('Usando datos locales:', error.message)
        // Si falla Supabase, usar datos locales
        const results = dolenciasData.filter(dolencia =>
          dolencia.dolencia.toLowerCase().includes(query.toLowerCase()) ||
          dolencia.descripcion.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(results.map(d => ({ ...d, nombre: d.dolencia })))
      } else {
        setSearchResults(data)
      }
    } catch (err) {
      console.log('Error de búsqueda, usando datos locales:', err)
      // Fallback a datos locales
      const results = dolenciasData.filter(dolencia =>
        dolencia.dolencia.toLowerCase().includes(query.toLowerCase()) ||
        dolencia.descripcion.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results.map(d => ({ ...d, nombre: d.dolencia })))
    } finally {
      setIsSearching(false)
    }
  }

  const guardarDolencia = async (dolencia) => {
    if (!estaAutenticado) {
      onNavigate('auth')
      return
    }

    setGuardandoDolencia(dolencia.id || dolencia.dolencia)

    try {
      const dolenciaId = dolencia.id || dolencia.dolencia // Para compatibilidad con datos locales
      await dolenciasGuardadasService.guardarDolencia(usuario.id, dolenciaId)

      // Mostrar mensaje de éxito (podrías agregar un toast aquí)
      console.log('Dolencia guardada exitosamente')
    } catch (error) {
      console.error('Error guardando dolencia:', error)
      // Manejar error (podrías mostrar un mensaje de error)
    } finally {
      setGuardandoDolencia(null)
    }
  }

  return (
    <div className="home-page">
      <WelcomeSection onNavigate={onNavigate} />

      <main className="main-content">
        <div className="search-section">
          <div className="search-header">
            <div className="search-icon-container">
              <Search className="search-main-icon" />
              <Sparkles className="sparkle-icon" />
            </div>
            <h2>Descubre el Significado Emocional</h2>
            <p>Busca cualquier dolencia física para entender su mensaje emocional y espiritual</p>
          </div>
          
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          
          {searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Resultados de tu búsqueda ({searchResults.length})</h3>
              {searchResults.map((resultado, index) => (
                <div key={index} className="result-card fade-in">
                  <div className="result-header">
                    <h4>{resultado.nombre || resultado.dolencia}</h4>
                    <span className="category-tag">{resultado.categoria}</span>
                  </div>
                  <p className="result-description">{resultado.descripcion}</p>
                  <div className="result-actions">
                    <button
                      className="save-btn"
                      onClick={() => guardarDolencia(resultado)}
                      disabled={guardandoDolencia === (resultado.id || resultado.dolencia)}
                    >
                      <Heart size={16} />
                      {guardandoDolencia === (resultado.id || resultado.dolencia)
                        ? 'Guardando...'
                        : estaAutenticado
                          ? 'Guardar en mi progreso'
                          : 'Iniciar sesión para guardar'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            currentQuery && !isSearching && (
              <div className="no-results">
                <p>No se encontraron dolencias para "<strong>{currentQuery}</strong>"</p>
                <p>Intenta con términos como: dolor, miedo, ansiedad, control, separación</p>
              </div>
            )
          )}
        </div>

        <div className="features-section">
          <h3>Tu camino hacia la sanación integral</h3>
          <div className="features-grid">
            <div
              className="feature-card clickable"
              onClick={() => {
                document.querySelector('.search-section')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }}
            >
              <div className="feature-icon">
                <Search />
              </div>
              <h4>Búsqueda Instantánea</h4>
              <p>Encuentra el significado emocional de cualquier dolencia física</p>
            </div>

            <div
              className="feature-card clickable"
              onClick={() => {
                if (estaAutenticado) {
                  onNavigate('profile')
                } else {
                  onNavigate('auth')
                }
              }}
            >
              <div className="feature-icon">
                <Heart />
              </div>
              <h4>Progreso Personal</h4>
              <p>Registra tu evolución emocional y sanación interior</p>
            </div>

            <div
              className="feature-card clickable"
              onClick={() => {
                if (estaAutenticado) {
                  onNavigate('consultas')
                } else {
                  onNavigate('auth')
                }
              }}
            >
              <div className="feature-icon">
                <Flower2 />
              </div>
              <h4>Consultas Online</h4>
              <p>Conecta con expertos en biodescodificación</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
