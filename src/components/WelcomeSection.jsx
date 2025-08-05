import { Sparkles, Heart, Flower2 } from 'lucide-react'

function WelcomeSection() {
  return (
    <header className="welcome-section">
      <div className="welcome-content">
        <div className="logo-container">
          <div className="logo-mandala">
            <Flower2 className="lotus-icon" />
            <div className="energy-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>
        </div>
        
        <div className="welcome-text">
          <h1 className="main-title">
            Biodescodificación
            <span className="title-accent">
              <Sparkles className="sparkle" />
              Emocional
            </span>
          </h1>
          <p className="subtitle">
            Descubre el lenguaje oculto de tu cuerpo y transforma tu vida a través 
            del autoconocimiento y la sanación emocional
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">
              <Heart size={18} />
              Comenzar mi sanación
            </button>
            <button className="cta-secondary">
              Saber más
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default WelcomeSection
