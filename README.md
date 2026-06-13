<div align="center">

<img src="public/images/AxioQuan.jpg" alt="Axioquan Logo" width="120" height="120" style="border-radius: 16px;" />

# 🎓 AxioQuan LMS

### *Where Knowledge Meets Innovation*

**A production-grade, full-stack Learning Management System built with Next.js 16, React 19, and a complete modern DevOps pipeline.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-axio--prod--dev.onrender.com-2563EB?style=for-the-badge)](https://axio-prod-dev.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-sancy1%2Faxioquan--cloudflare-181717?style=for-the-badge&logo=github)](https://github.com/sancy1/axioquan-cloudflare)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker)](https://docker.com)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform)](https://terraform.io)

---

*The future of education — a space where knowledge meets innovation and learning becomes an immersive journey of discovery and growth.*

</div>

---

## 📋 Table of Contents

- [🌟 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [� Related Microservices](#-related-microservices)
- [�️ Tech Stack](#️-tech-stack)
- [⚙️ DevOps Pipeline](#️-devops-pipeline)
- [🚀 Quick Start — Clone & Run](#-quick-start--clone--run)
- [🐳 Docker Setup (Recommended)](#-docker-setup-recommended)
- [💻 Local Development (Without Docker)](#-local-development-without-docker)
- [🔐 Environment Variables](#-environment-variables)
- [🏗️ Infrastructure Setup (Terraform)](#️-infrastructure-setup-terraform)
- [📦 Deployment](#-deployment)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Project Overview

**AxioQuan** is a feature-rich e-learning platform where teachers and students connect in a modern, interactive environment. Built as a monolithic full-stack Next.js application, it serves two critical functions:

1. **Full-Stack Server** — All API routes, server-side rendering, authentication, and real-time features live within a single codebase, eliminating the need for a separate backend.
2. **API Consumer** — Integrates with specialized microservices for payment processing, notifications, and messaging to provide a comprehensive learning experience.

> 💡 **For Employers:** This project demonstrates production-level full-stack development combined with a complete DevOps pipeline including Infrastructure as Code, Docker containerization, and automated CI/CD deployment.

### 🎯 User Roles

| Role | Capabilities |
|------|-------------|
| 👨‍🎓 **Student** | Enroll in courses, watch lectures, take quizzes, track progress, earn certificates, send messages |
| 👨‍🏫 **Instructor** | Create and publish courses, build quiz assessments, manage curriculum, view analytics, issue certificates |
| 🛡️ **Admin** | Manage users, approve role upgrades, moderate content, view platform analytics, manage categories & tags |

---

## ✨ Features

### 📚 Learning Experience
- 🎥 **Video Lectures** — Stream course videos with a custom video player
- 📄 **Document Management** — Upload and view PDFs and learning resources
- 📊 **Progress Tracking** — Visual progress bars and completion statistics
- 🏆 **Certificates** — Auto-generated certificates on course completion
- ⭐ **Reviews & Ratings** — Students rate and review courses with replies and reactions

### 🧠 Quiz System
- ✏️ **Custom Quiz Builder** — Instructors create quizzes with multiple question types
- ⏱️ **Timed Assessments** — Countdown timer per quiz session
- 📈 **Quiz Analytics** — Detailed performance analytics per student and quiz
- 🔄 **Multiple Attempts** — Configurable attempt limits per assessment
- 📋 **Results Dashboard** — Instant feedback with correct/incorrect breakdowns

### 🔐 Authentication
- 📧 **Email/Password** — Secure login with bcryptjs hashing
- 🔑 **Google OAuth** — One-click sign in with Google
- 🔒 **JWT Sessions** — HTTP-only cookie-based secure sessions
- 🛡️ **Role-Based Access** — Middleware-protected routes per user role
- 🔑 **Password Reset** — Email-based reset flow via Gmail SMTP

### 💬 Real-Time Features
- 📬 **Inbox & Messaging** — Real-time messaging between students and instructors
- 🔔 **Live Notifications** — Server-Sent Events (SSE) for instant updates
- ⚡ **Socket.io** — WebSocket-powered bidirectional communication

### 🖼️ Media Management
- ☁️ **Cloudinary Integration** — Cloud-based image upload, storage, and CDN delivery
- 🖼️ **Profile Pictures** — Users upload and manage profile images
- 📸 **Course Thumbnails** — Instructor-uploaded course cover images
- 🔏 **Signed Uploads** — Server-generated signatures for secure direct uploads

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              RENDER (Docker Container — Node.js)                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Next.js 16 Server                       │   │
│  │                                                         │   │
│  │  ├── App Router (SSR + Static Pages)                    │   │
│  │  ├── Route Handlers (/api/* — 80+ endpoints)            │   │
│  │  ├── Middleware (JWT Auth Guards)                        │   │
│  │  ├── Server Components (Direct DB queries)              │   │
│  │  └── Socket.io (Real-time WebSocket)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEON PostgreSQL (Serverless)                       │
│              axio_prod database — 51 tables                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## � Related Microservices

AxioQuan integrates with specialized microservices to handle specific domain concerns. Each service is independently deployable and can be explored separately:

### 📦 Axio Payment Service
[![GitHub](https://img.shields.io/badge/GitHub-sancy1%2Faxio--payment-181717?style=for-the-badge&logo=github)](https://github.com/sancy1/axio-payment.git)
[![Java](https://img.shields.io/badge/Java-Spring_Boot-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://spring.io)
[![Payment](https://img.shields.io/badge/Payment-Processing-4CAF50?style=for-the-badge)](https://github.com/sancy1/axio-payment.git)

A payment processing service built with **Java Spring Boot** that enables students to make secure payments for paid courses. Handles payment gateway integration, transaction management, and payment history tracking.

**🔗 [View Repository →](https://github.com/sancy1/axio-payment.git)**

---

### 🔔 Axio Notification Service
[![GitHub](https://img.shields.io/badge/GitHub-sancy1%2Faxio--notification-181717?style=for-the-badge&logo=github)](https://github.com/sancy1/axio-notification.git)
[![.NET](https://img.shields.io/badge/.NET-ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com)
[![API](https://img.shields.io/badge/WebAPI-Core-9C27B0?style=for-the-badge)](https://github.com/sancy1/axio-notification.git)

A backend notification service built with **ASP.NET Web API Core** that manages the entire notification system for the AxioQuan platform. Ensures timely notifications for important actions such as payment confirmations, course registrations, and system alerts.

**🔗 [View Repository →](https://github.com/sancy1/axio-notification.git)**

---

### 💬 AxioQuan Message Service
[![GitHub](https://img.shields.io/badge/GitHub-sancy1%2Faxioquan--message-181717?style=for-the-badge&logo=github)](https://github.com/sancy1/axioquan-message.git)
[![TypeScript](https://img.shields.io/badge/TypeScript-Fastify-3178C6?style=for-the-badge&logo=typescript)](https://fastify.io)
[![Messaging](https://img.shields.io/badge/Messaging-Real--time-FF5722?style=for-the-badge)](https://github.com/sancy1/axioquan-message.git)

A real-time messaging service built with **Fastify + TypeScript** that enables communication between students and instructors. Supports direct messaging, group conversations, and real-time chat features for collaborative learning.

**🔗 [View Repository →](https://github.com/sancy1/axioquan-message.git)**

---

### 🌐 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      AxioQuan Next.js App                        │
│                   (Full-Stack Server + API Consumer)             │
└─────────────┬─────────────────────┬─────────────────────┬───────┘
              │                     │                     │
              ▼                     ▼                     ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│  Axio Payment     │   │ Axio Notification │   │ AxioQuan Message  │
│  (Java Spring)    │   │  (ASP.NET Core)   │   │  (Fastify + TS)   │
│                   │   │                   │   │                   │
│  • Payments       │   │  • Notifications   │   │  • Messaging      │
│  • Transactions   │   │  • Alerts         │   │  • Groups         │
│  • History        │   │  • Email/Push     │   │  • Real-time Chat │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

## �🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.0.7 | Full-stack React framework (App Router) |
| **React** | 19.2.0 | UI component library |
| **TypeScript** | ^5 | Type-safe JavaScript |
| **Tailwind CSS** | ^4.1.9 | Utility-first CSS framework |
| **Framer Motion** | ^12 | Animations and transitions |
| **Radix UI** | Various | Accessible headless UI components |
| **Recharts** | 2.15.4 | Data visualization and analytics charts |

### Backend (Next.js Route Handlers)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **@neondatabase/serverless** | ^1.0.2 | PostgreSQL WebSocket driver |
| **NextAuth.js** | Custom JWT | Authentication framework |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **Socket.io** | ^4.8.1 | Real-time WebSocket communication |
| **Nodemailer** | ^7.0.10 | Email delivery via SMTP |
| **Cloudinary** | ^2.8.0 | Media upload and CDN delivery |
| **Zod** | 3.25.76 | Schema validation |
| **Jose** | ^6.1.0 | JWT encoding/decoding |

### Database
| Technology | Details |
|-----------|---------|
| **PostgreSQL** | Hosted on Neon Serverless |
| **Neon** | Auto-scaling 0.25–2 CU, scales to zero |
| **Tables** | 51 production tables |
| **Driver** | WebSocket-based (@neondatabase/serverless) |

---

## ⚙️ DevOps Pipeline

> This project demonstrates a **complete senior-level DevOps pipeline** from infrastructure provisioning to automated deployment.

```
git push origin main
       │
       ▼
GitHub Actions (CI/CD)
       │
       ├── Setup Node.js 20 + pnpm
       ├── Cache dependencies
       ├── Install (pnpm install --frozen-lockfile)
       ├── Build (pnpm build)
       └── Trigger Render Deploy via REST API
                  │
                  ▼
           Render Platform
                  │
                  ├── Pull latest code from GitHub
                  ├── Docker Build (4-stage multi-stage)
                  │     ├── Stage 1: deps (pnpm install)
                  │     ├── Stage 2: builder (pnpm build)
                  │     ├── Stage 3: runner (local dev)
                  │     └── Stage 4: production (node server.js)
                  └── Deploy container with real env vars
                             │
                             ▼
                    Live at onrender.com
                             │
                             ▼
                    UptimeRobot pings /api/health
                    every 5 min → stays awake 24/7
```

### 🔧 DevOps Technologies

| Tool | Purpose |
|------|---------|
| **Terraform** | Infrastructure as Code — manages Neon DB + Render service |
| **Terraform Cloud** | Remote state storage, 29 encrypted variables |
| **Docker** | Multi-stage containerization (4 stages, node:20-alpine) |
| **GitHub Actions** | CI/CD pipeline — 3 workflows (dev/staging/prod) |
| **Render** | Cloud hosting — full Node.js runtime, Docker support |
| **UptimeRobot** | Uptime monitoring — pings `/api/health` every 5 minutes |
| **pnpm** | Fast, disk-efficient package manager |

---

## 🚀 Quick Start — Clone & Run

### Prerequisites

Make sure you have the following installed:

- **Node.js** >= 20.x → [Download](https://nodejs.org)
- **pnpm** >= 9.x → `npm install -g pnpm`
- **Docker** (optional but recommended) → [Download](https://docker.com)
- **Git** → [Download](https://git-scm.com)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sancy1/axioquan-cloudflare.git
cd axioquan-cloudflare
```

### Step 2 — Choose Your Setup Method

| Method | Best For | Difficulty |
|--------|----------|------------|
| 🐳 [Docker Setup](#-docker-setup-recommended) | Quick start, mirrors production | ⭐ Easy |
| 💻 [Local Dev (no Docker)](#-local-development-without-docker) | Direct development | ⭐⭐ Medium |

---

## 🐳 Docker Setup (Recommended)

> **Recommended for employers and visitors** — mirrors the exact production environment with a single command.

### Step 1 — Create Environment File

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your values (see [Environment Variables](#-environment-variables) section).

### Step 2 — Start with Docker Compose

```bash
docker-compose up --build
```

This will:
- 🔨 Build the Docker image using the multi-stage Dockerfile
- 📦 Install all dependencies inside the container
- 🔥 Start Next.js dev server with hot reload
- 🌐 Expose the app at `http://localhost:3000`

### Step 3 — Open the App

```
http://localhost:3000
```

### Useful Docker Commands

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild after dependency changes
docker-compose up --build

# Enter the running container
docker exec -it axioquan-dev sh
```

### Build Production Image Locally

```bash
# Build production image
docker build --target production -t axioquan:latest .

# Run production container
docker run -p 3000:10000 --env-file .env.local axioquan:latest
```

---

## 💻 Local Development (Without Docker)

### Step 1 — Install Dependencies

```bash
pnpm install
```

### Step 2 — Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all required values in `.env.local` (see below).

### Step 3 — Start Development Server

```bash
pnpm dev
```

App will be available at: `http://localhost:3000`

### Other Available Commands

```bash
# Production build
pnpm build

# Start production server (after build)
pnpm start

# Lint code
pnpm lint
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ── Database (Neon PostgreSQL) ────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# ── Authentication ────────────────────────────────────────────────────────────
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# ── Google OAuth ──────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ── Cloudinary (Media Uploads) ────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ── Email (Gmail SMTP) ────────────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=YourApp <your-email@gmail.com>

# ── Admin Registration ────────────────────────────────────────────────────────
NEXT_PUBLIC_ADMIN_REGISTRATION_KEY=your-secret-admin-key
```

### 📋 How to Get Each Value

<details>
<summary><b>📦 DATABASE_URL — Neon PostgreSQL</b></summary>

1. Go to [https://neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. It will look like: `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`

</details>

<details>
<summary><b>🔑 NEXTAUTH_SECRET — Generate Secure Secret</b></summary>

Run this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

</details>

<details>
<summary><b>🔑 Google OAuth Credentials</b></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.onrender.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret

</details>

<details>
<summary><b>☁️ Cloudinary Setup</b></summary>

1. Go to [https://cloudinary.com](https://cloudinary.com) and create a free account
2. Go to your **Dashboard**
3. Copy **Cloud Name**, **API Key**, and **API Secret**

</details>

<details>
<summary><b>📧 Gmail SMTP App Password</b></summary>

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Search for **App Passwords**
4. Create a new App Password for **Mail**
5. Use the generated 16-character password as `SMTP_PASSWORD`
6. ⚠️ Never use your main Gmail password here

</details>

---

## 🏗️ Infrastructure Setup (Terraform)

> This section is for DevOps engineers who want to provision the cloud infrastructure from scratch using Terraform.

### Prerequisites

- **Terraform** >= 1.5.0 → [Download](https://terraform.io/downloads)
- **Terraform Cloud account** → [Sign up](https://app.terraform.io)
- **Render account** → [Sign up](https://render.com)
- **Neon account** → [Sign up](https://neon.tech)

### Step 1 — Configure Terraform Cloud Backend

```bash
cd infrastructure/environments/dev
```

Edit `backend.tf` with your Terraform Cloud organization and workspace name.

### Step 2 — Set Up Variables

```bash
cp terraform.tfvars.example terraform.tfvars
```

Fill in all values in `terraform.tfvars`.

### Step 3 — Install Providers

```bash
terraform init
```

> ⚠️ **Note:** If your network blocks `registry.terraform.io`, download providers manually from GitHub releases and place them in `%APPDATA%\terraform.d\plugins\` (Windows) or `~/.terraform.d/plugins/` (Mac/Linux).

### Step 4 — Deploy Infrastructure

```bash
# Preview changes
terraform plan

# Apply changes
terraform apply
```

This creates:
- ✅ Neon PostgreSQL project and database
- ✅ Render web service with all environment variables
- ✅ All infrastructure managed as code

### Module Structure

```
infrastructure/
├── environments/
│   ├── dev/          ← Development environment
│   ├── staging/      ← Staging environment
│   └── prod/         ← Production environment
└── modules/
    ├── neon/         ← Database infrastructure
    └── render/       ← Hosting infrastructure
```

---

## 📦 Deployment

### Automatic Deployment (CI/CD)

Every push to the `main` branch automatically deploys via GitHub Actions:

```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions triggers → Render rebuilds and deploys automatically
```

### Branch → Environment Mapping

| Branch | Environment | URL |
|--------|------------|-----|
| `main` | Development | axio-prod-dev.onrender.com |
| `staging` | Staging | axio-prod-staging.onrender.com |
| `prod` | Production | axio-prod-prod.onrender.com |

### Manual Deploy on Render

```
Render Dashboard → axio_prod-dev → Manual Deploy → Deploy latest commit
```

---

## 📁 Project Structure

```
axioquan-cloudflare/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth pages (login, signup, etc.)
│   │   ├── api/                      # 80+ API Route Handlers
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── courses/              # Course management
│   │   │   ├── assessments/          # Quiz system
│   │   │   ├── health/               # Uptime monitoring endpoint
│   │   │   └── ...                   # More API routes
│   │   ├── dashboard/                # Role-based dashboards
│   │   │   ├── admin/                # Admin panel
│   │   │   ├── instructor/           # Instructor tools
│   │   │   └── ...                   # Student dashboard
│   │   ├── courses/                  # Course pages
│   │   └── layout.tsx                # Root layout
│   └── components/                   # Reusable React components
│       ├── ui/                       # Base UI components (Radix)
│       ├── dashboard/                # Dashboard components
│       ├── courses/                  # Course components
│       └── ...
├── lib/                              # Shared utilities
│   ├── db/                           # Database connection + queries
│   │   ├── index.ts                  # Neon connection
│   │   └── queries/                  # SQL query functions
│   ├── auth/                         # Auth utilities
│   ├── email/                        # Email templates
│   └── ...
├── infrastructure/                   # Terraform IaC
│   ├── environments/dev/             # Dev environment config
│   └── modules/                      # Reusable Terraform modules
├── public/                           # Static assets
├── Dockerfile                        # Multi-stage Docker build
├── docker-compose.yml                # Local development
├── next.config.mjs                   # Next.js configuration
└── .github/workflows/                # GitHub Actions CI/CD
    ├── deploy-dev.yml
    ├── deploy-staging.yml
    └── deploy-prod.yml
```

---

## 🌐 Live Demo

> ⚡ The live demo is hosted on Render's free tier. If it takes a moment to load, it may be waking up from sleep — please wait 10-15 seconds.

**🔗 [https://axio-prod-dev.onrender.com](https://axio-prod-dev.onrender.com)**

### Demo Accounts

You can register a new account or use these test credentials:

| Role | How to Access |
|------|--------------|
| 👨‍🎓 Student | Register a new account at `/signup` |
| 👨‍🏫 Instructor | Register then request a role upgrade from dashboard |
| 🛡️ Admin | Register using the admin key at `/admin-signup` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/axioquan-cloudflare.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Commit with a clear message
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by [Sanchez Alexander](https://github.com/sancy1)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/sancy1)

---

*AxioQuan — The future of education starts here* 🎓

</div>
