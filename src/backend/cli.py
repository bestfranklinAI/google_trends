#!/usr/bin/env python3
"""CLI script for the Google Trends backend."""

import argparse
import logging
import sys
from pathlib import Path

import uvicorn
from .api import app
from .scraper import fetch_trends
from .models import TrendRequest

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_server(host: str = "127.0.0.1", port: int = 8000, reload: bool = False):
    """Run the FastAPI server."""
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(
        "src.backend.api:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

def fetch_and_print_trends(params: TrendRequest):
    """Fetch trends and print them to console."""
    try:
        logger.info(f"Fetching trends for {params.geo} in {params.hl}")
        trends_data = fetch_trends(params)
        
        print(f"\n{'='*50}")
        print(f"Google Trends for {trends_data.location} ({trends_data.language})")
        print(f"Total trends: {trends_data.total_trends}")
        print(f"Timestamp: {trends_data.timestamp}")
        print(f"Source: {trends_data.source_url}")
        print(f"{'='*50}")
        
        for i, trend in enumerate(trends_data.topics, 1):
            print(f"\n{i}. {trend.title}")
            if trend.search_volume:
                print(f"   Search Volume: {trend.search_volume}")
            if trend.change_percentage:
                print(f"   Change: {trend.change_percentage}")
            if trend.url:
                print(f"   URL: {trend.url}")
                
    except Exception as e:
        logger.error(f"Error fetching trends: {e}")
        sys.exit(1)

def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Google Trends API CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Server command
    server_parser = subparsers.add_parser("server", help="Run the API server")
    server_parser.add_argument("--host", default="127.0.0.1", help="Host to bind to")
    server_parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    server_parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    
    # Fetch command
    fetch_parser = subparsers.add_parser("fetch", help="Fetch trends and print to console")
    fetch_parser.add_argument("--geo", default="HK", help="Location (default: HK)")
    fetch_parser.add_argument("--hl", default="en", help="Language (default: en)")
    fetch_parser.add_argument("--hours", type=int, help="Hours to look back")
    fetch_parser.add_argument("--category", help="Category filter")
    fetch_parser.add_argument("--sort", help="Sort method")
    fetch_parser.add_argument("--status", help="Status filter")
    
    args = parser.parse_args()
    
    if args.command == "server":
        run_server(host=args.host, port=args.port, reload=args.reload)
    elif args.command == "fetch":
        params = TrendRequest(
            geo=args.geo,
            hl=args.hl,
            hours=args.hours,
            category=args.category,
            sort=args.sort,
            status=args.status
        )
        fetch_and_print_trends(params)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
