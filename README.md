# 📇 ContactVault - Modern MERN Contact Manager

ContactVault is a sleek, professional-grade MERN stack application designed for seamless contact management with a heavy focus on **High-End UX**, **Security**, and **Fluid Animations**.

## ✨ Pro Features

- **🔐 Robust Security**: 
    - JWT-protected private routes.
    - Password hashing via Bcrypt.
    - **Strong Password Policy**: Enforces 8+ characters and special symbols for account safety.
- **✨ Next-Level Aesthetic**:
    - **Glassmorphism Design**: High-end blur effects with grain textures.
    - **Dynamic Backgrounds**: Floating animated blobs for depth and life.
    - **Spring Physics**: Organic, bouncy animations using Framer Motion.
- **📁 Smart Contact Management**:
    - **Private Ownership**: Contacts are exclusively visible to the user who created them.
    - **Favorites Section**: Dedicated tab to instantly find your most important connections.
    - **Auto Country Code Detection**: Automatically detects country names (India, USA, UK, etc.) and prefixes phone numbers with the correct international code.
- **🚀 Production Ready**:
    - Unified build system for easy deployment.
    - Comprehensive error handling and unified logging.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, Axios, Lucide-React, Pure Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Tokens (JWT).

## 📦 Installation & Setup

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) and a MongoDB instance (or Atlas) ready.

### 2. Configure Environment
Create a `.env` file in the root:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Quick Run
To start both backend and frontend simultaneously with a single command:
```bash
npm install
npm run dev
```

## 📜 Key UI Micro-interactions
- **Layout Morphing**: List items slide into place when filtered or deleted using `Layout` animations.
- **Star Toggle**: Smooth fill-stagger animation when marking favorites.
- **Input Glows**: Interactive glass focus states for better accessibility.

---
Built with 💜 for a premium development experience.
