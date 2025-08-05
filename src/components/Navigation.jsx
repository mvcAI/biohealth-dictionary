import { useState } from 'react'
import { Home, User, LogOut, Menu, X, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Navigation.css'

function Navigation({ currentPage, onNavigate }) {
  const { usuario, cerrarSesion, estaAutenticado } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleCerrarSesion = async () => {
    try {
      await cerrarSesion()
      onNavigate('home')
      setMenuAbierto(false)
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    }
  }

  const navegarA = (pagina) => {
    onNavigate(pagina)
    setMenuAbierto(false)
  }

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navegarA('home')}>
          <Heart className="logo-icon" />
          <span className="logo-text">Biodescodificación</span>
        </div>

        {/* Menú desktop */}
        <div className="nav-menu">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => navegarA('home')}
          >
            <Home size={18} />
            <span>Inicio</span>
          </button>

          {estaAutenticado ? (
            <>
              <button 
                className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => navegarA('profile')}
              >
                <User size={18} />
                <span>Mi área</span>
              </button>
              
              <button 
                className="nav-item"
                onClick={() => navegarA('consultas')}
              >
                <MessageCircle size={18} />
                <span>Consultas</span>
              </button>

              <div className="nav-user">
                <span className="user-email">{usuario?.email}</span>
                <button className="logout-btn" onClick={handleCerrarSesion}>
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button 
              className="nav-item login-btn"
              onClick={() => navegarA('auth')}
            >
              <User size={18} />
              <span>Iniciar sesión</span>
            </button>
          )}
        </div>

        {/* Botón menú móvil */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <button 
              className={`mobile-nav-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navegarA('home')}
            >
              <Home size={20} />
              <span>Inicio</span>
            </button>

            {estaAutenticado ? (
              <>
                <button 
                  className={`mobile-nav-item ${currentPage === 'profile' ? 'active' : ''}`}
                  onClick={() => navegarA('profile')}
                >
                  <User size={20} />
                  <span>Mi área</span>
                </button>
                
                <button 
                  className="mobile-nav-item"
                  onClick={() => navegarA('consultas')}
                >
                  <MessageCircle size={20} />
                  <span>Consultas</span>
                </button>

                <div className="mobile-user-info">
                  <span className="mobile-user-email">{usuario?.email}</span>
                </div>

                <button className="mobile-nav-item logout" onClick={handleCerrarSesion}>
                  <LogOut size={20} />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <button 
                className="mobile-nav-item login"
                onClick={() => navegarA('auth')}
              >
                <User size={20} />
                <span>Iniciar sesión</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
