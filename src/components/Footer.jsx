import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/lamatic-logo.jpeg" alt="Lamatic Logo" />
        </div>
        <p className="footer-text">
          Built with <a href="https://lamatic.ai" target="_blank" rel="noopener noreferrer">Lamatic.ai</a> - Powering intelligent document analysis
        </p>
      </div>
    </footer>
  )
}

export default Footer
