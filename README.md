# ShareWise AI — Real-Time Multi-Model Stock Analytics & Prediction Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://ml-project-xi.vercel.app/)
[![Backend API](https://img.shields.io/badge/FastAPI_Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://ml-project-e9et.onrender.com/api/stocks)

🔗 **Live Deployments**:
- 🌐 **Frontend Application**: [https://ml-project-xi.vercel.app/](https://ml-project-xi.vercel.app/)
- ⚙️ **FastAPI Backend API**: [https://ml-project-e9et.onrender.com/api](https://ml-project-e9et.onrender.com/api)
- 📚 **Swagger API Docs**: [https://ml-project-e9et.onrender.com/docs](https://ml-project-e9et.onrender.com/docs)

ShareWise AI is a full-stack, machine-learning-powered financial analytics platform. It integrates live stock market data via `yfinance` into a high-performance **Python FastAPI** backend serving four trained machine learning regression models (Linear Regression, Polynomial Regression, RBF SVR, and Random Forest), rendered on a responsive **React + Vite + TypeScript** frontend.

---

## 🏛️ Project Architecture

```text
ML-Project/
│
├── Frontend/                 # React + Vite + TypeScript Application
│   ├── src/
│   │   ├── components/       # Header, StockOverview, PricePrediction, etc.
│   │   ├── pages/            # WatchlistPage, ModelsPage, MarketInsightsPage
│   │   ├── services/         # api.ts (VITE_API_URL environment-aware)
│   │   └── types/            # Stock & API TypeScript definitions
│   ├── public/
│   ├── .env.example          # Template for Vite environment variables
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # FastAPI Machine Learning Server
│   ├── main.py               # REST API endpoints & Technical Feature Engine
│   ├── requirements.txt      # Python production dependencies
│   └── .gitignore
│
└── model/                    # ML Model Artifacts & Evaluation Metrics
    ├── linear_regression_model.pkl
    ├── polynomial_regression_model.pkl
    ├── rbf_svr_model.pkl
    ├── reliance_random_forest_model.pkl
    ├── reliance_model_features.pkl
    ├── historical_stock_data.csv
    └── model_metrics.json
```

---

## 🤖 Machine Learning Models & Metrics

The backend calculates 28 technical indicators (moving averages, RSI, MACD, volatility, lagged returns, volume ratios) in real-time to drive four regression models:

| Model ID | Model Name | Algorithm / Specifications | R² Score | Directional Accuracy | MAE | RMSE |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **`rf`** | Random Forest Regressor | 500 Decision Trees (Max Depth 12) | **0.990** | 48.6% | ₹13.31 | ₹18.05 |
| **`linear`** | Linear Regression | Ordinary Least Squares (OLS) Fit | **0.988** | 49.3% | ₹15.14 | ₹20.25 |
| **`rbf`** | RBF Kernel SVR | Support Vector Regressor ($C=10.0$) | **0.945** | 50.9% | ₹35.88 | ₹43.19 |
| **`polynomial`** | Polynomial Regression | 2nd-Degree Quadratic Feature Expansion | **0.614** | 50.2% | ₹68.47 | ₹114.40 |

---

## ✨ Features

- **Real-Time Data Ingestion**: Live market data fetching via `yfinance` with automated fallback to cached datasets.
- **Dynamic Model Switching**: Switch model algorithms on-the-fly to compare performance, directional accuracy, and forecasted price targets across multiple timeframes (7D, 30D, 90D).
- **Interactive Technical Charts**: 1-month historical visualization synchronized with 30-day forecast targets.
- **Watchlist & Market Insights**: Real-time stock watchlist management and technical sentiment breakdown (RSI, MACD, SMA20).

---

## 🚀 Local Development Setup

### 1. Backend Setup (FastAPI)

Navigate to the `backend/` directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI development server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open interactive API documentation:
- **Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Endpoint**: [http://127.0.0.1:8000/api/stocks](http://127.0.0.1:8000/api/stocks)

---

### 2. Frontend Setup (React + Vite)

Navigate to the `Frontend/` directory:

```bash
cd Frontend
```

Install packages:

```bash
npm install
```

Create a local `.env` file:

```bash
cp .env.example .env
```

Start the Vite development server:

```bash
npm run dev
```

Open application in browser: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Production Deployment Architecture

```text
               INTERNET
                  │
         ┌────────▼────────┐
         │  User Browser   │
         └────────┬────────┘
                  │ HTTPS
     ┌────────────▼────────────┐
     │ React + Vite Frontend   │
     │        (Vercel)         │
     └────────────┬────────────┘
                  │ API Requests
     ┌────────────▼────────────┐
     │ Python FastAPI Backend  │
     │        (Render)         │
     └────────────┬────────────┘
                  │ Loads ML Models (.pkl)
     ┌────────────▼────────────┐
     │      Model Directory    │
     │ pandas / sklearn / SVR  │
     └─────────────────────────┘
```

### Backend (Render Web Service)
- **Root Directory**: `.` (deploy root repository to preserve sibling `model/` path access)
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variable**: `ALLOWED_ORIGINS=https://your-frontend.vercel.app`

### Frontend (Vercel)
- **Root Directory**: `Frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://ml-project-e9et.onrender.com/api`

---

## 🛠️ Built With

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI, Uvicorn, Pydantic
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib, YFinance