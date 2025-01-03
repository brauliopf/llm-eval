from enum import Enum
from pydantic import BaseModel

class LLMProvider(str, Enum):
    OPENAI = "openai"
    DEEPSEEK = "deepseek"
    GOOGLE = "google"
    GROQ = "groq"

class CompletionRequest(BaseModel):
    provider: LLMProvider
    model: str
    prompt: str