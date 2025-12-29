from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
from pdf_extractor import extract_pdf_structure
from rule_parser import parse_rules

app = FastAPI(title="Ludex PDF Processor", version="1.0.0")


class ProcessRequest(BaseModel):
    gameId: str
    pdfUrl: str
    userId: str


class ProcessResponse(BaseModel):
    success: bool
    sections: list
    metadata: dict


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/process", response_model=ProcessResponse)
async def process_pdf(request: ProcessRequest):
    """
    Process a PDF rulebook and extract structured rules.
    
    Args:
        request: ProcessRequest with gameId, pdfUrl, and userId
        
    Returns:
        ProcessResponse with structured sections and metadata
    """
    try:
        # Extract PDF structure
        pdf_structure = extract_pdf_structure(request.pdfUrl)
        
        # Parse rules into sections
        sections = parse_rules(pdf_structure)
        
        # Build metadata
        metadata = {
            "totalPages": pdf_structure.get("total_pages", 0),
            "hasImages": pdf_structure.get("has_images", False),
            "hasTables": pdf_structure.get("has_tables", False),
        }
        
        return ProcessResponse(
            success=True,
            sections=sections,
            metadata=metadata
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(e)}"
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)

