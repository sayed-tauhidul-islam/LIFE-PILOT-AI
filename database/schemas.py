# MongoDB Schema Definitions for Life Pilot AI Agent
# These schemas are used for documentation and validation

USER_SCHEMA = {
    "name": str,  # Required: User's full name
    "age": int,  # Required: User's age
    "email": str,  # Optional: User's email address
    "monthlyIncome": float,  # Required: Monthly income
    "familySize": int,  # Required: Number of family members
    "location": {
        "city": str,
        "country": str,
        "latitude": float,
        "longitude": float
    },
    "preferences": {
        "theme": str,  # Options: 'light', 'dark', 'blue'
        "language": str,
        "prayerNotifications": bool
    },
    "created_at": "datetime",
    "updated_at": "datetime"
}

ROUTINE_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "type": str,  # Required: 'student', 'professional', or 'family'
    "title": str,  # Required: Routine title
    "schedule": list,  # Required: List of scheduled activities
    "tips": list,  # Optional: Tips for the routine
    "active": bool,  # Whether this routine is currently active
    "created_at": "datetime"
}

MEETING_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "title": str,  # Required: Meeting title
    "description": str,  # Optional: Meeting description
    "date": str,  # Required: Meeting date (YYYY-MM-DD)
    "time": str,  # Required: Meeting time (HH:MM)
    "location": str,  # Optional: Meeting location
    "attendees": list,  # Optional: List of attendee names
    "reminder": bool,  # Whether to send reminder
    "created_at": "datetime"
}

INCOME_SOURCE_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "source_type": str,  # Required: 'salary', 'freelance', 'business', 'investment', 'other'
    "amount": float,  # Required: Income amount
    "frequency": str,  # Required: 'monthly', 'weekly', 'one-time', 'yearly'
    "category": str,  # Required: Income category
    "description": str,  # Optional: Description of income source
    "date": "datetime",  # When income is received
    "created_at": "datetime",
    "updated_at": "datetime"
}

EXPENSE_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "amount": float,  # Required: Expense amount
    "category": str,  # Required: 'Food', 'Transport', 'Shopping', 'Rent', 'Utilities', 'Entertainment', etc.
    "description": str,  # Optional: Expense description
    "date": str,  # Required: Expense date (YYYY-MM-DD)
    "payment_method": str,  # Optional: 'Cash', 'Card', 'Bank Transfer', etc.
    "is_recurring": bool,  # Whether this is a recurring expense
    "tags": list,  # Optional: Tags for categorization
    "created_at": "datetime",
    "updated_at": "datetime"
}

FINANCIAL_GOAL_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "goal_name": str,  # Required: Name of the goal ('Emergency Fund', 'House', 'Car', 'Vacation', etc.)
    "target_amount": float,  # Required: Target amount to achieve
    "current_amount": float,  # Required: Current progress amount
    "deadline": str,  # Required: Goal deadline (YYYY-MM-DD)
    "priority": int,  # Required: Priority (1-5, 1 being highest)
    "monthly_contribution": float,  # Optional: Planned monthly contribution
    "category": str,  # Required: 'savings', 'investment', 'debt_payoff', 'purchase'
    "status": str,  # Required: 'active', 'completed', 'abandoned'
    "created_at": "datetime",
    "updated_at": "datetime"
}

INVESTMENT_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "investment_type": str,  # Required: 'stocks', 'bonds', 'mutual_funds', 'fixed_deposits', 'gold', 'real_estate'
    "asset_name": str,  # Required: Name of the asset
    "amount_invested": float,  # Required: Initial investment amount
    "current_value": float,  # Current market value
    "purchase_date": str,  # Required: Purchase date (YYYY-MM-DD)
    "quantity": float,  # For stocks/funds: number of units
    "platform": str,  # Optional: Investment platform or broker
    "returns": float,  # Optional: Current returns percentage
    "notes": str,  # Optional: Additional notes
    "created_at": "datetime",
    "updated_at": "datetime"
}

BUDGET_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "month": str,  # Required: Budget month (YYYY-MM)
    "total_income": float,  # Required: Total monthly income
    "total_expenses": float,  # Calculated: Total expenses for the month
    "net_savings": float,  # Calculated: Income - Expenses
    "category_budgets": {
        "rent": float,
        "food": float,
        "transport": float,
        "utilities": float,
        "entertainment": float,
        "shopping": float,
        "health": float,
        "education": float,
        "savings": float,
        "other": float
    },
    "actual_spending": dict,  # Actual spending per category
    "variance": dict,  # Budget vs Actual variance per category
    "created_at": "datetime",
    "updated_at": "datetime"
}

