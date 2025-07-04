from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import tempfile
import os
from datetime import datetime
from .models import TrendRequest, TrendsResponse
from .scraper import fetch_trends

app = FastAPI(
    title="Google Trends API",
    description="API for fetching Google Trends data",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/trends", response_model=TrendsResponse)
async def get_trends(params: TrendRequest = Depends()) -> TrendsResponse:
    """Return trending topics based on parameters."""
    try:
        return fetch_trends(params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trends: {str(e)}")

@app.get("/api/trends/download")
async def download_trends_json(params: TrendRequest = Depends()):
    """Download trending topics as JSON file."""
    try:
        trends_data = fetch_trends(params)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(trends_data.dict(), f, indent=2, default=str)
            temp_file = f.name
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"google_trends_{params.geo}_{timestamp}.json"
        
        return FileResponse(
            temp_file,
            media_type='application/json',
            filename=filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating download: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Google Trends API",
        "version": "1.0.0",
        "endpoints": {
            "trends": "/api/trends",
            "download": "/api/trends/download",
            "health": "/api/health"
        }
    }
