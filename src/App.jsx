import React, { useState, useRef, useCallback } from 'react'
import Papa from 'papaparse'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import EmailDisplay from './components/EmailDisplay'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import ProcessingScreen from './components/ProcessingScreen'
import './App.css'

const LAMATIC_API_KEY = import.meta.env.VITE_LAMATIC_API_KEY
const LAMATIC_API_URL = import.meta.env.VITE_LAMATIC_API_URL
const LAMATIC_WORKFLOW_ID = import.meta.env.VITE_LAMATIC_WORKFLOW_ID
const LAMATIC_PROJECT_ID = import.meta.env.VITE_LAMATIC_PROJECT_ID

function App() {
  const [csvData, setCsvData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedEmails, setGeneratedEmails] = useState([])
  const [completedCount, setCompletedCount] = useState(0)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const abortControllerRef = useRef(null)

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

  const formatEmailBody = useCallback((body) => {
    if (!body) return body
    let formatted = body.replace(/\|\|\|/g, '\n\n')
    formatted = formatted.replace(/\n{3,}/g, '\n\n').trim()
    return formatted
  }, [])

  const GRAPHQL_QUERY = `query ExecuteWorkflow($workflowId: String! $Qty: String $FirstName: String $LastName: String $Email: String $Title: String $Role: String $CompanyName: String $CompanyDomain: String $Industry: String $LinkedInProfile: String $DiscAnalysis: String) { executeWorkflow(workflowId: $workflowId payload: {Qty: $Qty FirstName: $FirstName LastName: $LastName Email: $Email Title: $Title Role: $Role CompanyName: $CompanyName CompanyDomain: $CompanyDomain Industry: $Industry LinkedInProfile: $LinkedInProfile DiscAnalysis: $DiscAnalysis}) { status result } }`

  const buildVariables = useCallback((row) => ({
    workflowId: LAMATIC_WORKFLOW_ID,
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
  }), [])

  const parseRowResult = useCallback((data, row, index) => {
    const workflowResult = data.data.executeWorkflow
    const result = typeof workflowResult.result === 'string'
      ? JSON.parse(workflowResult.result)
      : workflowResult.result

    const output = result.output || result
    const emails = []

    for (let j = 1; j <= 6; j++) {
      const emailKey = `email_${j}`
      if (output.content?.[`${emailKey}_subject`]) {
        emails.push({
          variant: j,
          subject: output.content[`${emailKey}_subject`].replace(/\n/g, ' ').trim(),
          body: formatEmailBody(output.content[`${emailKey}_body`]),
          approach: ['Competitor Intel', 'Industry Stat', 'Methodology Gap', 'DISC Tailored', 'Tool Gap Wedge', 'Scale + Value'][j - 1]
        })
      }
    }

    return { rowIndex: index, rowData: row, profile: output.profile || {}, emails, success: true }
  }, [formatEmailBody])

  const generateEmails = async () => {
    if (!csvData || csvData.length === 0) {
      showToast('No data to process', 'error')
      return
    }

    const validation = validateCSVColumns(csvData)
    if (!validation.valid) {
      showToast(`Cannot proceed. Missing required columns: ${validation.missing.join(', ')}`, 'error')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsProcessing(true)
    setError(null)
    setGeneratedEmails([])
    setCompletedCount(0)

    const requestBodies = csvData.map(row =>
      JSON.stringify({ query: GRAPHQL_QUERY, variables: buildVariables(row) })
    )

    const headers = {
      'Authorization': `Bearer ${LAMATIC_API_KEY}`,
      'Content-Type': 'application/json',
      'x-project-id': LAMATIC_PROJECT_ID
    }

    console.log(`[TRAQ] Firing ${requestBodies.length} requests in parallel at ${new Date().toISOString()}`)

    const promises = requestBodies.map((body, index) => {
      console.log(`[TRAQ] Row ${index + 1} request dispatched at ${new Date().toISOString()}`)
      return fetch(LAMATIC_API_URL, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(data => {
          console.log(`[TRAQ] Row ${index + 1} completed at ${new Date().toISOString()}`)
          if (data?.data?.executeWorkflow) {
            const result = parseRowResult(data, csvData[index], index)
            setCompletedCount(prev => prev + 1)
            return result
          }
          throw new Error('Invalid API response')
        })
        .catch(err => {
          if (err.name === 'AbortError') return null
          console.error(`[TRAQ] Row ${index + 1} failed:`, err.message)
          setCompletedCount(prev => prev + 1)
          return {
            rowIndex: index,
            rowData: csvData[index],
            emails: [],
            success: false,
            error: err.message || 'Unknown error'
          }
        })
    })

    const settled = await Promise.all(promises)
    const results = settled.filter(Boolean).sort((a, b) => a.rowIndex - b.rowIndex)

    setGeneratedEmails(results)
    setIsProcessing(false)
    setCompletedCount(0)
    abortControllerRef.current = null

    const successCount = results.filter(r => r.success).length
    showToast(`Generated emails for ${successCount} of ${csvData.length} prospects`, successCount > 0 ? 'success' : 'error')
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
              />

              <ProcessingScreen 
                isProcessing={isProcessing}
                totalRows={csvData.length}
                completedCount={completedCount}
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
