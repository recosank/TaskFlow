Full-Stack Assignment — Node.js, PostgreSQL, Prisma, React, TypeScript

I built this full-stack assignment using **Node.js, Express, PostgreSQL, Prisma ORM**, and a **React + TypeScript frontend**. The project features **secure JWT authentication**, **HTTP-only refresh tokens**, **automatic access-token renewal**, **TanStack React Query for real-time UI**, **Zod validation**, **Error Boundaries** with Fallback UI, and a clean reusable architecture using **custom hooks**, **protected routes**, and **Axios interceptors**. TailwindCSS and Radix UI ensure a modern interface, while Prisma provides an efficient, type-safe database layer.

---

# 🛠️ Tech Stack

### **Frontend**

- React 19 + TypeScript
- Vite
- TanStack React Query
- React Router DOM
- React Hook Form + Zod
- Axios (with token-refresh interceptors)
- TailwindCSS
- Error Boundaries + Fallback UI
- Radix UI
- Lucide Icons
- react-loading-skeleton
- Framer Motion

### **Backend**

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT (Access + Refresh Tokens)
- bcrypt
- cookie-parser
- express-async-errors
- Zod validation

---

# 🔐 Authentication Flow

- User logs in → server sets **secure HTTP-only refresh token** + returns access token
- Access token is stored **in memory only** (safe)
- On page refresh → `/auth/refresh` automatically issues a new access token
- Axios interceptors retry failed (401) requests
- Protected backend routes require a valid JWT
- Protected frontend pages use custom hooks (`useAuth`, `useProtectedRoute`)

---

# 📸 Main UI Screens

## 🗂️ Project View Page

✔ React Query caching
✔ Placeholder data to avoid white screen
✔ Skeleton loaders
✔ Error Boundary fallback
✔ Smooth transitions

**Screenshot:**
`/screenshots/project-view.png`

---

## 📊 Dashboard

✔ User-specific data
✔ Protected route
✔ Real-time updates via React Query
✔ Animations via Framer Motion

**Screenshot:**
`/screenshots/dashboard.png`

---

## 🗄 Prisma Studio

**Screenshot:**
`/screenshots/prisma-studio.png`

---

# ▶️ How to Run the Project

## 🔧 Backend

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create `.env`

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DBNAME"
JWT_SECRET="your-access-secret"
REFRESH_SECRET="your-refresh-secret"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

### 5. Start Server

```bash
npm run dev
```

---

## 🎨 Frontend

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create `.env`

```
VITE_API_URL="http://localhost:5000"
```

### 3. Start Dev Server

```bash
npm run dev
```
