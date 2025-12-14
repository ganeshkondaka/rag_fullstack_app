from langchain_community.document_loaders import PyPDFLoader

def Load_pdf(tool,file):
    
    if tool == 'pdf':
        loader = PyPDFLoader(file)
        loaded_docs = loader.load()
        return loaded_docs
    elif tool == 'website':
        return
    else:
        return("Invalid tool type on loader")