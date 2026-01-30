import os
import requests
from datetime import datetime, timedelta
from database import Database
from data_analyzer import UserDataAnalyzer

class AIAdvisor:
    def __init__(self):
        """Initialize AI Advisor"""
        self.db = Database()
        self.weather_api_key = os.getenv('WEATHER_API_KEY', '')
        self.analyzer = UserDataAnalyzer()
    
    def generate_daily_advice(self, user_id):
        """Generate daily advice for user"""
        # Get user profile
        if user_id:
            user = self.db.get_user_profile(user_id)
        else:
            user = None
        
        # Get weather
        weather = self._get_weather_info()
        
        # Get today's meetings
        today = datetime.now().strftime('%Y-%m-%d')
        meetings = self.db.get_user_meetings(user_id, today) if user_id else []
        
        # Generate tasks
        tasks = self._generate_tasks(user, weather, meetings)
        
        # Financial tip
        financial_tip = self._get_financial_tip(user) if user else "Track your expenses to get personalized tips"
        
        return {
            'date': today,
            'weather': weather,
            'tasks': tasks,
            'meetings': meetings,
            'financial_tip': financial_tip,
            'generated_at': datetime.now().isoformat()
        }
    
    def _get_weather_info(self):
        """Get weather information"""
        # Placeholder weather info
        # In production, integrate with weather API like OpenWeatherMap
        return {
            'condition': 'Sunny',
            'temperature': 72,
            'suggestion': 'Great day for outdoor activities'
        }
    
    def _generate_tasks(self, user, weather, meetings):
        """Generate daily tasks based on context"""
        tasks = []
        
        # Morning tasks
        tasks.append({
            'time': 'Morning',
            'task': 'Review meeting agenda and prepare materials',
            'priority': 'high'
        })
        
        # Based on weather
        if weather['condition'] == 'Sunny':
            tasks.append({
                'time': 'Afternoon',
                'task': 'Take a 30-minute walk or outdoor exercise',
                'priority': 'medium'
            })
        
        # Evening tasks
        tasks.append({
            'time': 'Evening',
            'task': 'Plan tomorrow\'s schedule and review goals',
            'priority': 'medium'
        })
        
        return tasks
    
    def _get_financial_tip(self, user):
        """Generate financial tip based on user data"""
        if not user:
            return "Set up your profile to get personalized financial advice"
        
        income = float(user.get('monthlyIncome', 0))
        family_size = int(user.get('familySize', 1))
        
        # Calculate recommended savings
        recommended_savings = income * 0.2  # 20% savings rule
        per_person_budget = (income - recommended_savings) / family_size
        
        return f"Recommended savings: ${recommended_savings:.2f}/month. Budget per person: ${per_person_budget:.2f}"
    
    def create_routine(self, user_id, routine_type):
        """Create a personalized routine"""
        user = self.db.get_user_profile(user_id) if user_id else None
        
        routines = {
            'student': self._create_student_routine(user),
            'professional': self._create_professional_routine(user),
            'family': self._create_family_routine(user)
        }
        
        routine = routines.get(routine_type, routines['professional'])
        routine['user_id'] = user_id
        routine['type'] = routine_type
        
        return routine
    
    def _create_student_routine(self, user):
        """Create routine for students"""
        return {
            'title': 'Student Success Routine',
            'schedule': [
                {'time': '06:00 AM', 'activity': 'Wake up and morning exercise'},
                {'time': '07:00 AM', 'activity': 'Breakfast and study session 1'},
                {'time': '09:00 AM', 'activity': 'Classes/Online learning'},
                {'time': '12:00 PM', 'activity': 'Lunch break'},
                {'time': '01:00 PM', 'activity': 'Study session 2 - Focus on difficult subjects'},
                {'time': '04:00 PM', 'activity': 'Break time - Sports or hobbies'},
                {'time': '06:00 PM', 'activity': 'Evening study session'},
                {'time': '08:00 PM', 'activity': 'Dinner and family time'},
                {'time': '09:00 PM', 'activity': 'Light reading or review'},
                {'time': '10:00 PM', 'activity': 'Prepare for bed - No screens'}
            ],
            'tips': [
                'Take 5-minute breaks every 25 minutes (Pomodoro technique)',
                'Stay hydrated - drink 8 glasses of water daily',
                'Get 7-9 hours of sleep for better focus'
            ]
        }
    
    def _create_professional_routine(self, user):
        """Create routine for professionals"""
        return {
            'title': 'Professional Excellence Routine',
            'schedule': [
                {'time': '06:30 AM', 'activity': 'Morning exercise or meditation'},
                {'time': '07:30 AM', 'activity': 'Breakfast and news review'},
                {'time': '09:00 AM', 'activity': 'Most important task of the day'},
                {'time': '11:00 AM', 'activity': 'Meetings and collaboration'},
                {'time': '12:30 PM', 'activity': 'Lunch break - Step away from desk'},
                {'time': '02:00 PM', 'activity': 'Deep work session'},
                {'time': '04:00 PM', 'activity': 'Emails and administrative tasks'},
                {'time': '06:00 PM', 'activity': 'Review day and plan tomorrow'},
                {'time': '07:00 PM', 'activity': 'Personal time and family'},
                {'time': '10:00 PM', 'activity': 'Wind down routine'}
            ],
            'tips': [
                'Block calendar for focused work',
                'Use the 80/20 rule - focus on high-impact tasks',
                'Take regular breaks to maintain productivity'
            ]
        }
    
    def _create_family_routine(self, user):
        """Create routine for families"""
        return {
            'title': 'Family Harmony Routine',
            'schedule': [
                {'time': '06:30 AM', 'activity': 'Wake up and prepare breakfast'},
                {'time': '07:30 AM', 'activity': 'Family breakfast together'},
                {'time': '08:30 AM', 'activity': 'School/Work preparation'},
                {'time': '12:00 PM', 'activity': 'Lunch planning and prep'},
                {'time': '03:00 PM', 'activity': 'Kids homework time'},
                {'time': '05:00 PM', 'activity': 'Family activity or outdoor time'},
                {'time': '06:30 PM', 'activity': 'Dinner preparation together'},
                {'time': '07:30 PM', 'activity': 'Family dinner and conversation'},
                {'time': '08:30 PM', 'activity': 'Bedtime routine for kids'},
                {'time': '09:30 PM', 'activity': 'Adult time - relax or plan'}
            ],
            'tips': [
                'Involve kids in meal planning and preparation',
                'Schedule regular family meetings',
                'Create a shared family calendar'
            ]
        }
    
    def analyze_finances(self, user_profile, expenses):
        """Analyze finances and provide saving tips"""
        if not user_profile:
            return {'message': 'User profile needed for analysis'}
        
        income = float(user_profile.get('monthlyIncome', 0))
        family_size = int(user_profile.get('familySize', 1))
        
        # Calculate total expenses
        total_expenses = sum(float(exp.get('amount', 0)) for exp in expenses)
        
        # Calculate savings
        savings = income - total_expenses
        savings_rate = (savings / income * 100) if income > 0 else 0
        
        # Generate recommendations
        recommendations = []
        
        if savings_rate < 20:
            recommendations.append('Aim to save at least 20% of your income')
        
        # Analyze expense categories
        categories = {}
        for exp in expenses:
            category = exp.get('category', 'Other')
            categories[category] = categories.get(category, 0) + float(exp.get('amount', 0))
        
        # Check for high dining expenses
        if 'Dining' in categories and categories['Dining'] > income * 0.15:
            potential_savings = categories['Dining'] - (income * 0.10)
            recommendations.append(f'Reduce dining out expenses to save ${potential_savings:.2f}/month')
        
        return {
            'income': income,
            'total_expenses': total_expenses,
            'savings': savings,
            'savings_rate': f'{savings_rate:.1f}%',
            'expense_breakdown': categories,
            'recommendations': recommendations,
            'per_person_budget': (income - (income * 0.2)) / family_size
        }
    
    def generate_today_tasks(self, user_id):
        """Generate tasks for today based on all factors"""
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Get meetings
        meetings = self.db.get_user_meetings(user_id, today) if user_id else []
        
        # Get weather
        weather = self._get_weather_info()
        
        # Get user profile
        user = self.db.get_user_profile(user_id) if user_id else None
        
        # Generate tasks
        tasks = self._generate_tasks(user, weather, meetings)
        
        return {
            'date': today,
            'tasks': tasks,
            'meetings': meetings,
            'weather_suggestion': weather['suggestion']
        }
