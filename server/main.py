from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "d4data/biomedical-ner-all"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer)

class NERRequest(BaseModel):
    text: str

@app.post("/ner")
def perform_ner(request: NERRequest):
    text = request.text
    results = ner_pipeline(text)

    entities = []
    for entity in results:
        word = entity["word"].replace("##", "")
        entities.append({
            "text": word,
            "label": entity["entity"],
            "start": entity["start"],
            "end": entity["end"],
            "confidence": float(entity["score"])
        })

    return {"text": text, "entities": entities}

# def handler(request, body):
#     from mangum import Mangum
#     asgi_handler = Mangum(app)
#     return asgi_handler(request, body)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)