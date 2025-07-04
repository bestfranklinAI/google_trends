# 🚀 Deployment Guide

## Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn
- Git

## 🏠 Local Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd google_trends
```

### 2. Quick Start
```bash
# Install all dependencies
python run.py install

# Terminal 1: Start backend
python run.py backend

# Terminal 2: Start frontend
python run.py frontend
```

### 3. Manual Setup (Alternative)
```bash
# Backend setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd src/frontend
npm install
npm run dev
```

## 🐳 Docker Deployment

### Build and Run
```bash
cd docker
docker-compose up --build
```

### Environment Variables
Create `.env` file in docker directory:
```env
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

## ☁️ Cloud Deployment

### Heroku Deployment

1. **Prepare Heroku Configuration**
```bash
# Install Heroku CLI
# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set BACKEND_HOST=0.0.0.0
heroku config:set BACKEND_PORT=$PORT
```

2. **Create Procfile**
```
web: cd src/backend && uvicorn api:app --host 0.0.0.0 --port $PORT
```

3. **Deploy**
```bash
git push heroku main
```

### Vercel Deployment (Frontend)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd src/frontend
vercel --prod
```

3. **Environment Variables**
```bash
# Set in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
```

### AWS Deployment

#### Backend (AWS Lambda + API Gateway)
1. **Install AWS CLI and configure**
```bash
aws configure
```

2. **Create Lambda function**
```bash
# Package backend
cd src/backend
pip install -r requirements.txt -t .
zip -r lambda-deployment.zip .
```

3. **Deploy to Lambda**
```bash
aws lambda create-function \
  --function-name google-trends-backend \
  --runtime python3.10 \
  --handler api:app \
  --zip-file fileb://lambda-deployment.zip
```

#### Frontend (AWS S3 + CloudFront)
1. **Build frontend**
```bash
cd src/frontend
npm run build
npm run export
```

2. **Deploy to S3**
```bash
aws s3 sync out/ s3://your-bucket-name --delete
```

## 🔧 Configuration

### Backend Configuration
```python
# src/backend/config.py
import os

class Settings:
    host = os.getenv("BACKEND_HOST", "127.0.0.1")
    port = int(os.getenv("BACKEND_PORT", "8000"))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    log_level = os.getenv("LOG_LEVEL", "INFO")
```

### Frontend Configuration
```javascript
// src/frontend/next.config.js
module.exports = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  images: {
    domains: ['trends.google.com'],
  },
}
```

## 📊 Monitoring & Logging

### Backend Logging
```python
import logging
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)
```

### Health Checks
```python
# Add to api.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
```

## 🚦 Load Balancing

### Nginx Configuration
```nginx
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📈 Performance Optimization

### Backend Optimizations
```python
# Add caching
from functools import lru_cache
import redis

# Redis caching
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@lru_cache(maxsize=128)
def get_trends_cached(geo: str, hl: str, hours: int):
    cache_key = f"trends:{geo}:{hl}:{hours}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Fetch new data
    data = fetch_trends(geo, hl, hours)
    redis_client.setex(cache_key, 300, json.dumps(data))  # 5 min cache
    return data
```

### Frontend Optimizations
```javascript
// Add to next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Enable image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
  },
  
  // Add security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
}
```

## 🔐 Security Hardening

### Backend Security
```python
# Add security middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["your-domain.com", "*.your-domain.com"]
)
```

### Environment Variables
```bash
# Production environment variables
export BACKEND_HOST=0.0.0.0
export BACKEND_PORT=8000
export LOG_LEVEL=INFO
export CORS_ORIGINS=https://your-frontend-domain.com
export TRUSTED_HOSTS=your-domain.com,*.your-domain.com
```

## 🧪 Testing in Production

### Health Check Script
```bash
#!/bin/bash
# health_check.sh

BACKEND_URL="https://your-backend-url.com"
FRONTEND_URL="https://your-frontend-url.com"

# Check backend health
echo "Checking backend health..."
curl -f $BACKEND_URL/health || exit 1

# Check frontend
echo "Checking frontend..."
curl -f $FRONTEND_URL || exit 1

echo "All services healthy!"
```

### Load Testing
```bash
# Install Apache Bench
apt-get install apache2-utils

# Run load test
ab -n 1000 -c 10 https://your-backend-url.com/trends?geo=US&hl=en
```

## 📱 Mobile Optimization

### PWA Configuration
```javascript
// src/frontend/next.config.js
const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  }
})
```

### Responsive Design Testing
```bash
# Install Chrome DevTools CLI
npm install -g chrome-devtools-frontend

# Test responsive design
chrome-devtools-frontend --mobile
```

## 📊 Analytics & Monitoring

### Google Analytics
```javascript
// src/frontend/components/Analytics.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const Analytics = () => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return null
}
```

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          cd src/frontend && npm install
          
      - name: Run tests
        run: |
          python -m pytest tests/
          cd src/frontend && npm test
          
      - name: Build frontend
        run: |
          cd src/frontend && npm run build
          
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

## 🎯 Production Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Health checks implemented
- [ ] Performance optimized

### Post-deployment
- [ ] Health checks passing
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Backup strategy implemented
- [ ] Rollback plan tested

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
```bash
# Check CORS configuration
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://your-backend-url.com/trends
```

2. **Memory Issues**
```bash
# Monitor memory usage
htop
# Or use Python memory profiler
pip install memory-profiler
python -m memory_profiler src/backend/api.py
```

3. **Rate Limiting**
```python
# Add rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/trends")
@limiter.limit("30/minute")
async def get_trends(request: Request, ...):
    # Your endpoint logic
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Vercel Documentation](https://vercel.com/docs)
