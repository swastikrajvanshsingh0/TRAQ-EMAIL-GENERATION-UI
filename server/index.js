import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/api/generate-emails', async (req, res) => {
  try {
    const apiKey = process.env.LAMATIC_API_KEY
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('❌ LAMATIC_API_KEY is not set in .env file')
      return res.status(500).json({ 
        error: 'API key not configured. Please add LAMATIC_API_KEY to .env file' 
      })
    }

    console.log('✅ API Key found:', apiKey.substring(0, 10) + '...')

    const {
      Qty,
      FirstName,
      LastName,
      Email,
      Title,
      Role,
      CompanyName,
      CompanyDomain,
      Industry,
      LinkedInProfile,
      DiscAnalysis
    } = req.body

    console.log('📤 Processing request for:', FirstName, LastName, '-', CompanyName)

    const query = `query ExecuteWorkflow($workflowId: String! $Qty: String $FirstName: String $LastName: String $Email: String $Title: String $Role: String $CompanyName: String $CompanyDomain: String $Industry: String $LinkedInProfile: String $DiscAnalysis: String) { executeWorkflow(workflowId: $workflowId payload: {Qty: $Qty FirstName: $FirstName LastName: $LastName Email: $Email Title: $Title Role: $Role CompanyName: $CompanyName CompanyDomain: $CompanyDomain Industry: $Industry LinkedInProfile: $LinkedInProfile DiscAnalysis: $DiscAnalysis}) { status result } }`

    const variables = {
      workflowId: process.env.LAMATIC_WORKFLOW_ID || "29897670-6e44-46a4-be97-ec7d133c71a5",
      Qty: Qty || "",
      FirstName: FirstName || "",
      LastName: LastName || "",
      Email: Email || "",
      Title: Title || "",
      Role: Role || "",
      CompanyName: CompanyName || "",
      CompanyDomain: CompanyDomain || "",
      Industry: Industry || "",
      LinkedInProfile: LinkedInProfile || "",
      DiscAnalysis: DiscAnalysis || ""
    }

    console.log('🔑 Using API Key (first 20 chars):', apiKey.substring(0, 20) + '...')
    console.log('🌐 Calling Lamatic API...')

    const apiUrl = process.env.LAMATIC_API_URL || 'https://sandbox566-flowforcontent246.lamatic.dev/graphql'
    const projectId = process.env.LAMATIC_PROJECT_ID || '5ff16d78-7137-45b7-a320-a9e1f4c8d4bd'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'x-project-id': projectId
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    console.log('📡 Response status:', response.status)

    const data = await response.json()
    console.log('📥 Response data:', JSON.stringify(data).substring(0, 200) + '...')

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, data)
      return res.status(response.status).json({ 
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        details: data
      })
    }

    if (data.errors) {
      console.error('❌ GraphQL Error:', data.errors)
      return res.status(400).json({ 
        error: data.errors[0].message,
        details: data.errors 
      })
    }

    console.log('✅ Success!')
    res.json(data.data.executeWorkflow)
  } catch (error) {
    console.error('❌ Server Error:', error)
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    })
  }
})

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`)
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/generate-emails`)
  
  if (!process.env.LAMATIC_API_KEY || process.env.LAMATIC_API_KEY === 'your_api_key_here') {
    console.error('\n❌ WARNING: LAMATIC_API_KEY is not set in .env file!')
    console.error('Please edit .env file and add your API key\n')
  } else {
    console.log(`✅ API Key loaded: ${process.env.LAMATIC_API_KEY.substring(0, 20)}...\n`)
  }
})
