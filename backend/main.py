from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional
from loader import Load_pdf
from chunker import Chunk_docs
from vector_embedder import Vector_embedder
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
        print('tool is: ', tool)
        print('websiteUrl is: ', websiteUrl)
        print('file is: ', file)
        print('apiKey is: ', apiKey)
        print('model is: ', model)
        
        loaded_docs = Load_pdf(tool,file)
        split_docs = Chunk_docs(tool,loaded_docs)
        Vector_embedder(model,apiKey)
        
        vector_store = QdrantVectorStore.from_documents(
            documents=split_docs,
            embedding=embedding_model,
            url="http://localhost:6333",
            collection_name=f"learning_vectors_{provider}"
        )
        # # Validate tool type
        # if tool not in ['pdf', 'website']:
        #     raise HTTPException(status_code=400, detail="Invalid tool type")

        # # Validate required fields based on tool
        # if tool == 'pdf' and not file:
        #     raise HTTPException(status_code=400, detail="PDF file is required")
        # if tool == 'website' and not websiteUrl:
        #     raise HTTPException(status_code=400, detail="Website URL is required")

        # # Set environment variables for this request
        # os.environ['API_KEY'] = apiKey
        # os.environ['MODEL'] = model

        # result = {"status": "success", "tool": tool}

        # if tool == 'pdf' and file:
        #     # Save uploaded file temporarily
        #     file_path = f"temp_{file.filename}"
        #     with open(file_path, "wb") as buffer:
        #         content = await file.read()
        #         buffer.write(content)

        #     result["file_name"] = file.filename
        #     result["file_size"] = len(content)
        #     result["message"] = "PDF uploaded successfully"

        #     # Add PDF processing logic here using indexing.py

        # elif tool == 'website' and websiteUrl:
        #     result["website_url"] = websiteUrl
        #     result["message"] = "Website URL received successfully"
        #     # Add website crawling logic here

        # return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8080)