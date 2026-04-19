## Tech Stack

### Frontend
| Tool | Reason |
|---|---|
| React (Vite) | You already know it; Vite is fast |
| React Router v6 | Clean page routing |
| Axios | Cleaner than fetch for API calls |
| TailwindCSS | Fast, polished UI without writing lots of CSS |
| React Hot Toast | Beautiful toast notifications for badge unlocks |

### Backend
| Tool | Reason |
|---|---|
| Node.js + Express | Simple, you'll find tons of help online |
| PostgreSQL | Relational data fits perfectly; structured + clean |
| `pg` (node-postgres) | Lightweight DB driver — no ORM overhead |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth |
| dotenv | Environment variables |
| cors | Allow frontend to call backend |

### Dev Tools
| Tool | Reason |
|---|---|
| Postman or Insomnia | Test your API before hooking up the frontend |
| pgAdmin or TablePlus | Visualize your PostgreSQL tables |
| Nodemon | Auto-restart server on change |
| Git + GitHub | Version control; shows in your resume |

> **Do NOT use:** Next.js (overkill), TypeScript (not needed for MVP), GraphQL (rest is simpler), Redux (Context is enough), Prisma/TypeORM (adds abstraction you don't need yet)

---
## Folder Structure Reference

```
greenify/
├── backend/
│   ├── db/
│   │   └── index.js           ← PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js            ← JWT verification
│   ├── routes/
│   │   ├── auth.js
│   │   ├── actions.js
│   │   ├── dashboard.js
│   │   ├── leaderboard.js
│   │   └── badges.js
│   ├── controllers/           ← business logic (optional but clean)
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    ├── .env
    └── package.json
```

---

## Interview Talking Points

When asked about Greenify, lead with these:

1. **"I built a full-stack app end to end"** — auth, REST API, relational DB, React frontend.
2. **"I used JWT authentication"** — you understand tokens, hashing, and stateless auth.
3. **"I designed a normalized PostgreSQL schema"** — foreign keys, joins, aggregation queries.
4. **"I deployed it"** — Render + Vercel, environment config, production vs development.
5. **"I made deliberate scope decisions"** — you'll explain what you cut and why. This shows maturity.

> Tip: Push to GitHub daily. Interviewers look at commit history to see how you actually work.

---

*Built with React · Node/Express · PostgreSQL · TailwindCSS*
*Greenify — Making sustainability stick, one point at a time. 🌿*