USERS_FINANCE_PROFILE_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "total_income": float,  # Total income across all sources
    "total_expenses": float,  # Total monthly expenses
    "net_savings": float,  # Total savings
    "total_debt": float,  # Total outstanding debt
    "emergency_fund": float,  # Emergency fund amount
    "risk_profile": str,  # 'conservative', 'moderate', 'aggressive'
    "investment_horizon": int,  # Investment horizon in years
    "income_stable": bool,  # Whether income is stable
    "dependents": int,  # Number of dependents
    "financial_health_score": int,  # Score from 0-100
    "last_analysis_date": "datetime",
    "created_at": "datetime",
    "updated_at": "datetime"
}

SAVINGS_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "account_type": str,  # Required: 'bank', 'stocks', 'mutual_funds', 'fixed_deposit', 'cash'
    "account_name": str,  # Required: Name/identifier of the account
    "balance": float,  # Required: Current balance
    "interest_rate": float,  # Optional: Interest rate if applicable
    "maturity_date": str,  # Optional: Maturity date for FDs (YYYY-MM-DD)
    "liquidity": str,  # 'high', 'medium', 'low'
    "institution": str,  # Optional: Bank or institution name
    "created_at": "datetime",
    "updated_at": "datetime"
}

TASK_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "title": str,  # Required: Task title
    "description": str,  # Optional: Task description
    "priority": str,  # Required: 'low', 'medium', 'high'
    "status": str,  # Required: 'pending', 'in-progress', 'completed', 'cancelled'
    "date": str,  # Required: Task date (YYYY-MM-DD)
    "time": str,  # Optional: Task time (HH:MM)
    "completed": bool,  # Whether task is completed
    "created_at": "datetime"
}

PRAYER_TIME_SCHEMA = {
    "user_id": str,  # Required: Reference to user
    "date": str,  # Required: Date (YYYY-MM-DD)
    "times": {
        "fajr": str,  # Required: Fajr prayer time
        "dhuhr": str,  # Required: Dhuhr prayer time
        "asr": str,  # Required: Asr prayer time
        "maghrib": str,  # Required: Maghrib prayer time
        "isha": str  # Required: Isha prayer time
    },
    "location": {
        "city": str,
        "country": str,
        "latitude": float,
        "longitude": float
    },
    "created_at": "datetime"
}

# Validation functions
def validate_user(data):
    """Validate user data"""
    required_fields = ["name", "age", "monthlyIncome", "familySize"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if not isinstance(data["age"], int) or data["age"] < 1:
        raise ValueError("Age must be a positive integer")
    
    if not isinstance(data["familySize"], int) or data["familySize"] < 1:
        raise ValueError("Family size must be a positive integer")
    
    return True

def validate_routine(data):
    """Validate routine data"""
    required_fields = ["user_id", "type", "title", "schedule"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if data["type"] not in ["student", "professional", "family"]:
        raise ValueError("Type must be 'student', 'professional', or 'family'")
    
    return True

def validate_expense(data):
    """Validate expense data"""
    required_fields = ["user_id", "amount", "category", "date"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    valid_categories = ["Food", "Transport", "Shopping", "Rent", "Utilities", "Bills", "Entertainment", "Health", "Education", "Other"]
    if data["category"] not in valid_categories:
        raise ValueError(f"Category must be one of: {', '.join(valid_categories)}")
    
    return True

def validate_financial_goal(data):
    """Validate financial goal data"""
    required_fields = ["user_id", "goal_name", "target_amount", "deadline", "priority", "category", "status"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if data["category"] not in ["savings", "investment", "debt_payoff", "purchase"]:
        raise ValueError("Category must be 'savings', 'investment', 'debt_payoff', or 'purchase'")
    
    if data["priority"] not in range(1, 6):
        raise ValueError("Priority must be between 1 and 5")
    
    return True

def validate_investment(data):
    """Validate investment data"""
    required_fields = ["user_id", "investment_type", "asset_name", "amount_invested", "purchase_date"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    valid_types = ["stocks", "bonds", "mutual_funds", "fixed_deposits", "gold", "real_estate"]
    if data["investment_type"] not in valid_types:
        raise ValueError(f"Investment type must be one of: {', '.join(valid_types)}")
    
    return True

def validate_task(data):
    """Validate task data"""
    required_fields = ["user_id", "title", "priority", "date"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if data["priority"] not in ["low", "medium", "high"]:
        raise ValueError("Priority must be 'low', 'medium', or 'high'")
    
    return True
