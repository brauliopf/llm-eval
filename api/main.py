from contextlib import asynccontextmanager
from fastapi import FastAPI
from typing import Dict, Any
from llm.manager import LLMClientManager
from llm.models import CompletionRequest, LLMProvider
import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()

llm_manager = LLMClientManager()

# use fastapi lifespan events to setup the clients before application execution
# https://fastapi.tiangolo.com/advanced/events/#use-case
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize clients with appropriate credentials
    try:
        llm_manager.initialize_client(
            LLMProvider.OPENAI,
            api_key=os.getenv('OPENAI_API_KEY')
        )
        llm_manager.initialize_client(
            LLMProvider.DEEPSEEK,
            api_key=os.getenv('DEEPSEEK_API_KEY')
        )
        llm_manager.initialize_client(
            LLMProvider.GROQ,
            api_key=os.getenv('GROQ_API_KEY')
        )
        print("LLM clients initialized successfully")
    except Exception as e:
        print(f"Error initializing LLM clients: {e}")
        raise
    
    yield  # Server is running and handling requests here

    # Cleanup: close any connections or free resources
    try:
        # Add any cleanup code here if needed
        # For example, closing connections or cleaning up resources
        print("Cleaning up resources...")
    except Exception as e:
        print(f"Error during cleanup: {e}")

# Pass the lifespan to FastAPI
app = FastAPI(lifespan=lifespan)

@app.post("/completion")
async def generate_completion(request: CompletionRequest) -> Dict[str, Any]:
    return await llm_manager.generate_completion(request)

@app.get("/models")
def get_models() -> Dict[str, list]:
    return llm_manager.get_models()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")