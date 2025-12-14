# Embeddings
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def Vector_embedder(model,apikey):
    if model == "openai":
        print("openai embedder is running..")
        return OpenAIEmbeddings(
            model="text-embedding-3-large",
            openai_api_key=apikey
        )

    elif model == "gemini":
        print("gemini embedder is running..")
        return GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=apikey
        )

    else:
        raise ValueError("Unsupported provider")