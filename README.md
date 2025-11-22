# StockMaster

## Team Details
- Team Name: [The Logic Legends]
- Members:
  - [Sana Zakir Shaikh]
  - [Amrut Bhagwan Patankar]
  - [Irfan Labbai]
  - [Talha Siddique]

## Problem Statement
[ Build a modular Inventory Management System (IMS) that digitizes and 
streamlines all stock-related operations within a business. The goal is to replace 
manual registers, Excel sheets, and scattered tracking methods with a centralized, 
real-time, easy-to-use app.]

## Reviewer Name
[Aman Patel]

## Functional Video Link
https://youtu.be/nYZgAdSssrQ?si=q_Dd7WMdVP3NpRNZ

---

## 🧩 Features

* Receipts (incoming) — draft & validate flows (auto-increase stock)
* Delivery orders (outgoing) — pick, pack, validate (auto-decrease stock)
* Internal transfers (warehouse → warehouse / location → location)
* Stock adjustments & physical count reconciliation
* Movement ledger & history (audit trail)
* Products, warehouses, locations CRUD
* Dashboard KPIs & filters (low stock, pending receipts, pending deliveries)
* Supabase authentication (signup/login, password reset via OTP)
* MySQL offline mode for resilience when API is unreachable
* Role-based UI & permissions (manager / staff)
* Responsive UI (Tailwind CSS)

---

## 🏗 Tech Stack

* **Frontend**: React + TypeScript + Vite, Tailwind CSS, lucide-react icons, sonner (toasts)
* **Auth**: Supabase Authentication
* **Backend**: Python + FastAPI (REST API), Pydantic schemas, Alembic migrations
* **Database**: MySQL (primary & offline local fallback)
* **Dev Tools**: Vite, Docker (optional), Postman for API testing

---

## 📂 Repo Structure (important files)

```
frontend/
  ├─ src/
  │  ├─ components/
  │  │  ├─ ui/           # reusable UI primitives
  │  │  ├─ Header.tsx
  │  │  ├─ Navbar.tsx
  │  │  └─ ...
  │  ├─ contexts/
  │  │  └─ AuthContext.tsx
  │  ├─ lib/
  │  │  ├─ mock-data.ts
  │  │  └─ types.ts
  │  ├─ pages/
  │  │  ├─ Receipts.tsx
  │  │  ├─ AddReceipt.tsx
  │  │  ├─ Deliveries.tsx
  │  │  ├─ Products.tsx
  │  │  └─ Profile.tsx
  │  ├─ App.tsx
  │  └─ main.tsx
  ├─ package.json
  └─ vite.config.ts

backend/
  ├─ app/
  │  ├─ models/        # SQLAlchemy models
  │  │  ├─ product.py
  │  │  ├─ receipts.py
  │  │  └─ ...
  │  ├─ routers/
  │  │  ├─ products.py
  │  │  ├─ receipts.py
  │  │  └─ auth.py
  │  ├─ schemas/
  │  ├─ database.py
  │  └─ main.py
  ├─ migrations/
  ├─ requirements.txt
  └─ Dockerfile (optional)
```

---

## ⚙️ Setup — Frontend (local)

1. **Prereqs**: Node.js (16+), pnpm or npm
2. From `frontend/`:

```bash
# install
npm install
# or
pnpm install

# start dev server
npm run dev
# or
pnpm run dev
```

