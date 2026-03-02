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
# Start frontend (calls Lamatic API directly)
npm run dev
```

Visit `http://localhost:5173` (or the port shown) to access the application.

## Environment Variables

Create a `.env` file with:

```env
VITE_LAMATIC_API_KEY=your_api_key_here
VITE_LAMATIC_API_URL=https://sandbox566-flowforcontent246.lamatic.dev/graphql
VITE_LAMATIC_WORKFLOW_ID=29897670-6e44-46a4-be97-ec7d133c71a5
VITE_LAMATIC_PROJECT_ID=5ff16d78-7137-45b7-a320-a9e1f4c8d4bd
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_LAMATIC_API_KEY` | Your Lamatic API authentication key | Yes |
| `VITE_LAMATIC_API_URL` | Lamatic GraphQL endpoint URL | Yes |
| `VITE_LAMATIC_WORKFLOW_ID` | Workflow identifier for email generation | Yes |
| `VITE_LAMATIC_PROJECT_ID` | Project identifier | Yes |

**Note**: The `VITE_` prefix is required for Vite to expose these variables to the frontend.

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
- **API**: Lamatic.ai (called directly from frontend)
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

## Deployment

### Simple Deployment (No Backend Needed!)

The app calls Lamatic API directly from the frontend. Just deploy to Vercel/Netlify:

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**Environment Variables to Set:**
```env
VITE_LAMATIC_API_KEY=your_api_key
VITE_LAMATIC_API_URL=https://sandbox566-flowforcontent246.lamatic.dev/graphql
VITE_LAMATIC_WORKFLOW_ID=29897670-6e44-46a4-be97-ec7d133c71a5
VITE_LAMATIC_PROJECT_ID=5ff16d78-7137-45b7-a320-a9e1f4c8d4bd
```

That's it! No separate backend deployment needed.

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
