# Embeddings
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def Vector_embedder(model,api_key):
    if model == "openai":
        return OpenAIEmbeddings(
            model="text-embedding-3-large",
            openai_api_key=api_key
        )

    elif model == "gemini":
        return GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )

    else:
        raise ValueError("Unsupported provider")