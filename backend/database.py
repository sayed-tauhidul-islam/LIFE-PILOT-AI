from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os

class Database:
    def __init__(self):
        """Initialize MongoDB connection"""
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.db_name = os.getenv('DATABASE_NAME', 'lifepilot_ai')
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client[self.db_name]
        
        # Collections
        self.users = self.db['users']
        self.routines = self.db['routines']
        self.meetings = self.db['meetings']
        self.expenses = self.db['expenses']
        self.tasks = self.db['tasks']
    
    def save_user_profile(self, user_data):
        """Save or update user profile"""
        user_data['updated_at'] = datetime.now()
        
        if 'created_at' not in user_data:
            user_data['created_at'] = datetime.now()
        
        result = self.users.insert_one(user_data)
        return result.inserted_id
    
    def get_user_profile(self, user_id):
        """Get user profile by ID"""
        try:
            user = self.users.find_one({'_id': ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except:
            return None
    
    def save_routine(self, routine_data):
        """Save a routine"""
        routine_data['created_at'] = datetime.now()
        result = self.routines.insert_one(routine_data)
        return result.inserted_id
    
    def get_user_routines(self, user_id):
        """Get all routines for a user"""
        routines = list(self.routines.find({'user_id': user_id}))
        for routine in routines:
            routine['_id'] = str(routine['_id'])
        return routines
    
    def save_meeting(self, meeting_data):
        """Save a meeting or event"""
        meeting_data['created_at'] = datetime.now()
        result = self.meetings.insert_one(meeting_data)
        return result.inserted_id
    
    def get_user_meetings(self, user_id, date=None):
        """Get meetings for a user, optionally filtered by date"""
        query = {'user_id': user_id}
        if date:
            query['date'] = date
        
        meetings = list(self.meetings.find(query).sort('date', 1))
        for meeting in meetings:
            meeting['_id'] = str(meeting['_id'])
        return meetings
    
    def save_expense(self, expense_data):
        """Save an expense record"""
        expense_data['created_at'] = datetime.now()
        result = self.expenses.insert_one(expense_data)
        return result.inserted_id
    
    def get_user_expenses(self, user_id, start_date=None, end_date=None):
        """Get expenses for a user within a date range"""
        query = {'user_id': user_id}
        if start_date and end_date:
            query['date'] = {'$gte': start_date, '$lte': end_date}
        
        expenses = list(self.expenses.find(query).sort('date', -1))
        for expense in expenses:
            expense['_id'] = str(expense['_id'])
        return expenses
    
    def save_task(self, task_data):
        """Save a task"""
        task_data['created_at'] = datetime.now()
        result = self.tasks.insert_one(task_data)
        return result.inserted_id
    
    def get_user_tasks(self, user_id, date=None):
        """Get tasks for a user"""
        query = {'user_id': user_id}
        if date:
            query['date'] = date
        
        tasks = list(self.tasks.find(query).sort('priority', -1))
        for task in tasks:
            task['_id'] = str(task['_id'])
        return tasks
    
    def get_user_finance_profile(self, user_id):
        """Get user's finance profile"""
        profile = self.db['finance_profiles'].find_one({'user_id': user_id})
        if profile:
            profile['_id'] = str(profile['_id'])
        return profile
    
    def update_user_finance_profile(self, user_id, profile_data):
        """Update or create user's finance profile"""
        try:
            result = self.db['finance_profiles'].update_one(
                {'user_id': user_id},
                {'$set': profile_data},
                upsert=True
            )
            return result.acknowledged
        except Exception as e:
            print(f"Error updating finance profile: {e}")
            return False
    
    def get_user_location(self, user_id):
        """Get user's saved location"""
        location = self.db['user_locations'].find_one({'user_id': user_id})
        if location:
            location['_id'] = str(location['_id'])
        return location
    
    def save_user_location(self, user_id, location_data):
        """Save or update user's location"""
        try:
            result = self.db['user_locations'].update_one(
                {'user_id': user_id},
                {'$set': location_data},
                upsert=True
            )
            return result.acknowledged
        except Exception as e:
            print(f"Error saving location: {e}")
            return False
    
    def get_financial_goals(self, user_id):
        """Get user's financial goals"""
        goals = list(self.db['financial_goals'].find({'user_id': user_id}))
        for goal in goals:
            goal['_id'] = str(goal['_id'])
        return goals
    
    def add_financial_goal(self, goal_data):
        """Add a financial goal"""
        goal_data['created_at'] = datetime.now()
        result = self.db['financial_goals'].insert_one(goal_data)
        return result.inserted_id
    
    def add_expense(self, expense_data):
        """Add an expense - for backwards compatibility"""
        return self.save_expense(expense_data)
