# RAG Chatbot - Full Stack

A full-stack RAG application that lets you upload PDFs or websites and chat with AI about their content. Supports multiple LLM providers - OpenAI, Google Gemini, Claude, and Ollama.

## Tech Stack

**Frontend:**
- Next.js 16
- React 18
- TypeScript
- Tailwind CSS
- Axios

**Backend:**
- FastAPI
- LangChain
- Qdrant
- pypdf

## Features

- Upload PDFs and index them into vector storage
- Website content crawling (planned)
- Switch between multiple LLM providers at runtime
- Semantic search with vector embeddings
- Dark-themed UI with file upload support

## Setup Locally

### Prerequisites
- Node.js 18+
- Python 3.8+
- Docker (for Qdrant)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys: OPENAI_API_KEY, GOOGLE_API_KEY, ANTHROPIC_API_KEY

# Start Qdrant (vector database)
docker-compose up -d

# Run FastAPI server
uvicorn main:app --reload
# Server runs on http://localhost:8000
```

### Frontend Setup

```bash
cd next_frontend

# Install dependencies
npm install

# Run development server
npm run dev
# App runs on http://localhost:3000
```

## Usage

1. Open http://localhost:3000
2. Configure your API key (Settings button)
3. Choose PDF upload or website crawl
4. Upload/enter content
5. Ask questions in the chat panel

## Project Structure

```
fullstack_rag/
├── next_frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│
└── backend/
    ├── main.py
    ├── utils/
    │   ├── loader.py
    │   ├── chunker.py
    │   └── vector_embedder.py
    ├── requirements.txt
    └── docker-compose.yml
```

## API Endpoints

- `POST /api/context` - Upload PDF or website URL, process and store embeddings
- `POST /chat` - Query with RAG (planned)
- `GET /health` - Health check

## Environment Variables

Backend `.env` example:
```
LLM_PROVIDER=openai          # or gemini, claude, ollama
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ANTHROPIC_API_KEY=...
```

Frontend stores API key in localStorage via Configure API Key dialog.

## How It Works

1. **PDF Upload:** File saved temporarily → Parsed into pages → Split into chunks
2. **Embedding:** Each chunk encoded using selected LLM provider's embedding model
3. **Storage:** Vectors stored in Qdrant with metadata
4. **Chat:** Query embedded → Vector search in Qdrant → LLM generates response with context

## Notes

- Qdrant runs in Docker, ensure port 6333 is available
- API keys are sent from frontend to backend on each request
- Temporary PDF files are cleaned up after processing
- Same collection name is reused for uploads with same model (vectors append)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Qdrant connection failed | Run `docker-compose up -d` in backend folder |
| API key error (401) | Update API key in Configure API Key dialog |
| pypdf not found | Run `pip install pypdf` |
| Port 3000/8000 in use | Change port in package.json or uvicorn command |
