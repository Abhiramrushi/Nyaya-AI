# Nyaya-AI 🚀

AI-Powered Legal Judgment Analysis Platform

Nyaya-AI leverages advanced AI for processing legal documents, extracting insights from judgments, and providing intelligent analysis. Perfect for legal tech hackathons.

## ✨ Key Features
- **Document Pipeline**: OCR, preprocessing, and semantic extraction from PDFs/images.
- **Intelligence Engine**: NLP-based summarization, entity recognition, precedent matching.
- **Interactive Dashboard**: React-based UI for uploading docs, viewing judgments, analytics.
- **REST API**: FastAPI backend with Pydantic schemas, async endpoints.
- **Database**: SQLAlchemy models for storing processed data.
- **Containerized**: Docker Compose for local/prod deployment.

## 🛠 Tech Stack
| Component | Tech |
|-----------|------|
| Backend | FastAPI, Python, SQLAlchemy, PostgreSQL |
| Frontend | React 18, Vite, Tailwind/Vite CSS |
| AI/ML | Document services, intelligence engine (custom) |
| DevOps | Docker, docker-compose |

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional)

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

### Docker (Full Stack)
```bash
docker-compose up --build
```

### Uploads
Files go to `./uploads/` dir.

## 📁 Project Structure
```
hackathon/
├── backend/
│   ├── core/config.py
│   ├── models.py         # DB models
│   ├── schemas.py        # Pydantic schemas
│   ├── routers/judgments.py
│   ├── services/
│   │   ├── document_pipeline.py
│   │   └── intelligence_engine.py
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/Dashboard.jsx
│   │   ├── components/JudgmentView.jsx
│   │   └── api.js
│   ├── package.json
│   └── vite.config.js
├── uploads/              # User uploads
├── docker-compose.yml
├── README.md
└── .gitignore
```

## 🔮 Future Enhancements
- RAG integration for better querying.
- Vector DB (Pinecone/Weaviate).
- Authentication/JWT.
- Deployment to Vercel/Render.

## 🤝 Contributing
1. Fork & clone.
2. Create branch: `git checkout -b feature/xyz`
3. Commit & PR.

## 📄 License
MIT - Hackathon project.

**Author**: Abhiram Rushi  
**Built for**: Hackathon 2024
