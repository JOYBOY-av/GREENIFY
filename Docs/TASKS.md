## Build Order

Follow this exactly. Do not skip ahead.

### Phase 1: Backend Foundation (Days 1–2)
1. Set up Express app with folder structure
2. Connect to PostgreSQL, run schema SQL
3. Seed action types and badges
4. Build `/auth/register` and `/auth/login` with bcrypt + JWT
5. Build JWT middleware for protected routes
6. Test all auth routes in Postman ✅

### Phase 2: Core Backend Logic (Days 3–4)
7. Build `GET /actions/types`
8. Build `POST /actions` — log action, calculate points, check badge criteria
9. Build `GET /actions/my`
10. Build `GET /dashboard` — aggregate query for points, streak, recent actions, badges
11. Build `GET /leaderboard/weekly` and `/alltime`
12. Test everything in Postman ✅

### Phase 3: Frontend Skeleton (Days 5–6)
13. Create Vite React app, install Tailwind, Router, Axios
14. Build `AuthContext` with login/logout/token
15. Build `ProtectedRoute`
16. Build `Navbar`
17. Build Login + Register pages — wire up to API
18. Confirm auth flow works end to end ✅

### Phase 4: Frontend Features (Days 7–9)
19. Build Dashboard page — stats, recent actions, badges
20. Build Log Action page — pick action, add note, submit
21. Build Leaderboard page — weekly/all-time tabs
22. Build Profile page — user info + all badges
23. Add toast notification on badge earned ✅

### Phase 5: Polish (Days 10–12)
24. Make it fully responsive (mobile-friendly)
25. Add loading states and error messages everywhere
26. Style the Landing page to look real and professional
27. Handle edge cases: empty state, no badges yet, etc.
28. Write a clean README with screenshots and setup steps ✅

### Phase 6: Deploy (Days 13–14)
29. Deploy backend to **Render** (free tier, easy Node/Express deploy)
30. Deploy frontend to **Vercel** (free, auto-deploy from GitHub)
31. Set environment variables on both platforms
32. Test full flow on production URL ✅

---

## Common Pitfalls to Avoid

### Backend
- **Don't store plain-text passwords.** Always use bcrypt. Always.
- **Don't forget CORS.** Without it, your frontend will get blocked by the browser.
- **Don't skip `.env`.** Never hardcode DB URLs or JWT secrets in code.
- **Don't forget `ON DELETE CASCADE`** on foreign keys, or orphan rows will break queries.
- **Don't overcomplicate badge logic.** Check badge criteria after every action log — a simple if-statement is fine.
- **Weekly leaderboard:** Filter with `logged_at >= date_trunc('week', NOW())` in SQL. Don't try to do this in JavaScript.

### Frontend
- **Don't forget to attach the JWT to every protected request.** Set it in your Axios instance default headers once — not on every call.
- **Don't navigate to dashboard before checking if token is valid.** Validate on app load.
- **Don't use `useEffect` to fetch on every re-render.** Use dependency arrays properly.
- **Don't hardcode the API base URL.** Use an `.env` variable (`VITE_API_URL`).

### General
- **Don't build non-MVP features until core works.** Feature creep is the #1 reason solo projects fail.
- **Don't skip Postman testing.** Test every endpoint before writing frontend code for it.
- **Commit to GitHub every day.** It shows your work history and protects you.
- **Don't make the UI look like a tutorial.** Use real colors, icons, and spacing. TailwindCSS makes this easy.

---

## Implementation Checklist (In Order)

### Backend Setup
- [ ] `npm init` → install express, pg, bcrypt, jsonwebtoken, dotenv, cors, nodemon
- [ ] Create folder structure: `routes/`, `controllers/`, `middleware/`, `db/`
- [ ] Connect to PostgreSQL in `db/index.js`
- [ ] Run schema SQL, seed action_types and badges
- [ ] Create `middleware/auth.js` — verify JWT middleware

### Auth API
- [ ] `POST /api/auth/register` — hash password, insert user, return token
- [ ] `POST /api/auth/login` — compare hash, return token
- [ ] `GET /api/auth/me` — protected, return user info
- [ ] Test all three in Postman

### Actions API
- [ ] `GET /api/actions/types` — return all seeded action types
- [ ] `POST /api/actions` — insert action, sum points, check + award badges
- [ ] `GET /api/actions/my` — return last 10 actions for current user

### Dashboard & Leaderboard API
- [ ] `GET /api/dashboard` — total points, streak, recent actions, badges
- [ ] `GET /api/leaderboard/weekly` — SUM points grouped by user for current week
- [ ] `GET /api/leaderboard/alltime` — SUM all-time points grouped by user
- [ ] `GET /api/badges/my` — return earned badges for user

### Frontend Setup
- [ ] `npm create vite@latest greenify-frontend -- --template react`
- [ ] Install: `tailwindcss`, `react-router-dom`, `axios`, `react-hot-toast`
- [ ] Configure Tailwind in `tailwind.config.js` and `index.css`
- [ ] Create `src/api/axios.js` with base URL + token interceptor
- [ ] Create `AuthContext` — stores user, token; exposes login/logout

### Frontend Pages
- [ ] `Landing.jsx` — hero section, features, CTA buttons
- [ ] `Register.jsx` — form → POST /auth/register → store token → redirect dashboard
- [ ] `Login.jsx` — form → POST /auth/login → store token → redirect dashboard
- [ ] `ProtectedRoute.jsx` — redirect to /login if no token
- [ ] `Dashboard.jsx` — fetch /dashboard → render StatCards, RecentActions, BadgeGrid
- [ ] `LogAction.jsx` — fetch action types → card grid picker → POST /actions → toast on badge
- [ ] `Leaderboard.jsx` — tabs for weekly/alltime → LeaderboardTable component
- [ ] `Profile.jsx` — show user info + all earned badges

### Polish
- [ ] Add loading spinners on all data-fetching pages
- [ ] Add empty state UI ("No actions yet — log your first one!")
- [ ] Make every page mobile responsive
- [ ] Add proper error messages for failed API calls
- [ ] Write README.md with screenshots, tech stack, setup steps, live link

### Deployment
- [ ] Push to GitHub (public repo)
- [ ] Deploy backend to Render — add environment variables
- [ ] Deploy frontend to Vercel — set `VITE_API_URL` to your Render backend URL
- [ ] Test register → login → log action → see leaderboard on the live URL
- [ ] Add the live link to your resume and GitHub profile

---