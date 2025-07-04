# Project Agents.md Guide for OpenAI Codex

This Agents.md file provides comprehensive guidance for OpenAI Codex and other AI agents working with this codebase.

## Project Structure for OpenAI Codex Navigation

- `/src`
  - `/backend`
    - `scraper.py`       — Google Trends URL builder and fetcher
    - `parser.py`        — HTML/JSON parsing logic into Python data models
    - `api.py`           — Flask/FastAPI app exposing `/api/trends`
    - `models.py`        — Pydantic schemas for request and response
  - `/frontend`
    - `/components`      — React UI components (FilterPanel, TopicList, DownloadButton)
    - `/pages`           — Next.js pages (e.g. `index.tsx`)
    - `/styles`          — Tailwind CSS configs and globals
    - `/utils`           — API client and shared TypeScript types
  - `/utils`            — Shared utility functions (date helpers, logging)
- `/docker`
  - `Dockerfile`        — Multi-stage build for backend and frontend
  - `docker-compose.yml`— Service definitions for local development
- `/tests`
  - `/backend`          — pytest suites for URL builder and parser
  - `/frontend`         — Jest + React Testing Library tests
- `README.md`           — Setup, build, run, and contribution guidelines
- `.env.example`        — Example environment variables
- `requirements.txt`    — Python dependencies
- `package.json`        — Frontend dependencies and scripts

## Coding Conventions for OpenAI Codex

### Backend (Python)

- Target **Python 3.10+**.  
- Follow **PEP-8**: use Black for formatting and flake8 for linting.  
- Write **type hints** for all functions and classes.  
- Use **Pydantic** models for request validation and response serialization.  
- Keep functions small (≤ 50 lines) and focused.  
- Add docstrings for complex logic (especially parsing).

### Frontend (TypeScript + React)

- Use **TypeScript** for all new code.  
- Write **functional components** with React hooks (no class components).  
- File naming: **PascalCase** for components (`FilterPanel.tsx`), lowercase for utils.  
- Prop typing is **mandatory**.  
- Use **Tailwind CSS**: utility‐first approach; no custom CSS unless necessary.  
- Keep components single‐responsibility (max ~100 lines).  
- Comments for any non-trivial business logic.

## Testing Requirements for OpenAI Codex

- **Backend**:  
  ```bash
  # Install dependencies
  pip install -r requirements.txt
  
  # Run all tests
  pytest --maxfail=1 --disable-warnings -q
