from pydantic import BaseModel, Field
from typing import List, Optional

class NERRequest(BaseModel):
    text: str = Field(..., description="Input text for NER analysis")
    model: str = "d4data/biomedical-ner-all"

class Entity(BaseModel):
    text: str
    label: str
    start: int
    end: int
    score: Optional[float] = None

class NERResponse(BaseModel):
    text: str
    entities: List[Entity]