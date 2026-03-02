import React, { useState } from 'react'
import Papa from 'papaparse'
import axios from 'axios'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import EmailDisplay from './components/EmailDisplay'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import FlowVisualization from './components/FlowVisualization'
import './App.css'

function App() {
  const [csvData, setCsvData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedEmails, setGeneratedEmails] = useState([])
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const REQUIRED_COLUMNS = [
    'First Name', 'FirstName', 'first_name',
    'Last Name', 'LastName', 'last_name',
    'Email', 'email',
    'Title', 'title',
    'Role', 'role',
    'Company Name', 'CompanyName', 'company',
    'Company Domain', 'CompanyDomain', 'domain',
    'Industry', 'industry',
    'LinkedIn Profile', 'LinkedInProfile', 'linkedin'
  ]

  const OPTIONAL_COLUMNS = [
    'Qty', 'qty',
    'Disc Analysis', 'DiscAnalysis', 'disc_analysis'
  ]

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
  }

  const validateCSVColumns = (data) => {
    if (!data || data.length === 0) {
      return { valid: false, missing: ['CSV is empty'] }
    }

    const columns = Object.keys(data[0])
    const missingFields = []

    const hasColumn = (possibleNames) => {
      return possibleNames.some(name => 
        columns.some(col => col.toLowerCase() === name.toLowerCase())
      )
    }

    if (!hasColumn(['First Name', 'FirstName', 'first_name'])) {
      missingFields.push('First Name')
    }
    if (!hasColumn(['Last Name', 'LastName', 'last_name'])) {
      missingFields.push('Last Name')
    }
    if (!hasColumn(['Email', 'email'])) {
      missingFields.push('Email')
    }
    if (!hasColumn(['Title', 'title'])) {
      missingFields.push('Title')
    }
    if (!hasColumn(['Role', 'role'])) {
      missingFields.push('Role')
    }
    if (!hasColumn(['Company Name', 'CompanyName', 'company'])) {
      missingFields.push('Company Name')
    }
    if (!hasColumn(['Company Domain', 'CompanyDomain', 'domain'])) {
      missingFields.push('Company Domain')
    }
    if (!hasColumn(['Industry', 'industry'])) {
      missingFields.push('Industry')
    }
    if (!hasColumn(['LinkedIn Profile', 'LinkedInProfile', 'linkedin'])) {
      missingFields.push('LinkedIn Profile')
    }

    return {
      valid: missingFields.length === 0,
      missing: missingFields
    }
  }

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const validation = validateCSVColumns(results.data)
          
          if (!validation.valid) {
            showToast(
              `Missing required columns: ${validation.missing.join(', ')}. Please add these columns to your CSV file.`,
              'error'
            )
            return
          }

          setCsvData(results.data)
          setGeneratedEmails([])
          setError(null)
          showToast(`Successfully loaded ${results.data.length} rows`, 'success')
        } else {
          showToast('CSV file is empty or invalid', 'error')
        }
      },
      error: (error) => {
        showToast('Failed to parse CSV: ' + error.message, 'error')
      }
    })
  }

  const formatEmailBody = (body) => {
    if (!body) return body
    
    // Replace ||| with line breaks
    let formatted = body.replace(/\|\|\|/g, '\n\n')
    
    // Clean up excessive newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n').trim()
    
    return formatted
  }

  const generateEmails = async () => {
    if (!csvData || csvData.length === 0) {
      showToast('No data to process', 'error')
      return
    }

    const validation = validateCSVColumns(csvData)
    if (!validation.valid) {
      showToast(
        `Cannot proceed. Missing required columns: ${validation.missing.join(', ')}`,
        'error'
      )
      return
    }

    setIsProcessing(true)
    setError(null)
    setGeneratedEmails([])
    setCurrentRowIndex(0)

    const results = []

    for (let i = 0; i < csvData.length; i++) {
      setCurrentRowIndex(i + 1)
      const row = csvData[i]

      try {
        const response = await axios.post('http://localhost:3001/api/generate-emails', {
          Qty: row['Qty'] || row['qty'] || '',
          FirstName: row['First Name'] || row['FirstName'] || row['first_name'] || '',
          LastName: row['Last Name'] || row['LastName'] || row['last_name'] || '',
          Email: row['Email'] || row['email'] || '',
          Title: row['Title'] || row['title'] || '',
          Role: row['Role'] || row['role'] || '',
          CompanyName: row['Company Name'] || row['CompanyName'] || row['company'] || '',
          CompanyDomain: row['Company Domain'] || row['CompanyDomain'] || row['domain'] || '',
          Industry: row['Industry'] || row['industry'] || '',
          LinkedInProfile: row['LinkedIn Profile'] || row['LinkedInProfile'] || row['linkedin'] || '',
          DiscAnalysis: row['Disc Analysis'] || row['DiscAnalysis'] || row['disc_analysis'] || ''
        })

        if (response.data && response.data.result) {
          const result = typeof response.data.result === 'string' 
            ? JSON.parse(response.data.result) 
            : response.data.result

          const output = result.output || result

          const emails = []
          for (let j = 1; j <= 6; j++) {
            const emailKey = `email_${j}`
            if (output.content && output.content[`${emailKey}_subject`]) {
              const subject = output.content[`${emailKey}_subject`].replace(/\n/g, ' ').trim()
              emails.push({
                variant: j,
                subject: subject,
                body: formatEmailBody(output.content[`${emailKey}_body`]),
                approach: ['Competitor Intel', 'Industry Stat', 'Methodology Gap', 'DISC Tailored', 'Tool Gap Wedge', 'Scale + Value'][j - 1]
              })
            }
          }

          results.push({
            rowIndex: i,
            rowData: row,
            profile: output.profile || {},
            emails: emails,
            success: true
          })
        }
      } catch (err) {
        console.error(`Error processing row ${i + 1}:`, err)
        results.push({
          rowIndex: i,
          rowData: row,
          emails: [],
          success: false,
          error: err.response?.data?.error || err.message || 'Unknown error'
        })
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setGeneratedEmails(results)
    setIsProcessing(false)
    setCurrentRowIndex(0)
    showToast(`Successfully generated emails for ${results.filter(r => r.success).length} prospects`, 'success')
  }

  return (
    <div className="app">
      <Header />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>AI-Powered Email Generation</span>
            </div>
            <h1>Generate Personalized Sales Emails</h1>
            <p className="subtitle">
              Upload your CSV file to generate 6 unique, personalized email variants for each prospect using advanced AI analysis
            </p>
            <div className="feature-pills">
              <span className="pill">✓ 6 Unique Variants</span>
              <span className="pill">✓ DISC Analysis</span>
              <span className="pill">✓ Competitor Intel</span>
              <span className="pill">✓ Industry Insights</span>
            </div>
          </div>

          <FileUpload onFileUpload={handleFileUpload} />

          {csvData && csvData.length > 0 && (
            <>
              <DataPreview 
                data={csvData} 
                onGenerate={generateEmails}
                isProcessing={isProcessing}
                currentRow={currentRowIndex}
              />

              <FlowVisualization 
                isProcessing={isProcessing}
                totalRows={csvData.length}
                currentRow={currentRowIndex}
              />

              {generatedEmails.length > 0 && !isProcessing && (
                <EmailDisplay emails={generatedEmails} />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
