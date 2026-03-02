# TRAQ.ai Email Generator

AI-powered platform that generates 6 personalized sales email variants for each prospect using advanced personality profiling and multi-source data enrichment.

## Features

- **CSV Upload**: Upload prospect lists with drag-and-drop
- **AI Enrichment**: Automatic data enrichment from LinkedIn and company websites
- **DISC Profiling**: Personality-based email personalization
- **6 Email Variants**: Diverse approaches per prospect (Competitor Intel, Industry Stats, Methodology, DISC-tailored, Tool Gap, Scale & Value)
- **Real-time Visualization**: Beautiful animated pipeline showing AI processing stages
- **Professional UI**: Modern design with glassmorphism effects

## Quick Start

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- Lamatic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/lamatic-apps/Traq-Email-Generation-.git
cd Traq-Email-Generation-

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your LAMATIC_API_KEY
```

### Run the Application

```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run dev
```

Visit `http://localhost:5173` to access the application.

## Environment Variables

Create a `.env` file with:

```env
LAMATIC_API_KEY=your_api_key_here
LAMATIC_WORKFLOW_ID=29897670-6e44-46a4-be97-ec7d133c71a5
PORT=3001
```

## CSV Format

Your CSV file should include:

| Column | Required | Description |
|--------|----------|-------------|
| First Name | Yes | Prospect's first name |
| Last Name | Yes | Prospect's last name |
| Email | Yes | Contact email |
| Title | Yes | Job title |
| Company Name | Yes | Company name |
| Industry | No | Industry sector |
| LinkedIn Profile | No | LinkedIn URL |
| Company Domain | No | Company website |

**Example:**
```csv
First Name,Last Name,Email,Title,Company Name,Industry
Hannah,Sackett,hannah.sackett@neocol.com,Senior Director,Neocol,Technology
```

## How It Works

1. **Upload CSV** - Drag and drop your prospect list
2. **Data Preview** - Review the data in a clean table
3. **Generate Emails** - Click to start AI processing
4. **Watch Pipeline** - Real-time visualization of:
   - Data normalization
   - Parallel enrichment (LinkedIn + Web)
   - AI persona analysis
   - 6 email generation streams
   - Results finalization
5. **View & Copy** - Browse generated emails and copy to clipboard

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **AI Engine**: Lamatic API
- **Styling**: Custom CSS with animations

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── App.jsx        # Main app
│   └── main.jsx       # Entry point
├── server/
│   └── index.js       # Express API
├── public/            # Static assets
└── package.json       # Dependencies
```

## API Endpoint

### POST `/api/generate-emails`

Generates personalized emails for a single prospect.

**Request Body:**
```json
{
  "FirstName": "Hannah",
  "LastName": "Sackett",
  "Email": "hannah.sackett@neocol.com",
  "Title": "Senior Director",
  "CompanyName": "Neocol",
  "Industry": "Technology"
}
```

**Response:**
```json
{
  "success": true,
  "profile": { ... },
  "emails": [
    {
      "variant": 1,
      "approach": "Competitor Intel",
      "subject": "...",
      "body": "..."
    }
  ]
}
```

## Build for Production

```bash
npm run build
npm run preview
```

## Security

- API keys stored in `.env` (gitignored)
- No credentials in source code
- CORS enabled for secure API calls

## License

ISC

## Support

For issues or questions, open an issue on GitHub.

---

**Built with [Lamatic.ai](https://lamatic.ai)**
