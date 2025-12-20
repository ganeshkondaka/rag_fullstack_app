from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import Optional
from qdrant_client import QdrantClient
from utils.loader import Load_pdf
from utils.chunker import Chunk_docs
from utils.vector_embedder import Vector_embedder
from utils.chat_completion import chat_completion
from langchain_qdrant import QdrantVectorStore


load_dotenv()
app = FastAPI()

class ChatRequest(BaseModel):
    model: str
    apiKey: str
    userquery: str

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

            # Process the PDF-----------------------
            loaded_docs = Load_pdf(tool, file_path)
            print(f'✓ PDF loaded: {len(loaded_docs)} documents')

            split_docs = Chunk_docs(tool, loaded_docs)
            print(f'✓ Documents chunked: {len(split_docs)} chunks')

            embedding_model = Vector_embedder(model, apiKey)
            print('✓ Embedding model created')

            # Clean up temp file
            os.remove(file_path)
            print('✓ Temporary file cleaned up')
            
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
            # os.remove(file_path)
            # print('✓ Temporary file cleaned up')
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

@app.post('/api/chat')
async def chat(request: ChatRequest):
    try:
        model = request.model
        apiKey = request.apiKey
        userquery = request.userquery
        
        print('=== STARTING CHAT COMPLETION ===')
        print(f'Model: {model}')
        print(f'User Query: {userquery}')

        # Initialize embedding model for vector search
        embedding_model = Vector_embedder(model, apiKey)
        print('✓ Embedding model created')

        # Connect to existing vector store
        vector_db = QdrantVectorStore.from_existing_collection(
            url="http://localhost:6333",
            collection_name=f"rag_pdf_{model}",
            embedding=embedding_model
        )
        print('✓ Vector store connected')

        # Perform similarity search
        search_results = vector_db.similarity_search(query=userquery)
        print(f'✓ Found {len(search_results)} relevant chunks')

        # Build context from search results
        context = "\n\n".join([
            f"Page Content: {result.page_content}\nPage Number: {result.metadata.get('page_label', 'N/A')}\nSource: {result.metadata.get('source', 'N/A')}"
            for result in search_results
        ])
        print('✓ Context built')

        # Create system prompt
        system_prompt = f"""You are a helpful AI Assistant who answers user queries based on available context retrieved from a PDF file.
        You should only answer based on the following context and guide the user to the right page number for more details.
        Context:{context}"""

        # Get chat completion
        print('✓ Requesting chat completion...')
        response = chat_completion(
            model=model,
            api_key=apiKey,
            system_prompt=system_prompt,
            user_query=userquery
        )
        print('✓ Chat completion received')

        print('=== CHAT COMPLETION COMPLETED ===')
        return {
            "status": "success",
            "model": model,
            "response": response,
            "chunks_used": len(search_results)
        }

    except Exception as e:
        print(f'✗ Error: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))

@app.delete('/api/delete-collection')
async def delete_collection(model: str):
    try:
        print('=== STARTING COLLECTION DELETION ===')
        print(f'Deleting collection: rag_pdf_{model}')
        
        # Initialize Qdrant client
        client = QdrantClient(url="http://localhost:6333")
        
        # Delete the collection
        client.delete_collection(collection_name=f"rag_pdf_{model}")
        print(f'✓ Collection rag_pdf_{model} deleted successfully')
        
        print('=== COLLECTION DELETION COMPLETED ===')
        return {
            "status": "success",
            "message": f"Collection 'rag_pdf_{model}' deleted successfully",
            "model": model
        }
    
    except Exception as e:
        print(f'✗ Error: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8080)