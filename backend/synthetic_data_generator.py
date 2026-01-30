"""
Synthetic Finance Data Generator
Generates realistic personal finance data for testing and ML training
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from typing import List, Dict
import json


class SyntheticFinanceDataGenerator:
    """Generate synthetic personal finance data"""
    
    def __init__(self):
        self.categories = [
            'Food', 'Transport', 'Shopping', 'Rent', 'Utilities',
            'Entertainment', 'Health', 'Education', 'Bills', 'Other'
        ]
        
        self.cities_bd = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal']
        
        self.merchants_bd = [
            'Daraz', 'Foodpanda', 'Pathao', 'Bkash', 'Nagad', 'Rocket',
            'Aarong', 'Bata', 'Unimart', 'Shwapno', 'Bengal Meat',
            'Pran', 'ACI', 'Square Pharmacy', 'Agora'
        ]
        
        self.payment_methods = ['Card', 'Mobile Banking', 'Cash', 'Bank Transfer']
    
    def generate_personal_finance_data(self, num_users: int = 100, months: int = 12) -> pd.DataFrame:
        """Generate synthetic personal finance data for multiple users"""
        
        data = []
        
        for user_id in range(1, num_users + 1):
            # Generate user profile
            age = random.randint(22, 60)
            base_income = self._generate_income_by_age(age)
            city = random.choice(self.cities_bd)
            marital_status = random.choice(['Single', 'Married', 'Divorced'])
            dependents = random.randint(0, 4) if marital_status == 'Married' else random.randint(0, 1)
            
            for month in range(1, months + 1):
                # Add monthly variations
                income = base_income * random.uniform(0.95, 1.05)
                bonus = base_income * random.uniform(0.5, 2.0) if month == 12 else 0  # Year-end bonus
                
                # Generate expenses based on income
                expenses = self._generate_expenses(income, dependents, city)
                
                total_expenses = sum(expenses.values())
                net_savings = income + bonus - total_expenses
                savings_rate = (net_savings / income * 100) if income > 0 else 0
                
                data.append({
                    'user_id': f'USER{user_id:04d}',
                    'month': month,
                    'year': 2025,
                    'age': age,
                    'city': city,
                    'marital_status': marital_status,
                    'dependents': dependents,
                    'monthly_income': round(income, 2),
                    'bonus': round(bonus, 2),
                    'expense_rent': round(expenses['rent'], 2),
                    'expense_food': round(expenses['food'], 2),
                    'expense_transport': round(expenses['transport'], 2),
                    'expense_utilities': round(expenses['utilities'], 2),
                    'expense_education': round(expenses['education'], 2),
                    'expense_healthcare': round(expenses['healthcare'], 2),
                    'expense_entertainment': round(expenses['entertainment'], 2),
                    'expense_shopping': round(expenses['shopping'], 2),
                    'expense_other': round(expenses['other'], 2),
                    'total_expenses': round(total_expenses, 2),
                    'net_savings': round(net_savings, 2),
                    'savings_rate': round(savings_rate, 2)
                })
        
        return pd.DataFrame(data)
    
    def generate_transaction_data(self, num_transactions: int = 10000) -> pd.DataFrame:
        """Generate synthetic transaction data"""
        
        transactions = []
        start_date = datetime(2025, 1, 1)
        
        for i in range(num_transactions):
            # 20% are income transactions
            is_income = random.random() < 0.2
            
            if is_income:
                amount = random.randint(20000, 150000)
                category = random.choice(['Salary', 'Freelance', 'Business Income', 'Investment Return', 'Bonus'])
                merchant = 'Bank Transfer'
                transaction_type = 'Credit'
            else:
                amount = random.randint(50, 25000)
                category = random.choice(self.categories)
                merchant = random.choice(self.merchants_bd)
                transaction_type = 'Debit'
            
            # Generate random date within the year
            days_offset = random.randint(0, 365)
            transaction_date = start_date + timedelta(days=days_offset)
            
            transactions.append({
                'transaction_id': f'TXN{i:08d}',
                'date': transaction_date.strftime('%Y-%m-%d'),
                'time': f"{random.randint(0, 23):02d}:{random.randint(0, 59):02d}",
                'amount': amount,
                'category': category,
                'merchant': merchant,
                'transaction_type': transaction_type,
                'payment_method': random.choice(self.payment_methods),
                'city': random.choice(self.cities_bd),
                'description': self._generate_description(category, merchant)
            })
        
        return pd.DataFrame(transactions)
    
    def generate_financial_goals_data(self, num_users: int = 100) -> pd.DataFrame:
        """Generate synthetic financial goals data"""
        
        goal_types = [
            ('Emergency Fund', 'savings', 50000, 300000),
            ('House Down Payment', 'purchase', 500000, 2000000),
            ('Car Purchase', 'purchase', 300000, 1500000),
            ('Retirement Fund', 'savings', 1000000, 5000000),
            ('Education Fund', 'savings', 200000, 1000000),
            ('Vacation', 'purchase', 50000, 200000),
            ('Wedding', 'purchase', 200000, 800000),
            ('Debt Payoff', 'debt_payoff', 100000, 500000)
        ]
        
        goals = []
        
        for user_id in range(1, num_users + 1):
            num_goals = random.randint(1, 4)
            user_goals = random.sample(goal_types, num_goals)
            
            for goal_name, category, min_amount, max_amount in user_goals:
                target_amount = random.randint(min_amount, max_amount)
                current_amount = random.randint(0, int(target_amount * 0.8))
                monthly_contribution = random.randint(1000, 20000)
                
                months_to_deadline = random.randint(6, 60)
                deadline = (datetime.now() + timedelta(days=months_to_deadline * 30)).strftime('%Y-%m-%d')
                
                goals.append({
                    'user_id': f'USER{user_id:04d}',
                    'goal_name': goal_name,
                    'category': category,
                    'target_amount': target_amount,
                    'current_amount': current_amount,
                    'monthly_contribution': monthly_contribution,
                    'deadline': deadline,
                    'priority': random.randint(1, 5),
                    'status': 'active',
                    'progress_percentage': round((current_amount / target_amount * 100), 2)
                })
        
        return pd.DataFrame(goals)
    
    def generate_investment_data(self, num_users: int = 100) -> pd.DataFrame:
        """Generate synthetic investment portfolio data"""
        
        investment_types = [
            ('Stocks', 5000, 500000),
            ('Bonds', 10000, 300000),
            ('Mutual Funds', 5000, 400000),
            ('Fixed Deposits', 50000, 1000000),
            ('Gold', 10000, 200000),
            ('Real Estate', 500000, 5000000)
        ]
        
        investments = []
        
        for user_id in range(1, num_users + 1):
            num_investments = random.randint(1, 4)
            user_investments = random.sample(investment_types, num_investments)
            
            for inv_type, min_amount, max_amount in user_investments:
                amount_invested = random.randint(min_amount, max_amount)
                returns = random.uniform(-10, 25)  # -10% to +25% returns
                current_value = amount_invested * (1 + returns / 100)
                
                purchase_date = datetime.now() - timedelta(days=random.randint(30, 1095))
                
                investments.append({
                    'user_id': f'USER{user_id:04d}',
                    'investment_type': inv_type,
                    'asset_name': f'{inv_type} Portfolio',
                    'amount_invested': round(amount_invested, 2),
                    'current_value': round(current_value, 2),
                    'returns_percentage': round(returns, 2),
                    'purchase_date': purchase_date.strftime('%Y-%m-%d'),
                    'platform': random.choice(['Stock Broker', 'Bank', 'Mutual Fund House', 'Direct'])
                })
        
        return pd.DataFrame(investments)
    
    def _generate_income_by_age(self, age: int) -> float:
        """Generate realistic income based on age"""
        if age < 25:
            return random.randint(20000, 40000)
        elif age < 35:
            return random.randint(35000, 80000)
        elif age < 45:
            return random.randint(60000, 150000)
        else:
            return random.randint(80000, 200000)
    
    def _generate_expenses(self, income: float, dependents: int, city: str) -> Dict[str, float]:
        """Generate realistic expense distribution"""
        
        # City-based multipliers
        city_multiplier = {
            'Dhaka': 1.0,
            'Chittagong': 0.85,
            'Sylhet': 0.75,
            'Khulna': 0.70,
            'Rajshahi': 0.70,
            'Barisal': 0.65
        }
        
        multiplier = city_multiplier.get(city, 0.75)
        
        # Base percentages
        expenses = {
            'rent': income * random.uniform(0.20, 0.35) * multiplier,
            'food': income * random.uniform(0.15, 0.25) * (1 + dependents * 0.1),
            'transport': income * random.uniform(0.05, 0.12),
            'utilities': income * random.uniform(0.03, 0.08),
            'education': income * random.uniform(0.02, 0.15) * dependents,
            'healthcare': income * random.uniform(0.02, 0.06) * (1 + dependents * 0.05),
            'entertainment': income * random.uniform(0.03, 0.10),
            'shopping': income * random.uniform(0.02, 0.08),
            'other': income * random.uniform(0.01, 0.05)
        }
        
        return expenses
    
    def _generate_description(self, category: str, merchant: str) -> str:
        """Generate realistic transaction description"""
        descriptions = {
            'Food': f'Food purchase at {merchant}',
            'Transport': f'Transport via {merchant}',
            'Shopping': f'Shopping at {merchant}',
            'Rent': 'Monthly rent payment',
            'Utilities': 'Utility bill payment',
            'Entertainment': f'Entertainment at {merchant}',
            'Health': f'Healthcare service at {merchant}',
            'Education': 'Education fee payment',
            'Bills': 'Bill payment',
            'Salary': 'Monthly salary credit',
            'Freelance': 'Freelance income',
            'Business Income': 'Business revenue',
            'Investment Return': 'Investment return credit',
            'Bonus': 'Performance bonus'
        }
        return descriptions.get(category, f'Transaction at {merchant}')
    
    def save_all_datasets(self, output_dir: str = 'data'):
        """Generate and save all datasets"""
        import os
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        print("🔄 Generating Personal Finance Data...")
        personal_df = self.generate_personal_finance_data(num_users=500, months=24)
        personal_df.to_csv(f'{output_dir}/personal_finance_data.csv', index=False)
        print(f"✅ Generated {len(personal_df)} personal finance records")
        
        print("\n🔄 Generating Transaction Data...")
        transaction_df = self.generate_transaction_data(num_transactions=50000)
        transaction_df.to_csv(f'{output_dir}/transaction_data.csv', index=False)
        print(f"✅ Generated {len(transaction_df)} transaction records")
        
        print("\n🔄 Generating Financial Goals Data...")
        goals_df = self.generate_financial_goals_data(num_users=500)
        goals_df.to_csv(f'{output_dir}/financial_goals_data.csv', index=False)
        print(f"✅ Generated {len(goals_df)} financial goals")
        
        print("\n🔄 Generating Investment Data...")
        investment_df = self.generate_investment_data(num_users=500)
        investment_df.to_csv(f'{output_dir}/investment_data.csv', index=False)
        print(f"✅ Generated {len(investment_df)} investment records")
        
        # Generate summary statistics
        print("\n📊 Dataset Summary:")
        print(f"  - Total Users: 500")
        print(f"  - Personal Finance Records: {len(personal_df)}")
        print(f"  - Transaction Records: {len(transaction_df)}")
        print(f"  - Financial Goals: {len(goals_df)}")
        print(f"  - Investment Records: {len(investment_df)}")
        
        # Save summary
        summary = {
            'generated_at': datetime.now().isoformat(),
            'total_users': 500,
            'datasets': {
                'personal_finance': len(personal_df),
                'transactions': len(transaction_df),
                'financial_goals': len(goals_df),
                'investments': len(investment_df)
            },
            'income_stats': {
                'mean': float(personal_df['monthly_income'].mean()),
                'median': float(personal_df['monthly_income'].median()),
                'min': float(personal_df['monthly_income'].min()),
                'max': float(personal_df['monthly_income'].max())
            },
            'expense_stats': {
                'mean': float(personal_df['total_expenses'].mean()),
                'median': float(personal_df['total_expenses'].median())
            },
            'savings_rate_mean': float(personal_df['savings_rate'].mean())
        }
        
        with open(f'{output_dir}/dataset_summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n✅ All datasets saved to '{output_dir}/' directory")
        print(f"✅ Summary saved to '{output_dir}/dataset_summary.json'")
        
        return {
            'personal_finance': personal_df,
            'transactions': transaction_df,
            'financial_goals': goals_df,
            'investments': investment_df
        }


def main():
    """Main function to generate all data"""
    print("=" * 60)
    print("   Synthetic Finance Data Generator")
    print("=" * 60)
    print()
    
    generator = SyntheticFinanceDataGenerator()
    datasets = generator.save_all_datasets(output_dir='backend/data')
    
    print("\n" + "=" * 60)
    print("   Sample Data Preview")
    print("=" * 60)
    
    print("\n📊 Personal Finance Data (First 5 rows):")
    print(datasets['personal_finance'].head())
    
    print("\n💳 Transaction Data (First 5 rows):")
    print(datasets['transactions'].head())
    
    print("\n🎯 Financial Goals (First 5 rows):")
    print(datasets['financial_goals'].head())
    
    print("\n📈 Investment Data (First 5 rows):")
    print(datasets['investments'].head())
    
    print("\n✅ Data generation complete!")


if __name__ == "__main__":
    main()
