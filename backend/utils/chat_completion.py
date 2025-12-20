from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage


def chat_completion(model: str, api_key: str, system_prompt: str, user_query: str) -> str:
    """
    Generate chat completion response for both OpenAI and Gemini using LangChain.
    
    Args:
        model: LLM provider ('openai' or 'gemini')
        api_key: API key for the selected provider
        system_prompt: System instructions for the AI
        user_query: User's question/query
    
    Returns:
        str: Response text from the AI model
    """
    
    if model.lower() == "openai":
        llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            api_key=api_key,
            temperature=0.7
        )
    
    elif model.lower() == "gemini":
        llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=api_key,
            temperature=0.7
        )
    
    else:
        raise ValueError(f"Unsupported model: {model}")
    
    # Create messages
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_query)
    ]
    
    # Invoke the model
    response = llm.invoke(messages)
    
    return response.content
