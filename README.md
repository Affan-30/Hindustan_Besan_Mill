# Hindustan Besan Mill — Daily Production & Expense Management System

A full-stack web application for recording daily production, worker payments, other
expenses, raw-material purchases, and bill payments for a besan mill, and generating
a complete daily report as a PDF, image, or print-out.

**Stack:** React + Vite + Tailwind (frontend) · Node + Express + MongoDB/Mongoose (backend) · JWT auth.

---

## 1. What's included

- Login (JWT auth, bcrypt-hashed passwords)
- Dashboard with today's production/expense summary cards, day-over-day comparison, and quick actions
- **Daily Entry** — enter production, worker payments, other payments, raw materials and bills for today from a single screen
- Production, Worker Payments, Other Payments, Raw Materials, Bills — full CRUD with search/filter/pagination
- Workers and Suppliers management, each with payment/purchase history
- Daily Report, Date Range Report, Monthly Report (with Recharts graphs)
- Export report as **PDF** or **PNG/JPG image**, plus browser **Print**
- Backend is the source of truth for every financial total — nothing is trusted from the frontend
- Indian Standard Time (Asia/Kolkata) business-date handling, so an entry at 11:30 PM IST lands on the correct day
- Seed script with 5 workers, 3 suppliers, and ~20 days of demo production/expense data

## 2. What's not included yet

Document 2 (the Bill/Invoice Generator, Sales module, Customers, Products, Invoice
History, Customer Ledger, GST-style Bill of Supply PDFs) is a large, separate system —
it's described in the project spec but not built in this pass, so the core daily
operations app could be delivered as a real, working codebase rather than a partial
version of both. It's a natural next step: the architecture (snapshot-based records,
backend-recalculated totals, MongoDB indexes) is already set up to extend cleanly into
invoicing whenever you're ready to build it.

---

## 3. Project structure

```
hindustan-besan-mill/
  backend/
    config/        MongoDB connection
    controllers/    route handlers (incl. generic CRUD factory)
    models/         Mongoose schemas
    routes/         Express routers
    middleware/      auth, error handling
    services/       backend-side financial totals (source of truth)
    utils/          date/IST handling, number-to-words, error class
    seed/           demo data seeding script
    app.js, server.js
  frontend/
    src/
      components/   UI primitives + DataTable + report document
      pages/        one file per screen
      layouts/      sidebar shell, protected route
      context/      auth + toast providers
      services/     axios instance + per-resource API wrappers
      hooks/        shared list/CRUD state hook
      utils/        formatting, PDF/image export
```

## 4. Setup

### 4.1 MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your IP (or `0.0.0.0/0` for development).
3. Copy the connection string — it looks like:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hindustan_besan_mill`

### 4.2 Backend

```bash
cd backend
cp .env.example .env
# edit .env and fill in MONGO_URI, JWT_SECRET, PORT, CLIENT_URL
npm install
npm run seed   # optional but recommended — creates demo data + admin login
npm run dev
```

Backend runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

Seeded login: **admin@hindustanbesanmill.com / admin123**

### 4.3 Frontend

```bash
cd frontend
cp .env.example .env
# edit .env if your backend isn't on localhost:5000
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 5. Environment variables

**backend/.env**
```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hindustan_besan_mill
JWT_SECRET=a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files — only `.env.example` is checked in.

## 6. Production build & deployment

```bash
# frontend
cd frontend
npm run build      # outputs static files to frontend/dist
```

Deploy the backend (e.g. Render, Railway, a VPS) with the environment variables above,
and deploy `frontend/dist` as a static site (e.g. Vercel, Netlify), pointing
`VITE_API_URL` at your deployed backend's `/api` URL. Set `CLIENT_URL` on the backend
to your deployed frontend's origin for CORS.

## 7. API overview

All routes except `/api/auth/*` require `Authorization: Bearer <token>`.

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/production`, `GET /api/production/date/:date` (production is upserted per calendar date)
- `GET/POST/PUT/DELETE /api/workers`, `GET /api/workers/:id/history`
- `GET/POST/PUT/DELETE /api/suppliers`, `GET /api/suppliers/:id/history`
- `GET/POST/PUT/DELETE /api/worker-payments`
- `GET/POST/PUT/DELETE /api/payments` (other payments)
- `GET/POST/PUT/DELETE /api/raw-materials`
- `GET/POST/PUT/DELETE /api/bills`
- `GET /api/reports/daily/:date`, `GET /api/reports/monthly/:year/:month`, `GET /api/reports/range?from=&to=`
- `GET /api/dashboard/daily/:date`

## 8. Notes on design decisions

- **Financial totals are always computed on the backend** (`services/totalsService.js`), never trusted from request bodies.
- **Production is unique per business date** — saving again for the same date updates that day's record instead of creating a duplicate.
- **Worker and supplier names are snapshotted** onto payment/purchase records, so historical reports stay accurate even if a worker or supplier is later renamed.
- **All business dates are normalized to the Asia/Kolkata calendar day** (`utils/dateUtils.js`), so a late-night entry lands on the correct day regardless of server timezone.
