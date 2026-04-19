# 🌿 Greenify — Product Requirements Document (PRD)
**Version:** 1.0 | **Author:** Solo Dev | **Timeline:** 7–14 days

---

## 🎯 One-Line Product Pitch

> **Greenify turns everyday eco-friendly habits into a competitive game — log your green actions, earn points, climb the leaderboard, and prove that sustainability can be fun.**

---

## 🎬 30-Second Demo Script

> "Hey! This is Greenify — a gamified sustainability tracker built for college students.
> 
> I log in here, and my dashboard shows my total green points, recent actions, and the badges I've earned.
> 
> Watch — I click 'Log Action', select 'Recycled Waste', and boom — 10 points added instantly. Hit 50 actions and I unlock the 'Eco Warrior' badge.
> 
> Over here on the Leaderboard, I can see the top students this week and all-time — a little friendly competition never hurt the planet.
> 
> The whole app is built with React, Node/Express, and PostgreSQL — clean REST API, JWT auth, and fully responsive. It's simple, real, and something I'm genuinely proud to ship."

---

## 1. Product Overview

Greenify is a web application that motivates college students to adopt sustainable habits by gamifying everyday eco-actions. Students log activities like recycling, biking to college, or turning off lights. Each action earns points. Points unlock badges. Rankings create social competition.

**Target Users:** College students aged 18–24
**Core Problem:** Sustainability feels abstract and unrewarding. Greenify makes it tangible and fun.
**Key Value:** Visual progress + social pressure + instant rewards = habit formation.

---

## 2. MVP Scope (Build This)

These are the only features you should build in 7–14 days.

### 2.1 Auth System
- User registration (name, email, college, password)
- Login / Logout
- JWT-based session (token stored in localStorage)
- Protected routes on frontend

### 2.2 Eco-Action Logging
- Log an action from a fixed list of categories
- Add an optional short note (e.g., "biked 5 km to campus")
- Instant point calculation on submission
- View last 10 actions on dashboard

### 2.3 Points & Badges
- Auto-calculate points per action type
- Award badges based on milestones (first action, 10 actions, 50 points, etc.)
- Show earned badges on the dashboard

### 2.4 Dashboard
- Total points
- Current streak (consecutive days with at least 1 action)
- Recent 5 actions with timestamps
- Earned badges grid

### 2.5 Leaderboard
- Weekly ranking (reset every Monday)
- All-time ranking
- Show rank, name, college, and points

---

## 3. Non-MVP Features (Do NOT Build Now)

| Feature | Why Skip It |
|---|---|
| Social feed / comments | Too complex, not core |
| Push / email notifications | Infra overhead |
| Photo uploads for actions | Storage/hosting headache |
| Team challenges | Multi-user logic complexity |
| Carbon footprint calculator | Data-heavy, not differentiating |
| OAuth (Google login) | Auth complexity — JWT is enough |
| Mobile app | Out of scope |
| Admin panel | Not needed for demo |
| AI-generated tips | Nice-to-have, not core |
| Friends/follow system | Social graph = big scope |

> **Rule:** If it doesn't fit in 2 days, it's not MVP.

---