3. Environment variables (create `.env` at `frontend/`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## ⚙️ Setup — Backend (local)

1. **Prereqs**: Python 3.10+, pip, MySQL running (or Docker)
2. Create & activate venv, then install:

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure `.env` (example):

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/stockmaster
SECRET_KEY=your_secret_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

4. Run migrations (Alembic):

```bash
alembic upgrade head
```

5. Start FastAPI server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🔌 API Overview (examples)

> Base: `http://localhost:8000/api`

### Auth

* `POST /api/auth/signup` — create user (Supabase-backed)
* `POST /api/auth/login` — login — returns JWT
* `POST /api/auth/password-reset` — request OTP / reset

### Receipts

* `GET /api/receipts` — list receipts
* `POST /api/receipts` — create receipt (draft)
* `PUT /api/receipts/{id}/validate` — validate & update stock
* `DELETE /api/receipts/{id}` — delete receipt

### Products

* `GET /api/products`
* `POST /api/products`
* `PUT /api/products/{id}`
* `DELETE /api/products/{id}`

### Internal Transfers & Movements

* `POST /api/transfers`
* `GET /api/movements`

> Use Auth header: `Authorization: Bearer <token>`

---

## 🧪 Offline Mode (MySQL fallback)

* Primary mode: backend persists to remote MySQL or managed DB
* Offline mode: local MySQL instance stores transactions and syncs when network returns
* Sync pattern: queue changes in local DB table `sync_queue` and run background job to push changes to central DB

---

## 🧩 Frontend TypeScript Types (example)

`frontend/src/lib/types.ts`

```ts
export type ReceiptStatus = 'ready' | 'not_ready';

export interface Receipt {
  id: string;
  reference: string;
  from_location?: string;
  to_location?: string;
  supplier?: string;
  warehouseId?: string;
  contact?: string;
  schedule_date?: string;
  created_at?: string;
  status: ReceiptStatus;
  items?: { productId: string; quantity: number; unit?: string }[];
}
```

---

## ✅ UI Notes & Conventions

* Primary color palette: teal / deep blue (#1A4971)
* UX patterns: left navigation, top header, contextual page title on right
* Table rows are clickable and open detail views
* Buttons use consistent rounded corners, accessible sizes and focus outlines

---

## 🎥 Screenshots and Design Assets

* See `frontend/src/assets/` for exported screenshots
* Design doc (uploaded PDF): `/mnt/data/StockMaster (1).pdf`

---

## 🧭 How to Contribute

1. Fork this repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make PR with detailed description and screenshots
4. Ensure all tests pass & run linters (ESLint / Flake8)

---

## ✅ Code Quality & Tools

* **ESLint** + Prettier — code formatting / lint rules
* **TypeScript** — type-safety in frontend
* **Pydantic** — request/response validation in backend
* **Alembic** — DB migrations
* **Docker** (optional): containers for DB and services for easier dev

---

## 🛡 Security & Permissions

* Role-based permissions handled in `AuthContext` (frontend) and middleware in backend
* Sensitive keys are stored in environment files and never pushed to repo
* Supabase handles authentication; backend verifies Supabase JWTs for protected routes

---

## 📦 Deployment (high level)

* Build frontend: `npm run build` → upload to CDN (Netlify / Vercel / S3 + CloudFront)
* Backend: Dockerize FastAPI app and deploy to cloud provider (AWS ECS/Fargate, GCP Cloud Run)
* Database: Managed MySQL (AWS RDS / GCP Cloud SQL) + read replicas if needed
* Use a message queue (Redis / RabbitMQ) for offline sync jobs if scale increases

---

## 🧾 License

```
MIT License
```

---

## 📌 Acknowledgements & References

* Supabase (Auth) — [https://supabase.com](https://supabase.com)
* FastAPI — [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
* Vite — [https://vitejs.dev](https://vitejs.dev)
* TailwindCSS — [https://tailwindcss.com](https://tailwindcss.com)

---

## 🛠 Helpful Commands (cheat-sheet)

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Database (MySQL):

```sql
CREATE DATABASE stockmaster;
-- run migrations after .env configured
```

---

## 🎯 Final Notes

This README is intended to be a one-stop onboarding document for developers, reviewers, and maintainers. Replace demo links, environment values, and any placeholders with your actual project details before publishing the repo.

---

If you want, I can:

* Generate a `.github/workflows/ci.yml` for CI (lint/test/build)
* Provide Docker Compose for local dev with MySQL + Supabase emulator (if needed)
* Create Postman collection / OpenAPI spec from your FastAPI app

```
```
