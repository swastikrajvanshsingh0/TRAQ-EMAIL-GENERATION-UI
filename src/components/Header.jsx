import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src="/lamatic-logo.jpeg" alt="Lamatic Logo" className="logo" />
          <div className="brand-text">
            <h2>TRAQ.ai Email Generator</h2>
            <p>Powered by Lamatic.ai</p>
          </div>
        </div>
        <div className="header-badge">
          <span>AI-Powered</span>
        </div>
      </div>
    </header>
  )
}

export default Header
