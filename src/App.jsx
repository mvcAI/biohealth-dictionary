import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import HomePage from './components/HomePage'
import Auth from './components/Auth'
import UserArea from './components/UserArea'
import Navigation from './components/Navigation'
import './App.css'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home')
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'auth':
        return <Auth onAuthSuccess={() => setCurrentPage('home')} />
      case 'profile':
        return usuario ? <UserArea onNavigate={setCurrentPage} /> : <Auth onAuthSuccess={() => setCurrentPage('profile')} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
