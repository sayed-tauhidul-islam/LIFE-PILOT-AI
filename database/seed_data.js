// Sample data for testing - Life Pilot AI Agent
// Run this after mongodb_init.js to populate with test data
// Usage: mongosh < seed_data.js

use lifepilot_ai;

// Sample User
const sampleUser = {
  name: "John Doe",
  age: 30,
  email: "john.doe@example.com",
  monthlyIncome: 5000.00,
  familySize: 4,
  location: {
    city: "New York",
    country: "USA",
    latitude: 40.7128,
    longitude: -74.0060
  },
  preferences: {
    theme: "light",
    language: "en",
    prayerNotifications: true
  },
  created_at: new Date(),
  updated_at: new Date()
};

const userResult = db.users.insertOne(sampleUser);
const userId = userResult.insertedId.toString();

print("Sample user created with ID: " + userId);

// Sample Routine
const sampleRoutine = {
  user_id: userId,
  type: "professional",
  title: "Professional Excellence Routine",
  schedule: [
    { time: "06:30 AM", activity: "Morning exercise" },
    { time: "07:30 AM", activity: "Breakfast and planning" },
    { time: "09:00 AM", activity: "Most important task" },
    { time: "12:30 PM", activity: "Lunch break" },
    { time: "02:00 PM", activity: "Deep work session" },
    { time: "06:00 PM", activity: "Review and plan tomorrow" }
  ],
  tips: [
    "Take regular breaks",
    "Stay hydrated",
    "Focus on high-impact tasks"
  ],
  active: true,
  created_at: new Date()
};

db.routines.insertOne(sampleRoutine);
print("Sample routine created");

// Sample Meetings
const today = new Date().toISOString().split('T')[0];
const sampleMeetings = [
  {
    user_id: userId,
    title: "Team Standup",
    description: "Daily team sync meeting",
    date: today,
    time: "10:00",
    location: "Conference Room A",
    attendees: ["Alice", "Bob", "Charlie"],
    reminder: true,
    created_at: new Date()
  },
  {
    user_id: userId,
    title: "Client Presentation",
    description: "Q1 Results presentation",
    date: today,
    time: "14:00",
    location: "Virtual - Zoom",
    attendees: ["Client Team"],
    reminder: true,
    created_at: new Date()
  }
];

db.meetings.insertMany(sampleMeetings);
print("Sample meetings created");

// Sample Expenses
const sampleExpenses = [
  {
    user_id: userId,
    amount: 45.50,
    category: "Food",
    description: "Grocery shopping",
    date: today,
    payment_method: "Card",
    created_at: new Date()
  },
  {
    user_id: userId,
    amount: 15.00,
    category: "Transport",
    description: "Taxi to office",
    date: today,
    payment_method: "Cash",
    created_at: new Date()
  },
  {
    user_id: userId,
    amount: 120.00,
    category: "Bills",
    description: "Electricity bill",
    date: today,
    payment_method: "Bank Transfer",
    created_at: new Date()
  }
];

db.expenses.insertMany(sampleExpenses);
print("Sample expenses created");

// Sample Tasks
const sampleTasks = [
  {
    user_id: userId,
    title: "Complete project report",
    description: "Finish Q1 project report for management",
    priority: "high",
    status: "in-progress",
    date: today,
    time: "11:00",
    completed: false,
    created_at: new Date()
  },
  {
    user_id: userId,
    title: "Review code submissions",
    description: "Review pull requests from team",
    priority: "medium",
    status: "pending",
    date: today,
    time: "15:00",
    completed: false,
    created_at: new Date()
  },
  {
    user_id: userId,
    title: "Call insurance company",
    description: "Follow up on policy renewal",
    priority: "low",
    status: "pending",
    date: today,
    completed: false,
    created_at: new Date()
  }
];

db.tasks.insertMany(sampleTasks);
print("Sample tasks created");

// Sample Prayer Times
const samplePrayerTimes = {
  user_id: userId,
  date: today,
  times: {
    fajr: "05:45",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:15",
    isha: "19:45"
  },
  location: {
    city: "New York",
    country: "USA",
    latitude: 40.7128,
    longitude: -74.0060
  },
  created_at: new Date()
};

db.prayer_times.insertOne(samplePrayerTimes);
print("Sample prayer times created");

print("\n=================================");
print("Sample data loaded successfully!");
print("=================================");
print("User ID: " + userId);
print("Use this ID to test the API endpoints");
