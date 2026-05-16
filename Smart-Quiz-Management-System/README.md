# Smart Quiz & Assessment Management System

A production-ready, full-stack enterprise-grade platform designed for educational institutions to manage online examinations with high security, real-time feedback, and automated grading.

## 🌟 Key Highlights

- **Three-Portal Architecture**: Dedicated interfaces for **Administrators**, **Staff**, and **Students**.
- **Enterprise Security**: Robust protection against SQL Injection, XSS, and CSRF; JWT-based session management.
- **Automated Workflows**: Real-time evaluation of quiz results and automated PDF certificate generation.
- **AI Integration**: Capable of generating assessment questions dynamically (expandable feature).

## 🚀 How it Works Internally

1. **Role-Based Access Control (RBAC)**: The system distinguishes between three user roles:
    - **Admins**: Manage the entire ecosystem, oversee staff, and view global analytics.
    - **Staff**: Specialized tools for building question banks and configuring exam schedules.
    - **Students**: Secure, restricted environment for taking assessments and viewing performance reports.
2. **Security & Authentication**: Uses OTP-based registration for identity verification and JWT (JSON Web Tokens) stored in `HttpOnly` cookies to prevent token theft.
3. **Backend API Logic**: Built with **Flask** and **FastAPI** for high-performance data processing. The backend handles complex grading logic and certificate generation.
4. **Data Management**: Powered by **MySQL** with optimized schemas for fast query performance even with large question banks.

## 🛠️ Features

- **Secure Authentication**: OTP-based registration and password recovery.
- **Session Management**: JWT with access and refresh tokens stored in HttpOnly cookies.
- **Candidate Profiles**: Full CRUD operations for candidate profiles with premium UI.
- **Security Protections**: 
    - SQL Injection (Prepared statements & Pooling)
    - XSS (Input sanitization with Bleach)
    - CSRF (JWT CSRF protection)
    - IDOR (Identity-based RBAC)
    - Rate Limiting (Flask-Limiter)
    - Security Headers (Content Security Policy, X-Frame-Options, etc. via Talisman)
- **Aesthetics**: Modern, dark-mode inspired design with Framer Motion animations and Lucide icons.

## Tech Stack

- **Frontend**: React.js, Framer Motion, Lucide React, Axios.
- **Backend**: Python, Flask, Flask-JWT-Extended, Flask-Bcrypt, Flask-Mail, Flask-Talisman, Bleach.
- **Database**: MySQL with connection pooling.

## Setup Instructions

### 1. Database Setup
1. Ensure MySQL is running.
2. Run the `mysql_schema.sql` script to create the database and tables.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   - Fill in your MySQL credentials.
   - Configure Gmail SMTP for OTP delivery (you'll need an App Password).
5. Run the server:
   ```bash
   python app.py
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Security Considerations

- **Tokens**: Access tokens are short-lived, while refresh tokens allow for seamless session maintenance.
- **Cookies**: All auth cookies are set as `HttpOnly`, `Secure` (in production), and `SameSite=Strict`.
- **Validation**: Strict schema validation on both frontend and backend (using Marshmallow).
- **Sanitization**: All profile inputs are sanitized to prevent stored XSS.

## Testing

Run backend tests:
```bash
pytest backend/tests/test_backend.py
```
# authentication
