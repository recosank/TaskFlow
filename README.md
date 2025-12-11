# Full-Stack Assignment — Node.js, PostgreSQL, Prisma, React, TypeScript

I built this full-stack assignment using **Node.js, Express, PostgreSQL, Prisma ORM**, and a **React + TypeScript frontend**. The project features **secure JWT authentication**, **HTTP-only refresh tokens**, **automatic access-token renewal**, **TanStack React Query for real-time UI**, **Zod validation**, **Error Boundaries** with Fallback UI, and a clean reusable architecture using **custom hooks**, **protected routes**, and **Axios interceptors**. It also includes an optimized debounced search functionality, reducing unnecessary API calls and providing a smooth search experience. TailwindCSS and Radix UI ensure a modern interface, while Prisma provides an efficient, type-safe database layer.

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

# Main UI Screens

## 🗂️ Project View Page

- React Query caching
- Placeholder data to avoid white screen
- Skeleton loaders
- Error Boundary fallback
- Smooth transitions

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

# ▶️ How to Run the Project

## 🎨 Frontend

### 1. Install Dependencies

```bash
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
