# Sample UniProject WayGood

A full-stack web app built with **React** on the frontend and **Node.js/Express** on the backend. This project handles user authentication, file uploads, and template downloads. It’s fully dockerized, so you can get it running locally in minutes.

---

## Features
- User signup and login  
- Upload files and process them  
- Download templates for uploads  
- Responsive React UI with Tailwind CSS  
- Toast notifications for feedback  
- Docker-ready for hassle-free setup

---

## Tech Stack
- **Frontend:** React, Tailwind CSS, lucide-react icons  
- **Backend:** Node.js, Express.js  
- **Database:** (Add your database here, e.g., MongoDB or PostgreSQL)  
- **Tools:** Docker, Docker Compose  

---

## Getting Started

### Clone the repo
```bash
git clone https://github.com/yourusername/sampleuniproject-waygood.git
cd sampleuniproject-waygood



Install dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install



Running with Docker

Create a .env file in the root folder:

JWT_SECRET=your_secret_key_here
PORT=5000
# Add other environment variables as needed


Build and start the containers:

docker compose up --build


Backend: http://localhost:5000

Frontend: http://localhost:3000

Make sure Docker Desktop is running before starting.

How to Use

Sign up or log in as a user/admin

Upload your files via the frontend interface

Download templates if needed

Check notifications for success/failure messages

API Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	Create a new user/admin
POST	/api/auth/login	Login user/admin
POST	/api/upload	Upload a file
GET	/api/download-template	Download template
