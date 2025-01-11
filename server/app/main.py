from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import NERRequest
from app.utils.local_ner import process_local_ner
from app.utils.openai_ner import process_openai_ner

app = FastAPI(
    title="PubMed NER",
    description="API for performing Named Entity Recognition on biomedical text",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ner")
async def perform_ner(request: NERRequest):
    """Route for local NER processing."""
    if request.model == "d4data/biomedical-ner-all":
        return process_local_ner(request)
    elif request.model == "openai/gpt-4":
        return process_openai_ner(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)