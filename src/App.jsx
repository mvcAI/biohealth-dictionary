import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Your App</h1>
        <p>Your application is now working!</p>
        <div className="counter">
          <button onClick={() => setCount((count) => count - 1)}>
            -
          </button>
          <span className="count">{count}</span>
          <button onClick={() => setCount((count) => count + 1)}>
            +
          </button>
        </div>
      </header>
    </div>
  )
}

export default App
