# NagrikSathi

> AI-powered citizen grievance platform — citizens submit complaints, Gemini AI analyses and prioritises them, MPs act on what matters most.

---

## Features

- Citizen Complaint Submission with Ward & District
- AI Complaint Analysis (Google Gemini)
- AI Priority Classification (Critical / High / Medium / Low)
- Complaint Summarisation & Tag Generation
- Complaint ID Tracking
- Protected MP Dashboard (Analytics, Reports, Settings)
- Persistent MP Settings (saved to database)
- Complaint Status Management

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | MySQL (SQLite fallback for local dev) |
| AI | Google Gemini API |

---

## Prerequisites

Make sure the following are installed before running the project:

- **Node.js** v18+ — https://nodejs.org
- **Python** 3.10+ — https://python.org
- **Git** — https://git-scm.com

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mohammedfardeenshaikh/NagrikSathi.git
cd NagrikSathi
```

---

### 2. Backend Setup (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/nagriksathi
```

> **Note:** If MySQL is not available, the backend automatically falls back to a local SQLite database — no extra configuration needed for local development.

#### Run the Backend

```bash
# From the project root (NagrikSathi/)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup (Next.js)

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

#### Configure Environment Variables

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### Run the Frontend

```bash
npm run dev
```

The website will be available at: `http://localhost:3000`

---

## Access the Application

| URL | Description |
|---|---|
| `http://localhost:3000` | Citizen Portal (Home, Submit, Track, About, Contact) |
| `http://localhost:3000/submit` | Submit a Complaint |
| `http://localhost:3000/track` | Track a Complaint by ID |
| `http://localhost:3000/mp-dashboard` | MP Dashboard (Login required) |

### MP Dashboard Login

| Field | Value |
|---|---|
| Email | `mp@nagriksathi.in` |
| Password | `password` |

---

## Project Structure

```
NagrikSathi/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI route handlers
│   │   ├── models/       # SQLAlchemy database models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # Gemini AI service
│   │   ├── core/         # DB connection, config
│   │   └── main.py       # App entry point
│   ├── .env              # Backend environment variables
│   └── requirements.txt
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx           # Home page
│   │   ├── submit/            # Complaint submission
│   │   ├── track/             # Complaint tracking
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   └── mp-dashboard/      # MP Dashboard (protected)
│   ├── .env.local        # Frontend environment variables
│   └── package.json
└── readme.md
```

---

## Workflow

```
Citizen → Submit Complaint
         ↓
   Gemini AI Analysis
   (Summary · Priority · Tags)
         ↓
   Store in Database
         ↓
   MP Dashboard
   (Sort by Priority · Analytics · Reports)
         ↓
   MP Takes Action
```

---

## License

This project is for educational and civic-tech demonstration purposes.