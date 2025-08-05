import { useState, useEffect } from 'react'
import { Search, Heart, Sparkles, Lotus } from 'lucide-react'
import SearchBar from './SearchBar'
import WelcomeSection from './WelcomeSection'
import { dolenciasService } from '../lib/database.js'
import dolenciasData from '../data/dolenciasEjemplo.json'
import './HomePage.css'

function HomePage({ onNavigate }) {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query) => {
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

  return (
    <div className="home-page">
      <WelcomeSection />
      
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
          
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Resultados de tu búsqueda</h3>
              {searchResults.map((resultado, index) => (
                <div key={index} className="result-card fade-in">
                  <div className="result-header">
                    <h4>{resultado.nombre || resultado.dolencia}</h4>
                    <span className="category-tag">{resultado.categoria}</span>
                  </div>
                  <p className="result-description">{resultado.descripcion}</p>
                  <div className="result-actions">
                    <button className="save-btn">
                      <Heart size={16} />
                      Guardar en mi progreso
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="features-section">
          <h3>Tu camino hacia la sanación integral</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Search />
              </div>
              <h4>Búsqueda Instantánea</h4>
              <p>Encuentra el significado emocional de cualquier dolencia física</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Heart />
              </div>
              <h4>Progreso Personal</h4>
              <p>Registra tu evolución emocional y sanación interior</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Lotus />
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
