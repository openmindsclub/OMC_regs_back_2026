# OMC Hunter Registration Backend

Backend API for Open Minds Club (OMC) registrations 2026, Built with Node.js, Express, TypeScript, Mongoose (MongoDB Atlas), and Zod.

---


## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your MongoDB connection string:
```env
PORT=5000
NODE_ENV=
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/omc_registrations?retryWrites=true&w=majority
CORS_ORIGIN=
ADMIN_API_KEY=
```
ask NAUR for the rest of the infos

### 3. Run Development Server
```bash
npm run dev
```
Server will start at `http://localhost:5000`.

---

## Free Database Setup (MongoDB Atlas)

1. Ask NAUR to add you to the existing database
---

