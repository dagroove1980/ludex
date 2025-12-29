# Ludex PDF Processor

Python service for extracting structured rules from board game PDF rulebooks.

## Overview

This service uses `pdfplumber` and `PyMuPDF` to extract text and structure from PDFs, then parses them into organized rule sections with subsections. It's designed to be faster and more accurate than AI-based summarization.

## Features

- Full PDF text extraction (no character limits)
- Structure detection (headings, sections, subsections)
- Table extraction
- Image detection
- Pattern-based rule parsing
- Hierarchical section organization

## Setup

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
uvicorn main:app --host 0.0.0.0 --port 8080
```

3. Test the health endpoint:
```bash
curl http://localhost:8080/health
```

### Docker

1. Build the image:
```bash
docker build -t ludex-pdf-processor .
```

2. Run the container:
```bash
docker run -p 8080:8080 ludex-pdf-processor
```

## Deployment to Google Cloud Run

### Prerequisites

- Google Cloud SDK installed (`gcloud`)
- Docker installed
- Google Cloud project with billing enabled

### Steps

1. **Set up Google Cloud project:**
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud auth login
```

2. **Enable required APIs:**
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

3. **Build and deploy:**
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ludex-pdf-processor

# Deploy to Cloud Run
gcloud run deploy ludex-pdf-processor \
  --image gcr.io/YOUR_PROJECT_ID/ludex-pdf-processor \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300 \
  --max-instances 10
```

4. **Get the service URL:**
```bash
gcloud run services describe ludex-pdf-processor --region us-central1 --format 'value(status.url)'
```

5. **Set environment variable in Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `PYTHON_SERVICE_URL` with the Cloud Run service URL

## API Endpoints

### POST /process

Process a PDF and extract structured rules.

**Request:**
```json
{
  "gameId": "uuid",
  "pdfUrl": "https://...",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "sections": [
    {
      "id": "setup",
      "title": "Setup",
      "order": 1,
      "content": "...",
      "subsections": [
        {
          "id": "setup-components",
          "title": "Components",
          "order": 1,
          "content": "..."
        }
      ]
    }
  ],
  "metadata": {
    "totalPages": 12,
    "hasImages": true,
    "hasTables": true
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Environment Variables

- `PORT` - Port to run the service on (default: 8080)

## Architecture

- `main.py` - FastAPI application and endpoints
- `pdf_extractor.py` - PDF text and structure extraction
- `rule_parser.py` - Rule parsing and organization

## Future Enhancements (Phase 3)

- ML model integration for improved rule classification
- Better handling of complex layouts
- Support for multi-column layouts
- Image extraction and OCR for diagrams

