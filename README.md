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

2. **Create a `.env` file** in the root directory with your database connection string:
   ```
   DATABASE_URL=postgresql://tsdbadmin:qrjmfs2b90cleq17@wa7obvl2n2.hles2ca4w9.tsdb.cloud.timescale.com:35097/tsdb?sslmode=require
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both:
   - Frontend server on `http://localhost:3000`
   - Backend API server on `http://localhost:3001`

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

