from transformers import pipeline
from app.models import NERRequest, Entity, NERResponse
from app.utils.helpers import merge_subwords
from app.constants import MODEL_NAME

ner_pipeline = pipeline("ner", model=MODEL_NAME, tokenizer=MODEL_NAME, aggregation_strategy="max")

def process_local_ner(request: NERRequest) -> NERResponse:
    """Perform Named Entity Recognition using a local model."""
    predictions = ner_pipeline(request.text)
    merged_results = merge_subwords(predictions, request.text)
    entities = [
        Entity(
            text=result["word"],
            label=result["entity_group"],
            start=result["start"],
            end=result["end"],
            score=result["score"]
        )
        for result in merged_results
    ]
    return NERResponse(text=request.text, entities=entities)