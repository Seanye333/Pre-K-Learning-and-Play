# Pre-K Learning and Play

A full-stack educational game platform built for a 5-year-old child. Designed for 5–7 minute attention spans with tap-only interaction, no keyboard input, and a parent progress dashboard.

---

## Games (15 total)

| Game | What it teaches |
|------|----------------|
| ABC Adventure | Letters, phonics sounds, uppercase/lowercase matching, spelling |
| Math Playground | Counting 1–20, basic addition, number recognition, patterns |
| Memory Match | Visual memory, concentration, pair matching |
| Drawing Studio | Creativity, fine motor skills, color mixing |
| Shape Explorer | Circle, square, triangle and more — learn, identify, match outlines |
| Rhyme Time | Word families, rhyme recognition, rhyme sorting |
| Emotion Match | Identifying feelings, matching emotions to situations |
| Word Builder | Spelling 3–5 letter words with letter tiles (Easy / Medium / Hard) |
| Color Mixer | Learn color names, mix two colors to make a new one, identify object colors |
| Animal World | Animal sounds, habitats, baby animal names |
| Story Sequence | Put 4-step story cards in the correct order |
| Letter Trace | Trace letters A–Z on a canvas with guided stroke paths |
| Fruits & Veggies | Learn fruit and vegetable names, sort into baskets, compare sizes |
| Opposites | Learn 12 opposite pairs (big/small, hot/cold, etc.) and match them |
| Spot the Difference | Find 3–4 differences between two side-by-side emoji scenes |

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- HTML5 Canvas (letter tracing, drawing)

**Backend**
- FastAPI (Python)
- SQLAlchemy + SQLite (local) / PostgreSQL (production)
- Weighted moving average AI tutor

---

## Local Setup

### Requirements
- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
py -m venv .venv
.venv/Scripts/activate        # Windows
# source .venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python main.py
# → running at http://localhost:8000
# → API docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → running at http://localhost:3000
```

---

## iPad / Mobile Access

Make sure your iPad is on the same WiFi as your PC, then open:

```
http://YOUR_PC_IP:3000
```

Find your PC's IP by running `ipconfig` in a terminal (look for the 192.168.x.x address).

To use the app as a full-screen app on iPad: Safari → **Share → Add to Home Screen**.

---

## Deploy to the Internet

### Frontend → Vercel (free)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import the `Pre-K-Learning-and-Play` repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL` = your Railway backend URL
5. Deploy

### Backend → Railway (free)
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Import the `Pre-K-Learning-and-Play` repo
3. Set **Root Directory** to `backend`
4. Add the **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically
5. Enable a public domain under Settings → Networking
6. Copy that URL into Vercel as `NEXT_PUBLIC_API_URL`

---

## Parent Dashboard

Access at `/parent` — protected by a 4-digit tap PIN (default: **1234**).

Shows:
- Total play time and sessions today
- Per-skill score charts (last 7 sessions)
- AI tutor recommendation for each skill (easier / same / harder)
- Session history

To change the PIN, set `DEFAULT_PIN` in `backend/.env`:

```
DEFAULT_PIN=5678
```

---

## Project Structure

```
Pre-k Learning and Play/
├── backend/
│   ├── main.py                  # Uvicorn entry point
│   ├── requirements.txt
│   ├── Procfile                 # Railway/Heroku start command
│   └── prek/
│       ├── ai/tutor.py          # Weighted moving average recommender
│       ├── api/
│       │   ├── server.py        # FastAPI app + CORS
│       │   ├── schemas.py       # Pydantic request/response models
│       │   └── routes/          # sessions, progress, dashboard, recommend
│       └── core/
│           ├── config.py        # pydantic-settings (reads .env)
│           ├── database.py      # SQLAlchemy engine + session
│           └── models.py        # GameSession + SkillScore tables
└── frontend/
    └── src/
        ├── app/                 # One folder per game (Next.js App Router)
        ├── components/          # Game components grouped by skill
        ├── hooks/               # useSession, useSound, useProgress
        ├── lib/                 # api.ts, constants.ts, types.ts
        └── context/             # SessionContext (tracks active session)
```

---

## AI Tutor

After each session the backend records a score (0.0 – 1.0). The tutor uses a weighted moving average (most recent session weighted highest) to recommend the next activity:

| Average score | Recommendation |
|--------------|----------------|
| < 60% | Easier activity |
| 60% – 85% | Keep at current level |
| > 85% | Harder activity |

---

## Safety Design

- No keyboard input for children — all interaction is tap/click on pre-rendered elements
- No external links on any child-facing page
- Parent dashboard behind PIN gate with 10-second lockout after 3 wrong attempts
- Full-screen mode with scroll and zoom disabled
