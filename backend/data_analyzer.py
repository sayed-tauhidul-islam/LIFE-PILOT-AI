import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import os

class UserDataAnalyzer:
    """
    Advanced AI analyzer for user data
    Analyzes spending patterns, routine optimization, and provides personalized insights
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
    
    def analyze_user_profile(self, user_data):
        """
        Analyze user profile and provide comprehensive insights
        """
        analysis = {
            'profile_summary': self._generate_profile_summary(user_data),
            'recommendations': [],
            'risk_factors': [],
            'strengths': []
        }
        
        # Analyze age group
        age = int(user_data.get('age', 30))
        income = float(user_data.get('monthlyIncome', 0))
        family_size = int(user_data.get('familySize', 1))
        
        # Age-based recommendations
        if age < 25:
            analysis['recommendations'].append({
                'category': 'Career',
                'priority': 'high',
                'message': 'Focus on skill development and career growth opportunities'
            })
        elif age < 40:
            analysis['recommendations'].append({
                'category': 'Financial',
                'priority': 'high',
                'message': 'Prime time for wealth building - increase savings to 25-30% of income'
            })
        else:
            analysis['recommendations'].append({
                'category': 'Financial',
                'priority': 'high',
                'message': 'Focus on retirement planning and wealth preservation'
            })
        
        # Income-to-family ratio analysis
        per_person_income = income / family_size if family_size > 0 else income
        
        if per_person_income < 1000:
            analysis['risk_factors'].append('Income per family member is below recommended levels')
            analysis['recommendations'].append({
                'category': 'Financial',
                'priority': 'critical',
                'message': 'Consider additional income sources or expense reduction strategies'
            })
        elif per_person_income > 3000:
            analysis['strengths'].append('Excellent income-to-family ratio')
            analysis['recommendations'].append({
                'category': 'Investment',
                'priority': 'medium',
                'message': 'Great opportunity to invest in long-term wealth building'
            })
        
        return analysis
    
    def _generate_profile_summary(self, user_data):
        """Generate a summary of user profile"""
        age = user_data.get('age', 'N/A')
        income = user_data.get('monthlyIncome', 0)
        family_size = user_data.get('familySize', 1)
        
        return {
            'age_group': self._get_age_group(age),
            'income_level': self._get_income_level(income),
            'family_type': self._get_family_type(family_size),
            'per_person_budget': income / family_size if family_size > 0 else income
        }
    
    def analyze_spending_patterns(self, expenses):
        """
        Analyze spending patterns using ML clustering
        """
        if not expenses or len(expenses) < 3:
            return {
                'status': 'insufficient_data',
                'message': 'Need more expense data for analysis (minimum 3 entries)',
                'suggestions': ['Track your expenses daily', 'Categorize all transactions']
            }
        
        # Convert expenses to DataFrame
        df = pd.DataFrame(expenses)
        
        # Category-wise analysis
        category_spending = df.groupby('category')['amount'].sum().to_dict()
        total_spending = df['amount'].sum()
        
        # Calculate percentages
        category_percentages = {
            cat: (amount / total_spending * 100) 
            for cat, amount in category_spending.items()
        }
        
        # Identify overspending categories
        recommendations = []
        overspending_categories = []
        
        # Spending thresholds (industry standards)
        thresholds = {
            'Food': 25,
            'Transport': 15,
            'Shopping': 10,
            'Bills': 30,
            'Entertainment': 10,
            'Health': 10,
            'Education': 10
        }
        
        for category, percentage in category_percentages.items():
            threshold = thresholds.get(category, 15)
            if percentage > threshold:
                overspending_categories.append(category)
                potential_savings = (percentage - threshold) * total_spending / 100
                recommendations.append({
                    'category': category,
                    'current_percentage': round(percentage, 2),
                    'recommended_percentage': threshold,
                    'potential_savings': round(potential_savings, 2),
                    'priority': 'high' if percentage > threshold * 1.5 else 'medium'
                })
        
        # Trend analysis
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Calculate daily average
        date_range = (df['date'].max() - df['date'].min()).days or 1
        daily_average = total_spending / date_range
        
        return {
            'status': 'analyzed',
            'total_spending': round(total_spending, 2),
            'daily_average': round(daily_average, 2),
            'category_breakdown': {k: round(v, 2) for k, v in category_spending.items()},
            'category_percentages': {k: round(v, 2) for k, v in category_percentages.items()},
            'overspending_categories': overspending_categories,
            'recommendations': recommendations,
            'spending_score': self._calculate_spending_score(category_percentages, thresholds)
        }
    
    def _calculate_spending_score(self, percentages, thresholds):
        """Calculate overall spending health score (0-100)"""
        score = 100
        for category, percentage in percentages.items():
            threshold = thresholds.get(category, 15)
            if percentage > threshold:
                excess = percentage - threshold
                score -= min(excess, 20)  # Max 20 points penalty per category
        return max(0, round(score))
    
    def optimize_routine(self, user_data, tasks, meetings):
        """
        AI-powered routine optimization
        """
        age = int(user_data.get('age', 30))
        
        # Recommended sleep hours by age
        if age < 18:
            recommended_sleep = 9
        elif age < 26:
            recommended_sleep = 8
        elif age < 65:
            recommended_sleep = 7.5
        else:
            recommended_sleep = 7
        
        # Analyze task load
        task_count = len(tasks) if tasks else 0
        meeting_count = len(meetings) if meetings else 0
        
        workload_score = min(100, (task_count * 10 + meeting_count * 15))
        
        recommendations = []
        
        if workload_score > 80:
            recommendations.append({
                'type': 'workload',
                'priority': 'high',
                'message': 'Your schedule is very busy. Consider delegating tasks or rescheduling non-urgent items'
            })
        
        if task_count > 8:
            recommendations.append({
                'type': 'productivity',
                'priority': 'medium',
                'message': 'Focus on 3-5 high-priority tasks per day for better productivity'
            })
        
        # Best productivity hours by age
        if age < 30:
            peak_hours = '9 AM - 2 PM'
        elif age < 50:
            peak_hours = '10 AM - 3 PM'
        else:
            peak_hours = '8 AM - 12 PM'
        
        return {
            'recommended_sleep_hours': recommended_sleep,
            'workload_score': workload_score,
            'workload_level': self._get_workload_level(workload_score),
            'peak_productivity_hours': peak_hours,
            'task_count': task_count,
            'meeting_count': meeting_count,
            'recommendations': recommendations,
            'optimal_break_frequency': '25 minutes work, 5 minutes break (Pomodoro technique)'
        }
    
    def _get_workload_level(self, score):
        """Determine workload level"""
        if score < 30:
            return 'Light'
        elif score < 60:
            return 'Moderate'
        elif score < 80:
            return 'Heavy'
        else:
            return 'Overloaded'
    
    def predict_monthly_expenses(self, expenses_history):
        """
        Predict next month's expenses using historical data
        """
        if not expenses_history or len(expenses_history) < 10:
            return {
                'status': 'insufficient_data',
                'message': 'Need at least 10 expense records for prediction'
            }
        
        df = pd.DataFrame(expenses_history)
        df['date'] = pd.to_datetime(df['date'])
        
        # Group by month
        df['month'] = df['date'].dt.to_period('M')
        monthly_totals = df.groupby('month')['amount'].sum()
        
        # Simple trend analysis
        if len(monthly_totals) >= 2:
            trend = monthly_totals.pct_change().mean() * 100
            last_month_total = monthly_totals.iloc[-1]
            predicted_next_month = last_month_total * (1 + trend / 100)
            
            return {
                'status': 'predicted',
                'last_month_total': round(last_month_total, 2),
                'predicted_next_month': round(predicted_next_month, 2),
                'trend_percentage': round(trend, 2),
                'trend_direction': 'increasing' if trend > 0 else 'decreasing',
                'confidence': 'medium' if len(monthly_totals) < 6 else 'high'
            }
        
        return {
            'status': 'insufficient_data',
            'message': 'Need at least 2 months of data'
        }
    
    def _get_age_group(self, age):
        """Categorize age into groups"""
        if isinstance(age, str):
            return 'Unknown'
        age = int(age)
        if age < 18:
            return 'Teen'
        elif age < 25:
            return 'Young Adult'
        elif age < 40:
            return 'Adult'
        elif age < 60:
            return 'Middle Age'
        else:
            return 'Senior'
    
    def _get_income_level(self, income):
        """Categorize income level"""
        income = float(income)
        if income < 2000:
            return 'Low'
        elif income < 5000:
            return 'Medium'
        elif income < 10000:
            return 'High'
        else:
            return 'Very High'
    
    def _get_family_type(self, family_size):
        """Categorize family type"""
        size = int(family_size)
        if size == 1:
            return 'Single'
        elif size == 2:
            return 'Couple'
        elif size <= 4:
            return 'Small Family'
        else:
            return 'Large Family'
    
    def generate_personalized_insights(self, user_data, expenses, tasks, meetings):
        """
        Generate comprehensive personalized insights
        """
        profile_analysis = self.analyze_user_profile(user_data)
        spending_analysis = self.analyze_spending_patterns(expenses)
        routine_analysis = self.optimize_routine(user_data, tasks, meetings)
        
        # Generate AI insights
        insights = {
            'overall_health_score': self._calculate_overall_health_score(
                spending_analysis, routine_analysis
            ),
            'profile_analysis': profile_analysis,
            'spending_analysis': spending_analysis,
            'routine_analysis': routine_analysis,
            'action_items': self._generate_action_items(
                profile_analysis, spending_analysis, routine_analysis
            )
        }
        
        return insights
    
    def _calculate_overall_health_score(self, spending_analysis, routine_analysis):
        """Calculate overall life management health score"""
        spending_score = spending_analysis.get('spending_score', 50)
        workload_score = routine_analysis.get('workload_score', 50)
        
        # Normalize workload score (lower is better for this metric)
        normalized_workload = 100 - min(workload_score, 100)
        
        # Weighted average
        overall_score = (spending_score * 0.6 + normalized_workload * 0.4)
        
        return {
            'score': round(overall_score),
            'grade': self._get_grade(overall_score),
            'components': {
                'financial_health': spending_score,
                'work_life_balance': normalized_workload
            }
        }
    
    def _get_grade(self, score):
        """Convert score to letter grade"""
        if score >= 90:
            return 'A - Excellent'
        elif score >= 80:
            return 'B - Good'
        elif score >= 70:
            return 'C - Fair'
        elif score >= 60:
            return 'D - Needs Improvement'
        else:
            return 'F - Critical'
    
    def _generate_action_items(self, profile_analysis, spending_analysis, routine_analysis):
        """Generate prioritized action items"""
        action_items = []
        
        # Add critical spending recommendations
        if spending_analysis.get('status') == 'analyzed':
            for rec in spending_analysis.get('recommendations', [])[:3]:
                if rec['priority'] == 'high':
                    action_items.append({
                        'priority': 1,
                        'category': 'Financial',
                        'action': f"Reduce {rec['category']} spending by {rec['current_percentage'] - rec['recommended_percentage']:.1f}%",
                        'impact': f"Save ${rec['potential_savings']:.2f}"
                    })
        
        # Add routine recommendations
        for rec in routine_analysis.get('recommendations', [])[:2]:
            priority = 2 if rec['priority'] == 'high' else 3
            action_items.append({
                'priority': priority,
                'category': 'Productivity',
                'action': rec['message'],
                'impact': 'Improved work-life balance'
            })
        
        # Add profile-based recommendations
        for rec in profile_analysis.get('recommendations', [])[:2]:
            priority = 2 if rec['priority'] in ['high', 'critical'] else 3
            action_items.append({
                'priority': priority,
                'category': rec['category'],
                'action': rec['message'],
                'impact': 'Long-term financial security'
            })
        
        # Sort by priority
        action_items.sort(key=lambda x: x['priority'])
        
        return action_items[:5]  # Return top 5 actions
