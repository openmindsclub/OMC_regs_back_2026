# OMC Hunter Registration Backend

Backend API for Open Minds Club (OMC) Hunter Exam Recruitment 2026. Built with Node.js, Express, TypeScript, Mongoose (MongoDB Atlas), and Zod.

---

## Features

- Multi-stage Hunter Form Support: Designed specifically to match the 4-step registration UI:
  1. Hunter Identity (firstName, phoneNumber, email, discordId)
  2. Academic Background (specialty, currentLevel, university)
  3. Choose Your Path (Flexible schema that easily handles any departments/questions once the design team finalizes them)
  4. Digital Footprint (githubUrl, linkedinUrl, portfolioUrl)
- Strict Validation with Zod: Automatic input cleaning, email validation, and descriptive error messages.
- Duplicate Prevention: Prevents duplicate submissions by email.
- Organizers Admin Suite:
  - Search and filter candidates by department, university, status, or keyword.
  - Candidate status progression (pending -> reviewed -> interview -> accepted / rejected).
  - CSV Export: Organizers can download all registrations formatted for Excel / Google Sheets with one click.
  - Dashboard recruitment stats summary.
- Production-Ready: Configured with CORS, Helmet security headers, Morgan logging, and graceful error handling.

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
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/omc_registrations?retryWrites=true&w=majority
CORS_ORIGIN=*
ADMIN_API_KEY=omc_hunter_secret_2026
```

### 3. Run Development Server
```bash
npm run dev
```
Server will start at `http://localhost:5000`.

---

## Free Database Setup (MongoDB Atlas)

1. Go to MongoDB Atlas and create an account.
2. Click Create a Cluster and choose the M0 (Free) tier.
3. Choose a provider and region.
4. Under Security Quickstart:
   - Create a database user and password.
   - Under Network Access, choose Allow Access from Anywhere (0.0.0.0/0) so cloud hosting can connect.
5. Click Connect -> Drivers -> copy the connection string.
6. Replace `<password>` with your password and paste it into `MONGODB_URI` in `.env`.

---

## Free Hosting Guide (Render.com)

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete omc registration backend"
   git push origin main
   ```
2. Go to Render.com and sign in with GitHub.
3. Click New -> Web Service.
4. Select your OMC_regs_back_2026 repository.
5. Fill in the settings:
   - Name: omc-registration-api
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Instance Type: Free
6. Under Environment Variables, add:
   - MONGODB_URI: your MongoDB Atlas connection string
   - ADMIN_API_KEY: a secret key for club organizers
   - NODE_ENV: production
   - CORS_ORIGIN: *
7. Click Create Web Service.

---

## API Reference

### 1. Health Check
`GET /api/health`
```json
{
  "status": "ok",
  "timestamp": "2026-11-01T10:00:00.000Z",
  "service": "OMC Registration Backend",
  "uptime": 45.2
}
```

---

### 2. Candidate Registration (Public)
`POST /api/registrations`

Payload:
```json
{
  "firstName": "Killua",
  "lastName": "Zoldyck",
  "phoneNumber": "+213555123456",
  "email": "killua@hunter.exam",
  "discordId": "killua#1234",
  "specialty": "Computer Science",
  "currentLevel": "L3",
  "university": "USTHB",
  "department": "Development",
  "pathDetails": {
    "subChoice": "Backend",
    "motivation": "Looking forward to learning with OMC"
  },
  "githubUrl": "https://github.com/killua",
  "linkedinUrl": "https://linkedin.com/in/killua"
}
```

---

### 3. Admin Endpoints (Club Organizers)
Pass the header `x-admin-key: <your_ADMIN_API_KEY>` (or query `?adminKey=...`).

#### List Registrations (with pagination and search)
`GET /api/registrations?page=1&limit=20&search=Killua&department=Development`

#### View Single Candidate
`GET /api/registrations/:id`

#### Update Candidate Status
`PATCH /api/registrations/:id/status`
```json
{
  "status": "accepted",
  "adminNotes": "High scores in test interview."
}
```
Valid statuses: pending, reviewed, interview, accepted, rejected.

#### Download CSV for Excel / Google Sheets
`GET /api/registrations/export/csv`

#### Recruitment Statistics Dashboard
`GET /api/registrations/stats`
```json
{
  "success": true,
  "data": {
    "totalApplicants": 142,
    "byStatus": { "pending": 100, "interview": 30, "accepted": 12 },
    "byDepartment": { "Development": 60, "Design": 40, "Multimedia": 42 },
    "topUniversities": [{ "university": "USTHB", "count": 85 }]
  }
}
```
