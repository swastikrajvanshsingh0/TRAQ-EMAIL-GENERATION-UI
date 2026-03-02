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
LAMATIC_API_URL=https://sandbox566-flowforcontent246.lamatic.dev/graphql
LAMATIC_WORKFLOW_ID=29897670-6e44-46a4-be97-ec7d133c71a5
LAMATIC_PROJECT_ID=5ff16d78-7137-45b7-a320-a9e1f4c8d4bd
PORT=3001
```

| Variable | Description | Required |
|----------|-------------|----------|
| `LAMATIC_API_KEY` | Your Lamatic API authentication key | Yes |
| `LAMATIC_API_URL` | Lamatic GraphQL endpoint URL | Yes |
| `LAMATIC_WORKFLOW_ID` | Workflow identifier for email generation | Yes |
| `LAMATIC_PROJECT_ID` | Project identifier | Yes |
| `PORT` | Backend server port | No (default: 3001) |

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

## Deployment

### Environment Variables for Production

When deploying, you need to set:

**Backend** (Vercel/Render/Railway):
```env
LAMATIC_API_KEY=your_api_key
LAMATIC_API_URL=https://sandbox566-flowforcontent246.lamatic.dev/graphql
LAMATIC_WORKFLOW_ID=29897670-6e44-46a4-be97-ec7d133c71a5
LAMATIC_PROJECT_ID=5ff16d78-7137-45b7-a320-a9e1f4c8d4bd
PORT=3001
```

**Frontend** (Vercel/Netlify):
```env
VITE_API_URL=https://your-backend-url.vercel.app
```

### Quick Deploy

**Option 1: Vercel (All-in-one)**
```bash
vercel --prod
# Add environment variables in Vercel dashboard
```

**Option 2: Separate Deployments**
1. Deploy backend to Vercel/Render
2. Deploy frontend to Vercel/Netlify with `VITE_API_URL` set

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

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
