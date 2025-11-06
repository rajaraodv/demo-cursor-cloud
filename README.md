# Modern Todo List App

A beautiful, modern todo list application built with React and Vite, powered by Tiger Cloud (TimescaleDB).

## Features

- ✨ Modern, sleek UI with dark theme
- ✅ Add, complete, and delete todos
- 💾 Persistent storage in Tiger Cloud database
- 🚀 Fast and responsive
- 📱 Mobile-friendly design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the root directory with your configuration:
   ```bash
   # Required: Database connection string
   DATABASE_URL=postgresql://tsdbadmin:your_password@your_host:port/tsdb?sslmode=require
   
   # Optional: Server port (defaults to 3001)
   PORT=3001
   
   # Optional: For cloud deployments
   # Frontend URL for CORS (defaults to http://localhost:3000)
   FRONTEND_URL=http://localhost:3000
   
   # Optional: For Vite development proxy
   # VITE_BACKEND_URL=http://localhost:3001
   # VITE_PORT=3000
   
   # Optional: For cloud/production deployments
   # Set to full backend URL when frontend and backend are on different hosts
   # VITE_API_URL=https://api.example.com
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both:
   - Frontend server on `http://localhost:3000` (or port specified by `VITE_PORT`)
   - Backend API server on `http://localhost:3001` (or port specified by `PORT`)

## Environment Variables

### Required
- **`DATABASE_URL`** - PostgreSQL connection string for Tiger Cloud/TimescaleDB

### Optional (Backend)
- **`PORT`** - Backend server port (default: `3001`)
- **`FRONTEND_URL`** or **`CORS_ORIGIN`** - Frontend URL for CORS configuration (default: `http://localhost:3000`)

### Optional (Frontend - Vite)
- **`VITE_PORT`** - Frontend server port (default: `3000`)
- **`VITE_BACKEND_URL`** - Backend URL for Vite proxy in development (default: `http://localhost:3001`)
- **`VITE_API_URL`** - Full backend API URL for cloud/production deployments. Leave empty for development (uses relative paths with Vite proxy). Set to full URL (e.g., `https://api.example.com`) when frontend and backend are on different hosts.

### Cloud Deployment

For cloud deployments where frontend and backend are on different hosts:

1. Set `VITE_API_URL` to your backend URL (e.g., `https://api.yourdomain.com`)
2. Set `FRONTEND_URL` or `CORS_ORIGIN` to your frontend URL (e.g., `https://yourdomain.com`)
3. Ensure `DATABASE_URL` is set with your cloud database connection string
4. Set `PORT` if your cloud platform requires a specific port

## Database

The app uses a Tiger Cloud TimescaleDB instance. The database schema is automatically created when the server starts:

- **Table:** `todos`
- **Columns:**
  - `id` (SERIAL PRIMARY KEY)
  - `text` (TEXT)
  - `completed` (BOOLEAN)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express
- **Database:** Tiger Cloud (TimescaleDB/PostgreSQL)
- **Styling:** Modern CSS with CSS Variables

## Project Structure

```
.
├── server/
│   └── index.js          # Express API server
├── src/
│   ├── App.jsx           # Main React component
│   ├── App.css           # Component styles
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

