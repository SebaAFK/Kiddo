# 🎒 Kiddo — School Management System

## Project Structure
```
kiddo-app/
├── frontend/   ← React app (deploy to Netlify)
└── backend/    ← Express API (deploy to Render.com)
```

## Run Locally

### 1. Start MySQL (make sure it's running)

### 2. Backend
```cmd
cd backend
npm install
npm run dev
```
Runs on http://localhost:5001

### 3. Frontend
```cmd
cd frontend
npm install
npm run dev
```
Runs on http://localhost:3000

## Login Credentials
| Role    | Username            | Password    |
|---------|---------------------|-------------|
| Student | lina_ahmed_k1_01    | LinaAhmed   |
| Student | adam_tamer_k1_10    | AdamTamer   |
| Teacher | KG001               | password    |

## Deploy to Netlify + Render

### Backend → Render.com
1. Push backend folder to GitHub
2. Create account at render.com
3. New Web Service → connect your repo
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from .env

### Frontend → Netlify
1. Update frontend/.env.production with your Render URL
2. Run: npm run build
3. Drag the `dist` folder to netlify.com/drop
