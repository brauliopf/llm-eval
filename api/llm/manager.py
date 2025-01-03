from typing import Dict, Any
from fastapi import HTTPException
from pydantic import BaseModel
import openai
from groq import Groq
from .models import LLMProvider, CompletionRequest

class LLMClientManager:
    def __init__(self):
        self._clients: Dict[LLMProvider, Any] = {}
        self._supported_models = {
            LLMProvider.OPENAI: ["gpt-3.5-turbo"],
            LLMProvider.DEEPSEEK: ["deepseek-chat"],
            LLMProvider.GROQ: ["llama3-70b-8192", "mixtral-8x7b"]
            }

    class Prompt(BaseModel):
        provider: LLMProvider
        content: str
        model: str

    def initialize_client(self, provider: LLMProvider, **credentials):
            """Initialize a client for the specified provider with given credentials."""
            try:
                if provider == LLMProvider.OPENAI:
                    self._clients[provider] = openai.OpenAI(**credentials)
                elif provider == LLMProvider.DEEPSEEK:
                    self._clients[provider] = openai.OpenAI(**credentials, base_url="https://api.deepseek.com")
                elif provider == LLMProvider.GROQ:
                    self._clients[provider] = Groq(**credentials)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to initialize {provider} client: {str(e)}")

    async def _generate_openai(self, client, request: Prompt) -> Dict[str, Any]:
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
        )
        return {
            "text": response.choices[0].message.content,
            "provider": LLMProvider.OPENAI,
            "model": request.model
        }
    
    async def _generate_deepseek(self, client, request: Prompt) -> Dict[str, Any]:
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
            stream=False
        )
        return {
            "text": response.choices[0].message.content,
            "provider": LLMProvider.DEEPSEEK,
            "model": request.model
        }
    
    async def _generate_groq(self, client, request: Prompt) -> Dict[str, Any]:
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
        )
        return {
            "text": response.choices[0].message.content,
            "provider": LLMProvider.GROQ,
            "model": request.model
        }
    
    async def generate_completion(self, request: CompletionRequest) -> Dict[str, Any]:
        """Generate completion using the specified provider and model."""
        client = self._clients.get(request.provider)
        if not client:
            raise HTTPException(
                status_code=500,
                detail=f"Client for provider {request.provider} not initialized"
            )

        try:
            if request.provider == LLMProvider.OPENAI:
                response = await self._generate_openai(client, request)
            elif request.provider == LLMProvider.DEEPSEEK:
                response = await self._generate_deepseek(client, request)
            elif request.provider == LLMProvider.GROQ:
                response = await self._generate_groq(client, request)
            else:
                raise HTTPException(status_code=400, detail="Unsupported provider")
                
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
    
    def get_models(self) -> list[str]:
        return self._supported_models