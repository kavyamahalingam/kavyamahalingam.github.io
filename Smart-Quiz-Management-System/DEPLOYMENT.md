# Deployment Guide: Smart Quiz & Assessment System

This guide explains how to deploy the Smart Quiz project to live platforms like **Render** (Backend) and **Vercel** (Frontend).

## 1. Backend Deployment (Render.com / Railway.app)

The backend is configured to run on Render using the provided `render.yaml`.

### Steps:
1.  **Push to GitHub**: Ensure your code is on GitHub.
2.  **Create a New Web Service**: Select the `backend` folder as the root.
3.  **Environment Variables**:
    - `FLASK_ENV`: `production`
    - `DB_HOST`: Your live MySQL host.
    - `DB_USER`: Database username.
    - `DB_PASSWORD`: Database password.
    - `DB_NAME`: Database name.
    - `SECRET_KEY`: A long random string.
    - `JWT_SECRET_KEY`: Another random string.
    - `MAIL_USERNAME`: Your Gmail address.
    - `MAIL_PASSWORD`: Your Gmail App Password.
4.  **Start Command**: `gunicorn --worker-class eventlet -w 1 app:app`

## 2. Frontend Deployment (Vercel)

The frontend is a Vite + React application.

### Steps:
1.  **Import to Vercel**: Connect your GitHub repository.
2.  **Root Directory**: **IMPORTANT**: Set this to `Smart-Quiz-Management-System/frontend`.
3.  **Environment Variables**:
    - `VITE_API_URL`: (Optional) The URL of your deployed Render backend if not using proxy.
4.  **Configuration**: The `vercel.json` file handles API proxying. **Make sure to update the destination URL in `vercel.json` to match your Render backend URL.**

## 3. Database Setup
1.  **Use a Managed Database**: I recommend **Railway.app** or **Aiven.io**.
2.  **Initialize Schema**: Run `mysql_schema.sql` against your live database.
