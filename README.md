# 🛒 Freshmart: Premium Grocery Flow

Freshmart is a high-performance, AI-architected grocery booking platform. Built with a focus on premium aesthetics, robust scalability, and a dual-interface role system (Admin/User), it provides a seamless shopping experience from product discovery to order fulfillment.

##  AI-Enhanced Architecture & Design

This project follows an **Agentic Development** philosophy, utilizing advanced AI design intelligence (`ui-ux-pro-max`) to ensure a state-of-the-art user experience.

- **Intelligent Design System**: Every component is crafted using a curated palette (Emerald & Teal), modern typography (Outfit/Inter), and smooth micro-animations.
- **Glassmorphism UI**: High-end visual effects including backdrop blurs and subtle gradients for a premium feel.
- **AI-Co-Pilot built**: Developed using advanced agentic coding patterns for clean, modular, and maintainable architecture.

---

##  Architecture Decisions

### 1. Robust Backend (NestJS + Prisma)
We chose **NestJS** for its modular architecture and **Prisma** as the ORM to ensure 100% type safety across the database layer.
- **Decision**: Uses PostgreSQL for relational data integrity (Inventory, Orders, Users).
- **Benefit**: Predictable scaling and enterprise-grade code structure.

### 2. Event-Driven Orders (BullMQ + Valkey/Redis)
Orders are processed asynchronously using **BullMQ**.
- **Decision**: Separates order booking from inventory deduction.
- **Benefit**: High availability during peak traffic; no lost orders if the main server is busy.

### 3. Modern Frontend (Next.js 14 + Zustand)
Built with **Next.js 14** using the App Router for optimal performance.
- **Decision**: Uses **Zustand** for lightweight, high-performance state management (Cart & Auth).
- **Styling**: Vanilla Tailwind CSS + Framer Motion for sophisticated animations.

---

##  Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | NestJS, TypeScript, JWT, Passport.js |
| **Database** | Prisma ORM, PostgreSQL |
| **Caching/Queues** | BullMQ, Valkey (Redis) |
| **Frontend** | Next.js 16 (App Router), Tailwind CSS, Framer Motion |
| **State Management** | Zustand (Global persistence) |
| **Documentation** | Swagger (OpenAPI 3.0) |

---

## 🚀 Deployment Strategy

The application is architected for a distributed cloud environment:

- **Backend (Render)**: Deployed as a Dockerized Web Service on Render, leveraging Managed PostgreSQL and a Free-tier KeyValue (Valkey) instance.
- **Frontend (Vercel)**: Hosted on Vercel for world-class CDN performance and edge rendering.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

### Setup
1. **Clone the repo**
2. **Setup environment variables**:
   Create a `.env` file in the root and `frontend/.env.local`.
3. **Start Infrastructure**:
   ```bash
   docker-compose up -d
   ```
4. **Install & Run Backend**:
   ```bash
   npm install
   npx prisma generate
   npm run start:dev
   ```
5. **Install & Run Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🛡️ Security
- **JWT Authentication**: Secure stateless sessions.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Customers.
- **Validation**: Strict DTO validation using `class-validator`.

---

<p align="center">
  Built with ❤️ and 🤖 AI Design Intelligence.
</p>
