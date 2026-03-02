import React, { useState } from 'react'
import './EmailDisplay.css'

const EmailDisplay = ({ emails }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const [copiedEmail, setCopiedEmail] = useState(null)
  const [expandedProspect, setExpandedProspect] = useState(false)

  const currentResult = emails[selectedRowIndex]

  const copyToClipboard = (subject, body, emailId) => {
    const formattedEmail = `Subject: ${subject}\n\n${body}`
    navigator.clipboard.writeText(formattedEmail).then(() => {
      setCopiedEmail(emailId)
      setTimeout(() => setCopiedEmail(null), 2000)
    })
  }

  return (
    <div className="email-display-section">
      <div className="results-header">
        <h2>Generated Emails</h2>
        <p className="results-subtitle">
          {emails.filter(e => e.success).length} of {emails.length} prospects processed successfully
        </p>
      </div>

      {emails.length > 1 && (
        <div className="prospect-selector">
          <label>Select Prospect:</label>
          <select
            value={selectedRowIndex}
            onChange={(e) => setSelectedRowIndex(Number(e.target.value))}
          >
            {emails.map((result, idx) => (
              <option key={idx} value={idx}>
                {result.rowData['First Name'] || result.rowData['FirstName'] || 'Unknown'}{' '}
                {result.rowData['Last Name'] || result.rowData['LastName'] || ''} - {' '}
                {result.rowData['Company Name'] || result.rowData['CompanyName'] || result.rowData['company'] || 'Unknown Company'}
                {!result.success && ' (Failed)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentResult && currentResult.success && (
        <>
          {currentResult.profile && (
            <div className="prospect-card">
              <div className="prospect-card-header" onClick={() => setExpandedProspect(!expandedProspect)}>
                <div className="prospect-identity">
                  <h3 className="prospect-name">
                    {currentResult.profile.first_name} {currentResult.profile.last_name}
                  </h3>
                  <p className="prospect-role">
                    {currentResult.profile.title} at {currentResult.profile.company || 
                     currentResult.rowData['Company Name'] || 
                     currentResult.rowData['CompanyName'] || 
                     currentResult.rowData['company'] || 
                     'N/A'}
                  </p>
                </div>
                <button className="toggle-btn" aria-label="Toggle details">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: expandedProspect ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {expandedProspect && (
                <div className="prospect-detail-grid">
                  <div className="prospect-detail-item">
                    <span className="detail-key">Email</span>
                    <span className="detail-val">{currentResult.profile.prospect_email || 'N/A'}</span>
                  </div>
                  <div className="prospect-detail-item">
                    <span className="detail-key">Industry</span>
                    <span className="detail-val">{currentResult.profile.industry || 'N/A'}</span>
                  </div>
                  {currentResult.profile.disc_profile && (
                    <div className="prospect-detail-item">
                      <span className="detail-key">DISC Profile</span>
                      <span className="detail-val disc-tag">{currentResult.profile.disc_profile}</span>
                    </div>
                  )}
                  {currentResult.profile.persona && (
                    <div className="prospect-detail-item full-width">
                      <span className="detail-key">Persona</span>
                      <span className="detail-val">{currentResult.profile.persona}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="emails-grid">
            {currentResult.emails.map((email, idx) => (
              <div key={idx} className="email-card">
                <div className="email-card-header">
                  <div className="email-variant-info">
                    <span className="variant-num">Email {email.variant}</span>
                    <span className="variant-type">{email.approach}</span>
                  </div>
                  <button
                    className={`copy-btn ${copiedEmail === `${selectedRowIndex}-${idx}` ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(email.subject, email.body, `${selectedRowIndex}-${idx}`)}
                  >
                    {copiedEmail === `${selectedRowIndex}-${idx}` ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <div className="email-content">
                  <div className="email-subject-line">
                    <span className="subject-tag">Subject</span>
                    <span className="subject-text">{email.subject}</span>
                  </div>
                  <div className="email-body">
                    <pre>{email.body}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {currentResult && !currentResult.success && (
        <div className="error-result">
          <h3>Failed to process this prospect</h3>
          <p>Error: {currentResult.error}</p>
        </div>
      )}
    </div>
  )
}

export default EmailDisplay
