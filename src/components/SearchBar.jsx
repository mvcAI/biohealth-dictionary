import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    // Búsqueda en tiempo real con debounce
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      onSearch(value)
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-container">
        <Search className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Busca una dolencia o síntoma... ej: dolor de cabeza, miedo, control"
          className="search-input"
          disabled={isLoading}
        />
        {isLoading && <Loader2 className="loading-icon" />}
      </div>
      <button type="submit" className="search-button" disabled={isLoading}>
        Buscar
      </button>
    </form>
  )
}

export default SearchBar
