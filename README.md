# Campus One — Main Platform

Full-stack system for the Campus One platform. Houses the backend microservices and frontend application.

## Structure

```
Campus-One-System/
├── CAMPUS-ONE-MAIN-BE/   # NestJS monorepo — 12 standalone microservices
└── CAMPUS-ONE-MAIN-FE/   # Next.js 16 — landing page, login/signup
```

## Backend Services (CAMPUS-ONE-MAIN-BE)

| Service | Port | Responsibility |
|---|---|---|
| main gateway | 4000 | Unified entry point |
| auth-service | 3001 | Signup, login, role detection |
| institution-service | 3002 | Institution profile management |
| enrollment | 4001 | Class enrollment, offerings, history |
| application | 4002 | Applicant admissions flow |
| alumni | 4003 | Alumni registration, records, cards |
| student | 4004 | Student account management |
| profile-service | 4005 | Student profile CRUD |
| dashboard-service | 4006 | Dashboard data aggregation |
| grades-service | 4007 | Grades, deficiencies, graduation |
| subjects-service | 4008 | Subject listings with term filtering |
| courses-service | 4009 | Enrolled courses per student |

## Database

Schema and migrations are in `CAMPUS-ONE-MAIN-BE/supabase/`.

Run the full schema on your Supabase project via the SQL editor:
```
CAMPUS-ONE-MAIN-BE/supabase/schema.sql
```

Migrations run in order from `CAMPUS-ONE-MAIN-BE/supabase/migrations/`.

## Getting Started

### Backend
```bash
cd CAMPUS-ONE-MAIN-BE
npm install
cp .env.example .env   # fill in your Supabase keys
npm run dev            # starts all 12 services concurrently
```

### Frontend
```bash
cd CAMPUS-ONE-MAIN-FE
npm install
# create .env.local with:
# BE_URL=http://localhost:3001
npm run dev
```

## Environment Variables

### CAMPUS-ONE-MAIN-BE
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret) |
| `PORT` | Main gateway port (default 4000) |
| `AUTH_SERVICE_PORT` | Auth service port (default 3001) |
| `INSTITUTION_SERVICE_PORT` | Institution service port (default 3002) |
| `FRONTEND_ORIGIN` | CORS origin (default http://localhost:3000) |

### CAMPUS-ONE-MAIN-FE
| Variable | Description |
|---|---|
| `BE_URL` | Backend auth service URL (default http://localhost:3001) |
