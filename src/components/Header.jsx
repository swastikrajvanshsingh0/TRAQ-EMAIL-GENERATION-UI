import React from 'react'
import './Header.css'

const Header = () => {
  const flowUrl = import.meta.env.VITE_LAMATIC_FLOW_URL || 'https://lamatic.ai'

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
        <div className="header-actions">
          <a 
            href={flowUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flow-link"
            title="View AI Workflow on Lamatic"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            View Workflow
          </a>
          <div className="header-badge">
            <span>AI-Powered</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
