# PrepEdge AI - AI-Powered Interview Preparation

PrepEdge AI is a sophisticated, cinematic interview preparation platform designed to help developers ace their technical interviews. By leveraging the power of Groq and Llama 3 LLMs, it generates hyper-relevant, company-targeted interview questions and model answers in real-time.

![PrepEdge AI Banner](https://img.shields.io/badge/PrepEdge--AI-Cinematic--Prep-7c3aed?style=for-the-badge)

## 🚀 Features

- **AI-Powered Generation**: Get fresh, non-stale interview questions generated specifically for your tech stack.
- **Company Targeted**: Input target companies (Google, Amazon, Meta, etc.) to align questions with their specific interview styles.
- **Multi-Topic Support**: Prep for up to 3 topics simultaneously (e.g., React, System Design, and DSA).
- **Important Bank**: Save challenging questions to your personal "Important Bank" for later review.
- **Cinematic Experience**: A high-end, magazine-style UI with smooth animations and theme-aware design.
- **Fully Responsive**: Optimized for everything from 4K monitors to mobile devices.

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite**
- **Framer Motion** (Animations)
- **Lucide React** (Iconography)
- **Vanilla CSS** (Custom Design System)
- **Context API** (State Management)

### Backend
- **Spring Boot 3** (Java 17)
- **Groq AI SDK** (LLM Integration - Llama 3.1)
- **Spring Security** with **JWT**
- **PostgreSQL** (Data Persistence)
- **Maven** (Dependency Management)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Java 17+
- PostgreSQL
- Groq API Key

### Backend Setup
1. Navigate to the root directory.
2. Update `src/main/resources/application.properties` with your database credentials and Groq API key.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy
PrepEdge AI follows a "Cinematic Magazine" aesthetic. It uses a clean, high-contrast palette (Black/White/Gray) with **Neon Purple (#7c3aed)** as the signature brand color for logos and primary highlights. The typography uses **Cinzel Decorative** for headings to give it a premium, editorial feel.

## 📄 License
This project is for portfolio purposes. All rights reserved.

---
Built with 💜 by [Shantanu Kale](https://github.com/Shantanux0)
