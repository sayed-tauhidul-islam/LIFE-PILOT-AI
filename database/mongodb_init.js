// MongoDB Initialization Script for Life Pilot AI Agent
// Run this script using: mongosh < mongodb_init.js

// Create and use the database
use lifepilot_ai;

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "monthlyIncome", "familySize", "created_at"],
      properties: {
        name: {
          bsonType: "string",
          description: "User's full name - required"
        },
        age: {
          bsonType: "int",
          minimum: 1,
          maximum: 150,
          description: "User's age - required"
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\..+$",
          description: "User's email address"
        },
        monthlyIncome: {
          bsonType: ["double", "int"],
          minimum: 0,
          description: "Monthly income - required"
        },
        familySize: {
          bsonType: "int",
          minimum: 1,
          description: "Number of family members - required"
        },
        location: {
          bsonType: "object",
          properties: {
            city: { bsonType: "string" },
            country: { bsonType: "string" },
            latitude: { bsonType: "double" },
            longitude: { bsonType: "double" }
          }
        },
        preferences: {
          bsonType: "object",
          properties: {
            theme: { enum: ["light", "dark", "blue"] },
            language: { bsonType: "string" },
            prayerNotifications: { bsonType: "bool" }
          }
        },
        created_at: {
          bsonType: "date",
          description: "Account creation date - required"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection("routines", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "title", "schedule"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "Reference to user - required"
        },
        type: {
          enum: ["student", "professional", "family"],
          description: "Type of routine - required"
        },
        title: {
          bsonType: "string",
          description: "Routine title - required"
        },
        schedule: {
          bsonType: "array",
          description: "Daily schedule - required"
        },
        active: {
          bsonType: "bool",
          description: "Whether routine is active"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection("meetings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "title", "date", "time"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "Reference to user - required"
        },
        title: {
          bsonType: "string",
          description: "Meeting title - required"
        },
        description: {
          bsonType: "string"
        },
        date: {
          bsonType: "string",
          description: "Meeting date - required"
        },
        time: {
          bsonType: "string",
          description: "Meeting time - required"
        },
        location: {
          bsonType: "string"
        },
        attendees: {
          bsonType: "array"
        },
        reminder: {
          bsonType: "bool"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection("expenses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "amount", "category", "date"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "Reference to user - required"
        },
        amount: {
          bsonType: ["double", "int"],
          minimum: 0,
          description: "Expense amount - required"
        },
        category: {
          enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"],
          description: "Expense category - required"
        },
        description: {
          bsonType: "string"
        },
        date: {
          bsonType: "string",
          description: "Expense date - required"
        },
        payment_method: {
          enum: ["Cash", "Card", "Bank Transfer", "Mobile Payment"],
          description: "Payment method"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection("tasks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "title", "priority", "date"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "Reference to user - required"
        },
        title: {
          bsonType: "string",
          description: "Task title - required"
        },
        description: {
          bsonType: "string"
        },
        priority: {
          enum: ["low", "medium", "high"],
          description: "Task priority - required"
        },
        status: {
          enum: ["pending", "in-progress", "completed", "cancelled"],
          description: "Task status"
        },
        date: {
          bsonType: "string",
          description: "Task date - required"
        },
        time: {
          bsonType: "string"
        },
        completed: {
          bsonType: "bool"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection("prayer_times", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "date", "times"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "Reference to user - required"
        },
        date: {
          bsonType: "string",
          description: "Date for prayer times - required"
        },
        times: {
          bsonType: "object",
          required: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
          properties: {
            fajr: { bsonType: "string" },
            dhuhr: { bsonType: "string" },
            asr: { bsonType: "string" },
            maghrib: { bsonType: "string" },
            isha: { bsonType: "string" }
          },
          description: "Prayer times - required"
        },
        location: {
          bsonType: "object"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes for better query performance
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "created_at": -1 });

db.routines.createIndex({ "user_id": 1 });
db.routines.createIndex({ "user_id": 1, "active": 1 });

db.meetings.createIndex({ "user_id": 1, "date": 1 });
db.meetings.createIndex({ "date": 1 });

db.expenses.createIndex({ "user_id": 1, "date": -1 });
db.expenses.createIndex({ "user_id": 1, "category": 1 });

db.tasks.createIndex({ "user_id": 1, "date": 1 });
db.tasks.createIndex({ "user_id": 1, "status": 1 });
db.tasks.createIndex({ "user_id": 1, "priority": -1 });

db.prayer_times.createIndex({ "user_id": 1, "date": 1 });

print("Database 'lifepilot_ai' initialized successfully!");
print("Collections created: users, routines, meetings, expenses, tasks, prayer_times");
print("Indexes created for optimal query performance");
