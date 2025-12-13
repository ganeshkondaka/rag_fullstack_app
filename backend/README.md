# RAG Chatbot Backend

A FastAPI-based RAG (Retrieval-Augmented Generation) chatbot backend that supports multiple LLM providers including OpenAI, Google Gemini, Anthropic Claude, and Ollama. It uses vector embeddings for document retrieval and provides a flexible architecture for different AI models.

## 1. About This Code

This is a comprehensive RAG application backend built with FastAPI that integrates multiple Large Language Models (LLMs) and embedding providers. The system can process PDF documents and website content, create vector embeddings, and provide conversational AI responses based on the ingested knowledge.

Key features:
- **Multi-LLM Support**: OpenAI GPT, Google Gemini, Anthropic Claude, and Ollama models
- **Flexible Embeddings**: Support for different embedding providers
- **Document Processing**: PDF and website content ingestion
- **Vector Storage**: Qdrant vector database for efficient retrieval
- **RESTful API**: Clean endpoints for frontend integration
- **Environment-based Configuration**: Easy switching between LLM providers

## 2. About FastAPI

FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It is built on top of Starlette for the web parts and Pydantic for the data parts.

Key benefits:
- Fast: Very high performance, on par with NodeJS and Go
- Fast to code: Increase development speed by 200-300%
- Fewer bugs: Reduce human-induced errors by 40%
- Intuitive: Great editor support with auto-completion
- Easy: Designed to be easy to use and learn
- Short: Minimize code duplication
- Robust: Get production-ready code with automatic interactive documentation

## 3. About Dependencies

This project uses the following main dependencies:

- **FastAPI**: The web framework for building the API
- **Uvicorn**: ASGI server for running the FastAPI application
- **LangChain**: Framework for building LLM applications
- **Qdrant**: Vector database for similarity search
- **OpenAI**: Client for interacting with OpenAI's API
- **Google Generative AI**: Client for Google's Gemini models
- **Anthropic**: Client for Claude models
- **python-dotenv**: For loading environment variables
- **PyPDFLoader**: For processing PDF documents

All dependencies are listed in `requirements.txt` and can be installed with `pip install -r requirements.txt`.

## 4. Setup and Run Locally

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- API keys for your chosen LLM providers
- Qdrant vector database (local or cloud instance)

### Installation Steps

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```

6. **Start Qdrant database** (if running locally):
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

7. **Run document indexing** (optional, for initial setup):
   ```bash
   python indexing.py
   ```

8. **Run the application**:
   ```bash
   uvicorn main:app --reload
   ```

   **Note**:
   - `main:app` tells Uvicorn to run the FastAPI app instance named `app` from the `main.py` file.
   - The `--reload` flag enables auto-reloading during development.

9. **Access the application**:
   - API: http://127.0.0.1:8000
   - Interactive API documentation: http://127.0.0.1:8000/docs

## 5. Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# LLM Configuration
LLM_PROVIDER=openai  # Options: openai, gemini, claude, ollama
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key
OLLAMA_BASE_URL=http://localhost:11434

# Embedding Configuration
EMBEDDING_PROVIDER=openai  # Options: openai, gemini, ollama
EMBEDDING_MODEL=text-embedding-3-small

# Model Settings
LLM_TEMPERATURE=0.7

# Vector Database
QDRANT_URL=http://localhost:6333
```

### Supported LLM Providers

- **OpenAI**: GPT-3.5-turbo, GPT-4, GPT-4-turbo
- **Google Gemini**: Gemini Pro, Gemini Pro Vision
- **Anthropic Claude**: Claude 3 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Ollama**: Local models like Mistral, Llama2, etc.

## 6. API Endpoints

### GET /health
- **Description**: Health check endpoint
- **Response**: Current configuration status
```json
{
  "status": "ok",
  "llm_provider": "openai",
  "llm_model": "gpt-3.5-turbo",
  "embedding_provider": "openai"
}
```

### POST /chat
- **Description**: Main chat endpoint with RAG
- **Body**:
```json
{
  "query": "What is machine learning?",
  "mode": "default"  // or "thinking" for detailed reasoning
}
```
- **Response**: AI response with sources

### POST /upload
- **Description**: Upload and process documents
- **Body**: FormData with file and metadata
- **Supported formats**: PDF files, website URLs

### POST /switch-llm
- **Description**: Switch LLM provider at runtime
- **Body**:
```json
{
  "provider": "gemini",
  "model": "gemini-pro",
  "temperature": 0.7
}
```

### GET /available-providers
- **Description**: List all supported LLM providers and requirements

## 7. Document Processing

### PDF Processing
- Uses PyPDFLoader to extract text from PDF files
- Splits documents into chunks with overlap for better retrieval
- Creates vector embeddings for semantic search

### Website Processing
- Scrapes website content (implementation pending)
- Processes HTML content into searchable chunks

### Vector Storage
- Uses Qdrant for efficient vector similarity search
- Supports both local and cloud Qdrant instances

## 8. Development

### Project Structure
```
backend/
├── main.py          # FastAPI application and routes
├── config.py        # LLM and embedding configuration
├── indexing.py      # Document processing and vector indexing
├── requirements.txt # Python dependencies
├── .env.example     # Environment variables template
└── .gitignore       # Git ignore rules
```

### Adding New LLM Providers
1. Add provider configuration in `config.py`
2. Implement the LLM class initialization
3. Update environment variable handling
4. Add to the provider list in `/available-providers` endpoint

## 9. Deployment

### Production Considerations
- Use environment-specific configuration files
- Set up proper logging and monitoring
- Configure CORS for frontend integration
- Use production-grade vector database
- Implement rate limiting and authentication
- Set up proper error handling and retries

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 10. Troubleshooting

### Common Issues
- **API Key Errors**: Ensure all required API keys are set in `.env`
- **Qdrant Connection**: Verify Qdrant is running and accessible
- **Model Not Found**: Check model names and availability for your provider
- **Import Errors**: Ensure all dependencies are installed correctly

### Performance Tips
- Use appropriate chunk sizes for your documents
- Choose embedding models based on your use case
- Monitor token usage and API costs
- Consider caching frequently accessed documents

## Notes

- This is designed for development and prototyping. Add authentication and security measures for production use.
- Monitor API usage costs, especially with paid LLM providers.
- The system uses in-memory processing; consider persistent storage for larger applications.
- Document processing can be resource-intensive; optimize chunk sizes based on your hardware.

For more information, check the FastAPI documentation at https://fastapi.tiangolo.com/