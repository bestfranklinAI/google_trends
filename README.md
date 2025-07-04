# 🔥 Google Trends Explorer

A modern, full-stack application for exploring Google Trends data with a beautiful UI and robust backend API.

![Google Trends Explorer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)

## ✨ Features

- 🌍 **Global Trends**: Explore trends from 25+ countries and regions
- 🗣️ **Multi-language Support**: Interface available in 25+ languages
- 📊 **Rich Data**: Search volume, change percentages, and trending scores
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 📥 **Export Functionality**: Download trends data as JSON
- 🔧 **Advanced Filters**: Time range, categories, sorting options
- 🚀 **Fast API**: High-performance backend with caching and error handling
- 🎨 **Modern UI**: Clean, intuitive interface with loading states and animations
- 🔍 **Real-time Updates**: Live data fetching with automatic refresh
- 📈 **Interactive Charts**: Visual trend representations
- 🎯 **Smart Filtering**: Intelligent search and category filtering

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **BeautifulSoup4**: HTML parsing and data extraction
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for production deployment

### Frontend
- **Next.js**: React framework with server-side rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Modern React**: Hooks, context, and best practices

## 🚀 Quick Start

### Option 1: Using the Run Script (Recommended)

```bash
# Install all dependencies
python run.py install

# Run backend server (in one terminal)
python run.py backend

# Run frontend server (in another terminal)
python run.py frontend
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn src.backend.api:app --reload --host 127.0.0.1 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd src/frontend

# Install Node.js dependencies
npm install

# Run the development server
npm run dev
```

### Option 3: Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📖 Usage

### Web Interface

1. Open your browser and go to `http://localhost:3000`
2. Use the filter panel to customize your search:
   - **Location**: Choose from 25+ countries/regions
   - **Language**: Select your preferred language
   - **Time Range**: From past hour to all time
   - **Category**: Filter by topic categories
   - **Sort**: Order results by relevance, title, or search volume
3. Click "Refresh Trends" to fetch new data
4. Use "Download JSON" to export trends data

### API Endpoints

The backend provides several REST API endpoints:

- `GET /api/trends` - Fetch trending topics
- `GET /api/trends/download` - Download trends as JSON file
- `GET /api/health` - Health check endpoint
- `GET /` - API documentation

#### Example API Usage

```bash
# Fetch trends for Hong Kong in English
curl "http://localhost:8000/api/trends?geo=HK&hl=en&hours=24"

# Fetch trends for specific category
curl "http://localhost:8000/api/trends?geo=US&hl=en&category=8"

# Download trends as JSON file
curl "http://localhost:8000/api/trends/download?geo=US&hl=en" --output trends.json
```

### Command Line Interface

```bash
# Fetch trends via CLI
python -m src.backend.cli fetch --geo US --hl en --hours 24

# Start server via CLI
python -m src.backend.cli server --host 0.0.0.0 --port 8000 --reload
```

## 🎨 UI Features

- **Modern Gradient Design**: Beautiful color schemes and animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Components**: Smooth hover effects and transitions
- **Loading States**: Elegant loading animations and error handling
- **Statistics Dashboard**: Overview of trends data with visual metrics
- **Smart Filters**: Intuitive filter interface with current settings preview

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend Configuration
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
LOG_LEVEL=INFO

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Supported Locations

The application supports trends from these locations:
- 🇭🇰 Hong Kong, 🇺🇸 United States, 🇬🇧 United Kingdom, 🇯🇵 Japan
- 🇨🇦 Canada, 🇦🇺 Australia, 🇩🇪 Germany, 🇫🇷 France
- 🇮🇹 Italy, 🇪🇸 Spain, 🇧🇷 Brazil, 🇮🇳 India
- 🇰🇷 South Korea, 🇸🇬 Singapore, 🇲🇾 Malaysia, 🇹🇭 Thailand
- And many more...

## 🧪 Testing

```bash
# Run Python tests
python -m pytest tests/

# Run specific test file
python -m pytest tests/backend/test_parser.py -v

# Run frontend tests
cd src/frontend
npm test
```

## 📊 Data Structure

The application returns trending topics with the following structure:

```json
{
  "topics": [
    {
      "title": "Artificial Intelligence",
      "ranking": 1,
      "search_volume": "1000K+ searches",
      "change_percentage": "+25%",
      "url": "https://trends.google.com/...",
      "related_queries": ["AI", "machine learning"]
    }
  ],
  "source_url": "https://trends.google.com/trending?geo=HK",
  "timestamp": "2025-07-04T12:00:00Z",
  "total_trends": 10,
  "location": "HK",
  "language": "en"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Links

- **🐙 GitHub Repository**: [github.com/your-username/google-trends-explorer](https://github.com/your-username/google-trends-explorer)
- **📖 Documentation**: [Link to docs when available]
- **🐛 Report Issues**: [GitHub Issues](https://github.com/your-username/google-trends-explorer/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/google-trends-explorer/discussions)

## 📊 Project Status

![GitHub release](https://img.shields.io/github/release/your-username/google-trends-explorer.svg)
![GitHub issues](https://img.shields.io/github/issues/your-username/google-trends-explorer.svg)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/google-trends-explorer.svg)
![GitHub license](https://img.shields.io/github/license/your-username/google-trends-explorer.svg)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🔒 Security

For security issues, please see our [Security Policy](SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �🙏 Acknowledgments

- Google Trends for providing the data
- FastAPI and Next.js communities for excellent documentation
- Contributors and users who help improve this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/google-trends-explorer/issues) page
2. Create a new issue if needed
3. Join our community discussions

---

Made with ❤️ and ☕ by the Google Trends Explorer team
