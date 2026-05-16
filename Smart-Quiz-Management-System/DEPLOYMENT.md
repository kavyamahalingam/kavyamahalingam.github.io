# Deployment Guide: Smart Quiz & Assessment System

This guide explains how to deploy the Smart Quiz project to live platforms like **Render** (Backend) and **Vercel** (Frontend).

## 1. Backend Deployment (Render.com)

The backend is configured to run on Render using the provided `render.yaml`.

### Steps:
1.  **Push to GitHub**: Ensure your code is on GitHub.
2.  **Create a New Web Service**: Select the `backend` folder as the root.
3.  **Environment Variables**:
    - `DB_HOST`: Your live MySQL host (e.g., from Aiven or Railway).
    - `DB_USER`: Database username.
    - `DB_PASSWORD`: Database password.
    - `DB_NAME`: Database name.
    - `SECRET_KEY`: A long random string.
    - `JWT_SECRET_KEY`: Another random string.
    - `MAIL_USERNAME`: Your Gmail address for OTPs.
    - `MAIL_PASSWORD`: Your Gmail App Password.
4.  **Start Command**: `gunicorn --worker-class eventlet -w 1 app:app` (already set in `render.yaml`).

## 2. Database Setup

Since this project requires MySQL:
1.  **Use a Managed Database**: I recommend **Railway.app** or **Aiven.io** for a free/low-cost MySQL instance.
2.  **Initialize Schema**: Run the `mysql_schema.sql` script against your live database using a tool like MySQL Workbench or the platform's SQL console.

## 3. Frontend Deployment (Vercel)

The frontend is a Vite + React application.

### Steps:
1.  **Import to Vercel**: Connect your GitHub repository.
2.  **Root Directory**: Set to `frontend`.
3.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Render backend (e.g., `https://smart-quiz-backend.onrender.com`).
4.  **Configuration**: The `vercel.json` file in the `frontend` folder automatically handles API proxying for you.

## 4. Finalizing the Live Demo

Once deployed:
1.  Copy your Vercel deployment URL.
2.  Update the **Live Demo** buttons in the root `index.html` and `README.md` if your URL is different from `https://smart-quiz-demo.vercel.app`.

---
*Note: This configuration ensures real-time WebSockets (Socket.IO) work correctly across different domains using CORS and proxying.*
