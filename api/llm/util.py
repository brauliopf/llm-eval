from enum import Enum
from pydantic import BaseModel

# class extends both `str` and `enum` to define a set of named values
class LLMProvider(str, Enum):
    OPENAI = "openai"
    DEEPSEEK = "deepseek"
    GOOGLE = "google"
    GROQ = "groq"

class CompletionRequest(BaseModel):
    provider: LLMProvider
    model: str
    prompt: str

class Prompt(BaseModel):
    provider: LLMProvider
    content: str
    model: str