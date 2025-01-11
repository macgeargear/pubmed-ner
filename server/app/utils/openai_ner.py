import json
from fastapi import HTTPException
from openai import OpenAI
from app.models import NERRequest, Entity, NERResponse
from app.constants import SYSTEM_PROMPT
import os
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def parse_openai_response(response_content: str, text: str) -> list:
    """Parse OpenAI API response into validated Entity objects."""
    entities = json.loads(response_content)
    validated_entities = []

    for entity in entities:
        entity_text = entity["text"]
        start_index = text.find(entity_text)
        if start_index == -1:
            raise ValueError(f"Entity text '{entity_text}' not found in input text")

        end_index = start_index + len(entity_text)
        validated_entities.append(Entity(
            text=entity_text,
            label=entity["label"],
            start=start_index,
            end=end_index,
            score=entity.get("confidence")
        ))

    return validated_entities

def process_openai_ner(request: NERRequest) -> NERResponse:
    """Perform Named Entity Recognition using OpenAI's GPT model."""
    user_prompt = f"""
    Analyze this text for medical entities: "{request.text}"

    Return ONLY a valid JSON array with no additional text or explanations.
    Each item in the array must include the following keys:
    - "text": The exact entity text
    - "label": A descriptive label for the entity type
    - "start": The starting character index
    - "end": The ending character index
    - "confidence": A confidence score between 0.0 and 1.0
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0
        )

        response_content = response.choices[0].message.content.strip()
        if response_content.startswith("```json") and response_content.endswith("```"):
            response_content = response_content[7:-3].strip()

        entities = parse_openai_response(response_content, request.text)
        return NERResponse(text=request.text, entities=entities)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse OpenAI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")