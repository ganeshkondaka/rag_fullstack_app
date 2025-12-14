from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional
from utils.loader import Load_pdf
from utils.chunker import Chunk_docs
from utils.vector_embedder import Vector_embedder
from langchain_qdrant import QdrantVectorStore


load_dotenv()
app = FastAPI()

app.add_middleware(
     CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # nextjs dev server port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/api/context')
async def context_data(
    tool: str = Form(...),
    apiKey: str = Form(...),
    model: str = Form(...),
    file: Optional[UploadFile] = File(None),
    websiteUrl: Optional[str] = Form(None)
):
    try:
        print('=== STARTING CONTEXT DATA PROCESSING ===')
        print('tool is: ', tool)
        print('websiteUrl is: ', websiteUrl)
        print('file is: ', file)
        print('apiKey is: ', apiKey)
        print('model is: ', model)

        # Validate tool type
        if tool not in ['pdf', 'website']:
            raise HTTPException(status_code=400, detail="Invalid tool type")

        # Validate required fields based on tool
        if tool == 'pdf' and not file:
            raise HTTPException(status_code=400, detail="PDF file is required")
        if tool == 'website' and not websiteUrl:
            raise HTTPException(status_code=400, detail="Website URL is required")

        print('✓ Form validation completed')
        result = {"status": "success", "tool": tool}

        if tool == 'pdf' and file:
            print('=== STARTING PDF PROCESSING ===')
            # Save uploaded file temporarily
            file_path = f"temp_{file.filename}"
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            print(f'✓ File saved temporarily: {file_path}')

            # Process the PDF
            loaded_docs = Load_pdf(tool, file_path)
            print(f'✓ PDF loaded: {len(loaded_docs)} documents')

            split_docs = Chunk_docs(tool, loaded_docs)
            print(f'✓ Documents chunked: {len(split_docs)} chunks')

            embedding_model = Vector_embedder(model, apiKey)
            print('✓ Embedding model created')

            # Create vector store
            vector_store = QdrantVectorStore.from_documents(
                documents=split_docs,
                url="http://localhost:6333",
                embedding=embedding_model,
                collection_name=f"rag_pdf_{model}"
            )
            print('✓ Vector store created/updated')

            result["file_name"] = file.filename
            result["file_size"] = len(content)
            result["message"] = "PDF processed and indexed successfully"
            result["chunks_created"] = len(split_docs)

            # Clean up temp file
            os.remove(file_path)
            print('✓ Temporary file cleaned up')
            print('=== PDF PROCESSING COMPLETED ===')

        elif tool == 'website' and websiteUrl:
            print('=== STARTING WEBSITE PROCESSING ===')
            result["website_url"] = websiteUrl
            result["message"] = "Website URL received successfully"
            # TODO: Add website crawling logic here
            print('✓ Website URL processed')
            print('=== WEBSITE PROCESSING COMPLETED ===')

        print('=== CONTEXT DATA PROCESSING COMPLETED ===')
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8080)