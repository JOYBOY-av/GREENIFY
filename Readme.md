# Greenify

Greenify is an immersive web application designed to help people track their eco-friendly actions and stay motivated to live more sustainably. By turning everyday green habits into a rewarding, gamified experience, we aim to make sustainability a seamless part of daily life.

## 🔗 Live Links

- **Frontend**: [https://greenify-theta.vercel.app](https://greenify-theta.vercel.app)
- **Backend API**: [https://greenify-alhp.onrender.com](https://greenify-alhp.onrender.com)


## Why I Built This

Many of us want to contribute to the environment but often feel that our small actions don't make a significant impact, or we simply don't know where to start. I built **Greenify** to make sustainability more approachable, visible, and—most importantly—fun.

Instead of just reading about climate change, users can actively log their contributions and visualize their personal impact over time.

---

## Features

### 1. Smart Eco-Action Logging
Users can log standard actions like recycling, saving water, or using public transport.
- **AI-Powered Analysis**: The "Other Action" feature uses the **Google Gemini API** to evaluate custom user descriptions. It determines if an action is eco-friendly, assesses its impact, and assigns points dynamically.

### 2. Points and Rewards
Every green act counts. Actions earn points based on their effort and environmental impact.
- **Badge System**: Users unlock unique badges as they reach milestones, turning sustainable living into a rewarding progression.

### 3. Community Leaderboard
Compare progress with friends and the community. This adds a healthy competitive edge and fosters a sense of collective impact.

### 4. Personal Dashboard
A centralized hub to:
- Monitor total points earned.
- Track recent activity and trends.
- View a quick overview of your sustainability journey.

### 5. Immersive Landing Page
Experience a nature-inspired "scrollytelling" journey with leaf and vine animations, designed to match the theme of sustainability from the very first click.

---

## Tech Stack

### Frontend
- **React 19** & **Vite** (Fast, modern framework)
- **Tailwind CSS** (Polished UI components)
- **Framer Motion** (Smooth, nature-inspired animations)

### Backend
- **Node.js** & **Express**
- **PostgreSQL** (Relational data for users and actions)

### Core Integrations
- **Google Gemini API** (AI-based action evaluation)
- **JWT** (Secure authentication)
- **Nodemailer** (OTP and password reset flows)

---

## How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/JOYBOY-av/GREENIFY.git
cd GREENIFY
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=5001
DATABASE_URL=postgres://username:password@localhost:5432/greenify
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Initialize and run:
```bash
npm run init-db
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

Run:
```bash
npm run dev
```

---

## Deployment

Greenify is optimized for the following production environments:

- **Frontend (Vercel)**:
    - **URL**: `https://greenify-theta.vercel.app`
    - **Environment Variables**: Set `VITE_API_URL` to `https://greenify-alhp.onrender.com/api`.
- **Backend (Render)**:
    - **URL**: `https://greenify-alhp.onrender.com`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Environment Variables**: Set `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`.
- **Database (Supabase)**:
    - Use the **Free Tier** project.
    - Copy the **Connection String** (Transaction mode) and set it as `DATABASE_URL` in Render.

---

## Step-by-Step Deployment Guide

### 1. Database Setup (Supabase)
1. Create a new project on **Supabase**.
2. Go to the **SQL Editor** in the Supabase dashboard.
3. Copy the contents of `Backend/db/schema.sql` and run it. This creates your tables and seeds initial data.
4. Go to **Project Settings > Database** and copy the **URI** (Connection String).

### 2. Backend Deployment (Render)
1. Log in to **Render** and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `Backend`.
4. Set the **Build Command** to `npm install` and **Start Command** to `node server.js`.
5. In the **Environment** tab, add all variables from your local `.env`:
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET`: A long random string.
   - `GEMINI_API_KEY`: Your Google AI key.
   - `EMAIL_USER` & `EMAIL_PASS`: For email features.
6. Once deployed, copy your service URL (e.g., `https://greenify-api.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Log in to **Vercel** and click **Add New > Project**.
2. Connect your GitHub repository.
3. Vercel should automatically detect the Vite project.
4. Set the **Root Directory** to `Frontend`.
5. In the **Environment Variables** section, add:
   - `VITE_API_URL`: `https://your-render-url.onrender.com/api`
6. Click **Deploy**.

> [!IMPORTANT]
> Always ensure that the `VITE_API_URL` in Vercel includes the `/api` suffix and matches your live Render URL.

---

## Future Improvements

I’m constantly looking for ways to grow this project. Some planned updates include:
- **Enhanced AI Scoring**: Refining the logic for more accurate impact assessments.
- **Deep Analytics**: Providing users with data on carbon impact and long-term sustainability trends.
- **Community Features**: Introducing groups and college-level competitions to drive collective action.
- **Mobile Optimization**: Further improving responsiveness for a seamless mobile experience.

---

## Final Note

This project is a work in progress, but the goal remains simple: **Make sustainability easier to start and easier to stick with.**

If you have suggestions, ideas, or want to contribute, feel free to open a PR or get in touch. Let's build a greener future together!