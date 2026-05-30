# 🌌 Text Humanizer — AI Document Humanizer SaaS Platform

An ultra-premium, production-ready SaaS platform that humanizes AI-generated text while preserving original document layouts, formatting, and structures. Inspired by Vercel, Linear, and ChatGPT design aesthetics.

## ✨ Features

- **Format-Preserving Humanization**: Intelligently humanizes AI text blocks inside DOCX, PDF, and TXT files without destroying headings, lists, tables, font styles, or line spacing.
- **Sleek, Futuristic UI**: Designed with a high-end dark theme (`#030303`), featuring purple/blue glowing ambient light grids, custom glassmorphism panels, and smooth micro-animations.
- **Interactive Workspace**: Side-by-side comparison editor showing AI text vs. humanized text with real-time editing, readability metrics, and dynamic preview.
- **Robust User Authentication**: Server-side registration and login using SHA-256 hashed credentials stored in a SQLite database via Prisma ORM.
- **Credit System**: Starts each user with 1,000 initial credits, deducting credits dynamically based on the number of words processed.
- **Document History & Logs**: Complete dashboard logs tracking past humanization operations, layout blocks, word counts, and original filenames.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React & Custom Inline SVGs

### Backend & Database
- **API Engine**: Next.js Server-Side Route Handlers
- **Database ORM**: Prisma 5.22.0
- **Database**: SQLite (local serverless storage)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+ recommended) and `npm` installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Database Sync & Initial setup
Initialize the SQLite database and sync the Prisma schema:
```bash
npx prisma db push
```

### 4. Run the Development Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## 📁 Repository Structure

- `src/app/` — Next.js 15 routing, layout, and core page logic.
- `src/components/` — Modular components including the Workspace, Dashboard, UploadZone, AuthModal, Hero, Features, Pricing, and Testimonials.
- `src/lib/` — Database clients and shared helper singletons (Prisma client config).
- `prisma/` — SQLite database schema definitions and migrations.

## 📄 License
This project is private and proprietary. All rights reserved.
