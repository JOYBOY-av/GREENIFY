## REST API Endpoints

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| GET | `/auth/me` | ✅ | Get current user info |

### Actions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/actions/types` | ✅ | Get all action types |
| POST | `/actions` | ✅ | Log a new action |
| GET | `/actions/my` | ✅ | Get my recent actions (last 10) |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | ✅ | Total points, streak, recent actions, badges |

### Leaderboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard/weekly` | ✅ | Top 20 users this week |
| GET | `/leaderboard/alltime` | ✅ | Top 20 users all time |

### Badges

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/badges/my` | ✅ | Get all badges earned by current user |

---

### Sample Request/Response

**POST /api/actions**
```json
// Request Body
{
  "action_type_id": 1,
  "note": "Recycled paper and plastic at the dorm"
}

// Response 201
{
  "message": "Action logged!",
  "points_earned": 10,
  "total_points": 85,
  "new_badge": {
    "name": "Eco Starter",
    "icon": "🌱"
  }
}
```

**GET /api/dashboard**
```json
{
  "user": { "name": "Aryan", "college": "IIT Delhi" },
  "total_points": 145,
  "streak": 4,
  "rank": { "weekly": 3, "alltime": 12 },
  "recent_actions": [...],
  "badges": [...]
}
```

---
