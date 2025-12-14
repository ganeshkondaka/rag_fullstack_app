from langchain_text_splitters import RecursiveCharacterTextSplitter

def Chunk_docs(tool,loaded_docs):
    if tool == 'pdf':
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)
        split_docs = text_splitter.split_documents(documents =loaded_docs)
        return split_docs
    elif tool == 'website':
        return
    else:
        return("Invalid tool type on chunker")