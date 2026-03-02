# TRAQ.ai Email Generator

A professional AI-powered email generation platform that creates personalized sales emails for prospects using advanced AI analysis. The application enriches prospect data from multiple sources (LinkedIn, company websites) and generates 6 unique email variants tailored to each prospect's personality profile and business context.

## Features

- **CSV Upload**: Upload prospect lists via CSV files with drag-and-drop support
- **Multi-Source Enrichment**: Automatically enriches prospect data from:
  - LinkedIn profiles
  - Company websites
  - Public business data
- **AI Persona Analysis**: Uses DISC personality profiling to tailor messaging
- **6 Unique Email Variants**: Generates diverse approaches for each prospect:
  - Competitor Intelligence
  - Industry Statistics
  - Methodology-focused
  - DISC-tailored
  - Tool Gap analysis
  - Scale & Value proposition
- **Real-time Pipeline Visualization**: Beautiful animated flow showing the AI processing pipeline
- **Responsive Design**: Modern, professional UI with glassmorphism effects
- **Batch Processing**: Process multiple prospects in a single session

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool and dev server
- **CSS3** - Custom styling with animations and glassmorphism
- **Axios** - HTTP client for API calls
- **PapaParse** - CSV parsing library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web application framework
- **Lamatic API** - AI workflow orchestration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Lamatic API key ([Get one here](https://lamatic.ai))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/traq-email-generator.git
   cd traq-email-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your Lamatic API key:
   ```env
   LAMATIC_API_KEY=your_lamatic_api_key_here
   PORT=3001
   ```

## Usage

### Development Mode

Run both frontend and backend in development:

```bash
# Terminal 1 - Start the backend server
npm run server

# Terminal 2 - Start the Vite dev server
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and the API at `http://localhost:3001` (backend).

### Production Build

Build the frontend for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Uploading Prospects

1. Prepare a CSV file with the following required columns:
   - `First Name` or `FirstName`
   - `Last Name` or `LastName`
   - `Email`
   - `Title`
   - `Company Name` or `CompanyName` or `company`
   - `Company Domain` or `CompanyDomain` (optional)
   - `LinkedIn Profile` (optional)
   - `Industry` (optional)

2. Upload the CSV file using the drag-and-drop interface or file picker

3. Preview your data in the table

4. Click "Generate Personalized Emails" to start processing

5. Watch the real-time pipeline visualization as the AI:
   - Normalizes prospect data
   - Enriches from LinkedIn and websites
   - Analyzes personality profiles
   - Generates 6 unique email variants per prospect

6. View and copy your generated emails

## CSV Format Example

```csv
First Name,Last Name,Email,Title,Company Name,Industry
Hannah,Sackett,hannah.sackett@neocol.com,Senior Director Sales Performance,Neocol,Technology and business services
```

## API Endpoints

### POST `/api/generate-emails`

Generates personalized emails for prospects from CSV data.

**Request**: JSON
```json
{
  "csvData": [
    {
      "First Name": "Hannah",
      "Last Name": "Sackett",
      "Email": "hannah.sackett@neocol.com",
      "Title": "Senior Director",
      "Company Name": "Neocol"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "profile": {
        "first_name": "Hannah",
        "last_name": "Sackett",
        "prospect_email": "hannah.sackett@neocol.com",
        "title": "Senior Director",
        "company": "Neocol",
        "industry": "Technology",
        "disc_profile": "C",
        "persona": "Data-driven sales leader..."
      },
      "emails": [
        {
          "variant": 1,
          "approach": "Competitor Intel",
          "subject": "...",
          "body": "..."
        }
      ]
    }
  ]
}
```

### GET `/api/health`

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

## Project Structure

```
traq-email-generator/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with logo
│   │   ├── Header.css
│   │   ├── FileUpload.jsx          # CSV upload component
│   │   ├── FileUpload.css
│   │   ├── DataPreview.jsx         # Prospect data table
│   │   ├── DataPreview.css
│   │   ├── FlowVisualization.jsx   # AI pipeline animation
│   │   ├── FlowVisualization.css
│   │   ├── EmailDisplay.jsx        # Generated emails viewer
│   │   ├── EmailDisplay.css
│   │   ├── Toast.jsx               # Notification system
│   │   ├── Toast.css
│   │   ├── Footer.jsx              # App footer
│   │   └── Footer.css
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Global app styles
│   ├── index.css                   # CSS variables and reset
│   └── main.jsx                    # React entry point
├── server/
│   └── index.js                    # Express API server
├── public/
│   └── lamatic-logo.jpeg           # Company logo
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## Features in Detail

### AI Pipeline Stages

1. **Normalize Prospect Data**: Cleans and standardizes input data
2. **Parallel Enrichment**: Simultaneously fetches data from LinkedIn and company websites
3. **AI Persona Analysis**: Analyzes personality (DISC profile) and builds communication strategy
4. **6 Email Generators**: Creates diverse email approaches in parallel
5. **Finalize Results**: Merges and formats all email variants

### Email Variants

1. **Competitor Intel**: Focuses on competitive advantages
2. **Industry Stat**: Leverages industry trends and statistics
3. **Methodology**: Emphasizes your unique approach and process
4. **DISC Tailored**: Personalized based on prospect's personality profile
5. **Tool Gap**: Addresses specific pain points and gaps
6. **Scale & Value**: Highlights scalability and value proposition

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LAMATIC_API_KEY` | Your Lamatic API authentication key | Yes | - |
| `PORT` | Backend server port | No | 3001 |

## Error Handling

The application handles various error scenarios:
- Invalid CSV format
- Missing required columns
- API connection failures
- Rate limiting
- Invalid prospect data
- Network timeouts

All errors are displayed with user-friendly messages and suggestions for resolution.

## Security Notes

- **Never commit your `.env` file** - It contains sensitive API keys
- The `.env.example` is safe to commit (contains no real keys)
- API keys are only stored server-side
- All API calls are proxied through the backend to hide credentials

## Performance

- Processes prospects in real-time with visual feedback
- Batch API calls for efficiency
- Responsive UI during processing
- Optimized bundle size with Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@traq.ai
- Documentation: [https://docs.traq.ai](https://docs.traq.ai)

## Acknowledgments

- Built with [Lamatic.ai](https://lamatic.ai) - AI workflow orchestration platform
- UI inspired by modern glassmorphism design trends
- Icons and emojis for enhanced UX

---

**Built with ❤️ for sales teams everywhere**
