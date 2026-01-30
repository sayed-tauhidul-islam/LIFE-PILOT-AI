# Database Documentation

This folder contains MongoDB database initialization scripts and schema definitions for the Life Pilot AI Agent.

## Files

- `mongodb_init.js` - MongoDB initialization script to create database and collections
- `schemas.py` - Python schema definitions and validation functions
- `seed_data.js` - Sample data for testing (optional)

## Setup MongoDB Database

### Method 1: Using MongoDB Shell (mongosh)

1. Make sure MongoDB is running
2. Run the initialization script:

```bash
mongosh < mongodb_init.js
```

### Method 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your MongoDB instance (default: `mongodb://localhost:27017`)
3. Create a new database called `lifepilot_ai`
4. The collections will be created automatically by the application

### Method 3: Using Python Script

Run the Python application - it will create collections automatically on first use.

## Database Structure

### Collections

1. **users** - User profiles and preferences
   - Stores user information, income, family size, location, and preferences
   - Unique email index for authentication

2. **routines** - Daily routines for different user types
   - Student, professional, and family routines
   - Contains schedules and tips

3. **meetings** - Meetings and important events
   - User meetings with date, time, and location
   - Supports reminders

4. **expenses** - Financial tracking
   - User expenses categorized by type
   - Tracks payment methods

5. **tasks** - Daily tasks and to-dos
   - Tasks with priorities and status
   - Supports task completion tracking

6. **prayer_times** - Prayer times for users
   - Daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha)
   - Location-based timing

## Indexes

The following indexes are created for optimal query performance:

- Users: email (unique), created_at
- Routines: user_id, user_id + active
- Meetings: user_id + date, date
- Expenses: user_id + date, user_id + category
- Tasks: user_id + date, user_id + status, user_id + priority
- Prayer Times: user_id + date

## Connection String

Default local MongoDB:

```
mongodb://localhost:27017/lifepilot_ai
```

For MongoDB Atlas (cloud), update the connection string in `backend/.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifepilot_ai
```

## Schema Validation

All collections have JSON schema validation enabled to ensure data integrity. The schemas enforce:

- Required fields
- Data types
- Value ranges (e.g., age between 1-150)
- Enum values (e.g., task priority: low/medium/high)

## Querying Examples

```javascript
// Find user by email
db.users.findOne({ email: "user@example.com" });

// Get user's meetings for today
db.meetings
  .find({
    user_id: "user_id_here",
    date: "2026-01-25",
  })
  .sort({ time: 1 });

// Get user's expenses for current month
db.expenses.find({
  user_id: "user_id_here",
  date: { $gte: "2026-01-01", $lte: "2026-01-31" },
});

// Get user's active routine
db.routines.findOne({
  user_id: "user_id_here",
  active: true,
});
```
