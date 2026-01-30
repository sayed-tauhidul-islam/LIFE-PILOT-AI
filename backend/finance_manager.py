"""
Finance Manager with AI/ML capabilities
Handles budget recommendations, expense predictions, and investment advice
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json


class BudgetAI:
    """AI-powered budget recommendation system"""
    
    def __init__(self):
        self.budget_rules = {
            'conservative': {'necessities': 60, 'savings': 30, 'lifestyle': 10},
            'balanced': {'necessities': 50, 'savings': 20, 'lifestyle': 30},
            'aggressive': {'necessities': 40, 'savings': 40, 'lifestyle': 20}
        }
    
    def recommend_budget(self, user_data: Dict) -> Dict:
        """
        Recommend budget allocation based on user profile
        
        Args:
            user_data: {
                'income': 70000,
                'age': 25,
                'city': 'Dhaka',
                'family_size': 3,
                'existing_expenses': {...}
            }
        
        Returns:
            Budget recommendations with categories and percentages
        """
        income = user_data.get('income', 0)
        age = user_data.get('age', 30)
        family_size = user_data.get('family_size', 1)
        
        # Determine budget profile
        if age < 25:
            profile = 'aggressive'
        elif age < 40 and family_size <= 2:
            profile = 'balanced'
        else:
            profile = 'conservative'
        
        allocation = self.budget_rules[profile].copy()
        
        # Adjust for family size
        if family_size > 3:
            allocation['necessities'] += 10
            allocation['savings'] -= 5
            allocation['lifestyle'] -= 5
        
        # Calculate amounts
        recommendations = {
            'profile': profile,
            'monthly_income': income,
            'allocation': {
                'necessities': {
                    'percentage': allocation['necessities'],
                    'amount': income * allocation['necessities'] / 100,
                    'categories': {
                        'rent': income * 0.25,
                        'food': income * 0.15,
                        'utilities': income * 0.10,
                        'transport': income * 0.10
                    }
                },
                'savings': {
                    'percentage': allocation['savings'],
                    'amount': income * allocation['savings'] / 100,
                    'suggestions': ['emergency_fund', 'retirement', 'investments']
                },
                'lifestyle': {
                    'percentage': allocation['lifestyle'],
                    'amount': income * allocation['lifestyle'] / 100,
                    'categories': ['entertainment', 'shopping', 'travel', 'hobbies']
                }
            }
        }
        
        return recommendations
    
    def analyze_spending_patterns(self, expenses: List[Dict]) -> Dict:
        """Analyze spending patterns and provide insights"""
        
        if not expenses:
            return {'message': 'No expenses to analyze'}
        
        # Calculate category totals
        category_totals = {}
        for expense in expenses:
            category = expense.get('category', 'Other')
            amount = expense.get('amount', 0)
            category_totals[category] = category_totals.get(category, 0) + amount
        
        total_expenses = sum(category_totals.values())
        
        # Find top spending categories
        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        
        insights = []
        
        # Generate insights
        if sorted_categories:
            top_category = sorted_categories[0]
            percentage = (top_category[1] / total_expenses * 100) if total_expenses > 0 else 0
            
            if percentage > 40:
                insights.append(f"⚠️ আপনার {top_category[0]} খরচ খুব বেশি ({percentage:.1f}%)। এটি কমানোর চেষ্টা করুন।")
        
        # Check for lifestyle inflation
        lifestyle_categories = ['entertainment', 'shopping', 'travel', 'dining']
        lifestyle_total = sum(category_totals.get(cat, 0) for cat in lifestyle_categories)
        lifestyle_percentage = (lifestyle_total / total_expenses * 100) if total_expenses > 0 else 0
        
        if lifestyle_percentage > 30:
            insights.append(f"💸 লাইফস্টাইল খরচ বেশি হচ্ছে ({lifestyle_percentage:.1f}%)। বাজেট তৈরি করুন।")
        
        return {
            'total_expenses': total_expenses,
            'category_breakdown': category_totals,
            'top_categories': sorted_categories[:5],
            'insights': insights
        }


class ExpensePredictor:
    """Predict future expenses based on historical data"""
    
    def __init__(self):
        self.seasonal_factors = {
            1: 1.1,   # January - New Year
            2: 0.9,   # February
            3: 0.95,  # March
            4: 1.0,   # April
            5: 1.05,  # May
            6: 0.95,  # June
            7: 1.0,   # July
            8: 1.1,   # August - Eid/Festival
            9: 0.95,  # September
            10: 1.05, # October - Durga Puja
            11: 1.0,  # November
            12: 1.15  # December - Winter/Holidays
        }
    
    def predict_next_month(self, historical_data: List[Dict]) -> Dict:
        """
        Predict next month's expenses based on historical patterns
        
        Args:
            historical_data: List of monthly expense records
        
        Returns:
            Prediction with confidence level and recommendations
        """
        
        if len(historical_data) < 2:
            return {
                'prediction': None,
                'message': 'Need at least 2 months of data for predictions'
            }
        
        # Calculate average expenses
        total_expenses = [d['total_expenses'] for d in historical_data]
        avg_expenses = np.mean(total_expenses)
        std_expenses = np.std(total_expenses)
        
        # Get current month
        current_month = datetime.now().month
        next_month = (current_month % 12) + 1
        
        # Apply seasonal factor
        seasonal_adjustment = self.seasonal_factors.get(next_month, 1.0)
        predicted_expense = avg_expenses * seasonal_adjustment
        
        # Calculate confidence interval
        confidence_range = {
            'low': predicted_expense - std_expenses,
            'high': predicted_expense + std_expenses,
            'predicted': predicted_expense
        }
        
        # Generate recommendations
        recommendations = []
        
        if seasonal_adjustment > 1.0:
            recommendations.append(f"📅 আগামী মাসে খরচ বাড়তে পারে। অতিরিক্ত ৳{predicted_expense - avg_expenses:.0f} বাজেট রাখুন।")
        
        if std_expenses > avg_expenses * 0.3:
            recommendations.append("⚡ আপনার খরচ অস্থির। নিয়মিত বাজেট মেনে চলুন।")
        
        return {
            'predicted_expense': predicted_expense,
            'confidence_range': confidence_range,
            'seasonal_factor': seasonal_adjustment,
            'recommendations': recommendations
        }
    
    def detect_anomalies(self, current_expenses: float, historical_avg: float) -> List[str]:
        """Detect unusual spending patterns"""
        
        alerts = []
        
        increase_percentage = ((current_expenses - historical_avg) / historical_avg * 100) if historical_avg > 0 else 0
        
        if increase_percentage > 20:
            alerts.append(f"🚨 এই মাসে খরচ স্বাভাবিকের চেয়ে {increase_percentage:.0f}% বেশি!")
        
        if current_expenses > historical_avg * 1.5:
            alerts.append("⚠️ অস্বাভাবিক খরচ! কারণ চেক করুন।")
        
        return alerts


class InvestmentAdvisor:
    """AI-powered investment recommendation system"""
    
    def __init__(self):
        self.risk_profiles = {
            'conservative': {
                'stocks': 20,
                'bonds': 40,
                'mutual_funds': 20,
                'fixed_deposits': 15,
                'gold': 5,
                'expected_return': 8
            },
            'moderate': {
                'stocks': 40,
                'bonds': 25,
                'mutual_funds': 20,
                'fixed_deposits': 10,
                'gold': 5,
                'expected_return': 12
            },
            'aggressive': {
                'stocks': 60,
                'bonds': 15,
                'mutual_funds': 15,
                'fixed_deposits': 5,
                'gold': 5,
                'expected_return': 18
            }
        }
    
    def assess_risk_profile(self, user_data: Dict) -> str:
        """
        Assess user's risk tolerance and investment profile
        
        Args:
            user_data: {
                'age': 25,
                'income': 50000,
                'income_stable': True,
                'investment_horizon': 10,  # years
                'dependents': 0,
                'emergency_fund': True
            }
        
        Returns:
            Risk profile: 'conservative', 'moderate', or 'aggressive'
        """
        
        score = 0
        
        # Age factor (younger = more risk tolerance)
        age = user_data.get('age', 30)
        if age < 25:
            score += 3
        elif age < 35:
            score += 2
        elif age < 50:
            score += 1
        else:
            score += 0
        
        # Income stability
        if user_data.get('income_stable', False):
            score += 2
        else:
            score += 0
        
        # Investment horizon
        horizon = user_data.get('investment_horizon', 1)
        if horizon > 10:
            score += 3
        elif horizon > 5:
            score += 2
        elif horizon > 2:
            score += 1
        else:
            score += 0
        
        # Emergency fund status
        if user_data.get('emergency_fund', False):
            score += 1
        
        # Dependents (more dependents = less risk)
        dependents = user_data.get('dependents', 0)
        if dependents == 0:
            score += 2
        elif dependents <= 2:
            score += 1
        
        # Determine profile
        if score >= 8:
            return 'aggressive'
        elif score >= 5:
            return 'moderate'
        else:
            return 'conservative'
    
    def recommend_portfolio(self, user_data: Dict, investment_amount: float) -> Dict:
        """
        Generate personalized investment portfolio recommendations
        
        Args:
            user_data: User profile information
            investment_amount: Amount to invest
        
        Returns:
            Portfolio recommendations with allocations and reasoning
        """
        
        profile = self.assess_risk_profile(user_data)
        allocation = self.risk_profiles[profile]
        
        recommendations = []
        
        for asset, percentage in allocation.items():
            if asset != 'expected_return':
                amount = (percentage / 100) * investment_amount
                recommendations.append({
                    'asset': asset,
                    'percentage': percentage,
                    'amount': amount,
                    'reasoning': self._get_reasoning(asset, profile)
                })
        
        # Calculate expected returns
        expected_annual_return = allocation['expected_return']
        expected_value_1yr = investment_amount * (1 + expected_annual_return / 100)
        expected_value_5yr = investment_amount * ((1 + expected_annual_return / 100) ** 5)
        
        return {
            'risk_profile': profile,
            'investment_amount': investment_amount,
            'portfolio': recommendations,
            'expected_return': expected_annual_return,
            'projections': {
                '1_year': expected_value_1yr,
                '5_year': expected_value_5yr
            },
            'next_steps': self._get_next_steps(profile)
        }
    
    def _get_reasoning(self, asset: str, profile: str) -> str:
        """Get reasoning for asset allocation"""
        
        reasons = {
            'stocks': {
                'conservative': 'কম পরিমাণে স্টক রাখা হয়েছে রিস্ক কমানোর জন্য',
                'moderate': 'মধ্যম রিটার্নের জন্য ব্যালেন্সড স্টক অ্যালোকেশন',
                'aggressive': 'বেশি রিটার্নের জন্য স্টকে বেশি বিনিয়োগ'
            },
            'bonds': {
                'conservative': 'স্থিতিশীল আয়ের জন্য বন্ডে বেশি বিনিয়োগ',
                'moderate': 'পোর্টফোলিও ব্যালেন্সের জন্য বন্ড',
                'aggressive': 'কম রিস্কি এসেট হিসেবে সামান্য বন্ড'
            },
            'mutual_funds': {
                'conservative': 'ডাইভার্সিফাইড মিউচুয়াল ফান্ড',
                'moderate': 'হাইব্রিড ফান্ডে বিনিয়োগ',
                'aggressive': 'ইক্যুইটি মিউচুয়াল ফান্ডে বিনিয়োগ'
            },
            'fixed_deposits': {
                'conservative': 'নিরাপদ এবং গ্যারান্টিড রিটার্ন',
                'moderate': 'ইমার্জেন্সি লিকুইডিটির জন্য এফডি',
                'aggressive': 'লিকুইডিটি বজায় রাখার জন্য কম এফডি'
            },
            'gold': {
                'conservative': 'ইনফ্লেশন হেজ হিসেবে গোল্ড',
                'moderate': 'পোর্টফোলিও স্ট্যাবিলিটির জন্য গোল্ড',
                'aggressive': 'ডাইভার্সিফিকেশনের জন্য সামান্য গোল্ড'
            }
        }
        
        return reasons.get(asset, {}).get(profile, 'Diversification')
    
    def _get_next_steps(self, profile: str) -> List[str]:
        """Get actionable next steps based on profile"""
        
        steps = {
            'conservative': [
                '1. ব্যাংকে সেভিংস অ্যাকাউন্ট খুলুন',
                '2. ফিক্সড ডিপোজিট স্কিম চেক করুন',
                '3. গভর্নমেন্ট বন্ড সম্পর্কে জানুন',
                '4. হেলথ ইন্সুরেন্স নিন'
            ],
            'moderate': [
                '1. ডিম্যাট অ্যাকাউন্ট খুলুন',
                '2. মিউচুয়াল ফান্ড SIP শুরু করুন',
                '3. ব্লু চিপ স্টক রিসার্চ করুন',
                '4. পোর্টফোলিও রিভিউ করুন (3 মাস পর পর)'
            ],
            'aggressive': [
                '1. স্টক মার্কেট বেসিক্স শিখুন',
                '2. গ্রোথ স্টক আইডেন্টিফাই করুন',
                '3. সেক্টরভিত্তিক ডাইভার্সিফাই করুন',
                '4. মার্কেট ট্রেন্ড নিয়মিত ফলো করুন'
            ]
        }
        
        return steps.get(profile, [])


class FinancialGoalTracker:
    """Track and manage financial goals"""
    
    def calculate_goal_progress(self, goal: Dict) -> Dict:
        """
        Calculate progress towards a financial goal
        
        Args:
            goal: {
                'name': 'Emergency Fund',
                'target_amount': 300000,
                'current_amount': 150000,
                'deadline': '2026-12-31',
                'monthly_contribution': 10000
            }
        
        Returns:
            Progress analysis with timeline and recommendations
        """
        
        target = goal['target_amount']
        current = goal['current_amount']
        monthly = goal.get('monthly_contribution', 0)
        
        remaining = target - current
        progress_percentage = (current / target * 100) if target > 0 else 0
        
        # Calculate timeline
        if monthly > 0:
            months_needed = remaining / monthly
            completion_date = datetime.now() + timedelta(days=months_needed * 30)
        else:
            months_needed = None
            completion_date = None
        
        # Check if on track
        deadline = datetime.strptime(goal['deadline'], '%Y-%m-%d')
        months_until_deadline = (deadline - datetime.now()).days / 30
        
        on_track = months_needed <= months_until_deadline if months_needed else False
        
        recommendations = []
        
        if not on_track and monthly > 0:
            required_monthly = remaining / months_until_deadline
            recommendations.append(
                f"⚠️ লক্ষ্য পূরণ করতে মাসিক ৳{required_monthly:.0f} সেভ করতে হবে (বর্তমান: ৳{monthly:.0f})"
            )
        
        if progress_percentage < 25 and months_until_deadline < 6:
            recommendations.append("🚨 সময় কম! মাসিক সেভিংস বাড়ান।")
        
        if progress_percentage >= 75:
            recommendations.append("🎉 প্রায় শেষ! আরো একটু চেষ্টা।")
        
        return {
            'goal_name': goal['name'],
            'progress_percentage': progress_percentage,
            'remaining_amount': remaining,
            'months_needed': months_needed,
            'estimated_completion': completion_date.strftime('%Y-%m-%d') if completion_date else None,
            'deadline': goal['deadline'],
            'on_track': on_track,
            'recommendations': recommendations
        }
    
    def suggest_savings_plan(self, income: float, expenses: float, goal_amount: float, months: int) -> Dict:
        """Suggest a savings plan to reach financial goal"""
        
        disposable_income = income - expenses
        required_monthly = goal_amount / months
        
        feasible = required_monthly <= disposable_income * 0.5
        
        plan = {
            'goal_amount': goal_amount,
            'timeline_months': months,
            'required_monthly_saving': required_monthly,
            'disposable_income': disposable_income,
            'feasible': feasible
        }
        
        if feasible:
            plan['strategy'] = 'balanced'
            plan['recommendation'] = f"✅ মাসিক ৳{required_monthly:.0f} সেভ করলে লক্ষ্য পূরণ হবে"
        else:
            plan['strategy'] = 'aggressive'
            plan['recommendation'] = (
                f"⚠️ লক্ষ্য পূরণ করতে আয় বাড়ান অথবা খরচ কমান। "
                f"দরকার: ৳{required_monthly:.0f}, সম্ভব: ৳{disposable_income * 0.5:.0f}"
            )
        
        return plan


# Utility functions
def calculate_savings_rate(income: float, expenses: float) -> float:
    """Calculate savings rate as percentage of income"""
    if income <= 0:
        return 0
    return ((income - expenses) / income) * 100


def calculate_emergency_fund_target(monthly_expenses: float, months: int = 6) -> float:
    """Calculate recommended emergency fund (typically 6 months of expenses)"""
    return monthly_expenses * months


def calculate_debt_to_income_ratio(monthly_debt_payments: float, monthly_income: float) -> float:
    """Calculate debt-to-income ratio"""
    if monthly_income <= 0:
        return 0
    return (monthly_debt_payments / monthly_income) * 100


def generate_financial_health_score(user_data: Dict) -> Dict:
    """
    Generate overall financial health score (0-100)
    
    Args:
        user_data: {
            'income': 70000,
            'expenses': 45000,
            'savings': 100000,
            'debt': 50000,
            'emergency_fund': 200000
        }
    
    Returns:
        Health score with breakdown and recommendations
    """
    
    income = user_data.get('income', 0)
    expenses = user_data.get('expenses', 0)
    savings = user_data.get('savings', 0)
    debt = user_data.get('debt', 0)
    emergency_fund = user_data.get('emergency_fund', 0)
    
    score = 0
    breakdown = {}
    
    # Savings rate (30 points)
    savings_rate = calculate_savings_rate(income, expenses)
    if savings_rate >= 20:
        score += 30
        breakdown['savings_rate'] = {'score': 30, 'status': 'excellent'}
    elif savings_rate >= 10:
        score += 20
        breakdown['savings_rate'] = {'score': 20, 'status': 'good'}
    else:
        score += 10
        breakdown['savings_rate'] = {'score': 10, 'status': 'needs_improvement'}
    
    # Emergency fund (30 points)
    required_emergency = expenses * 6
    if emergency_fund >= required_emergency:
        score += 30
        breakdown['emergency_fund'] = {'score': 30, 'status': 'excellent'}
    elif emergency_fund >= required_emergency * 0.5:
        score += 20
        breakdown['emergency_fund'] = {'score': 20, 'status': 'good'}
    else:
        score += 10
        breakdown['emergency_fund'] = {'score': 10, 'status': 'needs_improvement'}
    
    # Debt management (20 points)
    debt_ratio = (debt / income * 100) if income > 0 else 100
    if debt_ratio < 20:
        score += 20
        breakdown['debt_management'] = {'score': 20, 'status': 'excellent'}
    elif debt_ratio < 50:
        score += 15
        breakdown['debt_management'] = {'score': 15, 'status': 'good'}
    else:
        score += 5
        breakdown['debt_management'] = {'score': 5, 'status': 'needs_improvement'}
    
    # Investment/Savings (20 points)
    savings_to_income_ratio = (savings / (income * 12) * 100) if income > 0 else 0
    if savings_to_income_ratio >= 100:
        score += 20
        breakdown['investments'] = {'score': 20, 'status': 'excellent'}
    elif savings_to_income_ratio >= 50:
        score += 15
        breakdown['investments'] = {'score': 15, 'status': 'good'}
    else:
        score += 5
        breakdown['investments'] = {'score': 5, 'status': 'needs_improvement'}
    
    # Generate recommendations
    recommendations = []
    
    if savings_rate < 20:
        recommendations.append("💰 মাসিক আয়ের অন্তত ২০% সেভ করার চেষ্টা করুন")
    
    if emergency_fund < required_emergency:
        recommendations.append(f"🚨 ইমার্জেন্সি ফান্ড বাড়ান (লক্ষ্য: ৳{required_emergency:.0f})")
    
    if debt_ratio > 30:
        recommendations.append("⚠️ ঋণ কমানোর পরিকল্পনা করুন")
    
    if savings_to_income_ratio < 50:
        recommendations.append("📈 বিনিয়োগ শুরু করুন অথবা বাড়ান")
    
    return {
        'overall_score': score,
        'grade': _get_grade(score),
        'breakdown': breakdown,
        'recommendations': recommendations
    }


def _get_grade(score: int) -> str:
    """Convert score to grade"""
    if score >= 80:
        return 'A (Excellent)'
    elif score >= 60:
        return 'B (Good)'
    elif score >= 40:
        return 'C (Fair)'
    else:
        return 'D (Needs Improvement)'
