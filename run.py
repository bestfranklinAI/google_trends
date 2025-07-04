#!/usr/bin/env python3
"""Simple run script for development."""

import subprocess
import sys
import os

def run_backend():
    """Run the FastAPI backend server."""
    print("Starting backend server...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "src.backend.api:app",
            "--host", "127.0.0.1",
            "--port", "8000",
            "--reload"
        ], cwd=os.path.dirname(os.path.abspath(__file__)))
    except KeyboardInterrupt:
        print("\nBackend server stopped.")

def run_frontend():
    """Run the Next.js frontend server."""
    print("Starting frontend server...")
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "frontend")
    try:
        subprocess.run(["npm", "run", "dev"], cwd=frontend_dir)
    except KeyboardInterrupt:
        print("\nFrontend server stopped.")

def install_dependencies():
    """Install Python and Node.js dependencies."""
    print("Installing Python dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    print("Installing Node.js dependencies...")
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "frontend")
    subprocess.run(["npm", "install"], cwd=frontend_dir)

def main():
    """Main entry point."""
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "backend":
            run_backend()
        elif command == "frontend":
            run_frontend()
        elif command == "install":
            install_dependencies()
        else:
            print("Usage: python run.py [backend|frontend|install]")
    else:
        print("Usage: python run.py [backend|frontend|install]")
        print("  backend  - Run the FastAPI backend server")
        print("  frontend - Run the Next.js frontend server")
        print("  install  - Install all dependencies")

if __name__ == "__main__":
    main()
