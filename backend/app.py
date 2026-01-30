from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
import io
from datetime import datetime
from database import Database
from ai_advisor import AIAdvisor
from file_manager import FileManager
from auth_manager import AuthManager
from finance_manager import (
    BudgetAI, ExpensePredictor, InvestmentAdvisor, 
    FinancialGoalTracker, generate_financial_health_score
)
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize database, AI advisor, file manager, auth manager, and finance managers
db = Database()
ai_advisor = AIAdvisor()
file_manager = FileManager()
auth_manager = AuthManager()
budget_ai = BudgetAI()
expense_predictor = ExpensePredictor()
investment_advisor = InvestmentAdvisor()
goal_tracker = FinancialGoalTracker()

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'pdf', 'xlsx', 'xls', 'xlsm', 'doc', 'docx', 'odt',
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
    'csv', 'tsv', 'txt', 'md', 'ppt', 'pptx', 'zip', 'rar'
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Life Pilot AI Agent is running',
        'timestamp': datetime.now().isoformat()
    })

# ===================== AUTHENTICATION ENDPOINTS =====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.json
        full_name = data.get('full_name', '').strip()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not all([full_name, username, email, password]):
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        success, message, user_data = auth_manager.register_user(
            full_name=full_name,
            username=username,
            email=email,
            password=password,
            is_guest=False
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user_data
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Registration error: {str(e)}'
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        email = data.get('email', '').strip()
        password = data.get('password', '')
        remember_me = data.get('remember_me', False)
        
        if not all([email, password]):
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        success, message, user_data = auth_manager.login_user(
            email=email,
            password=password,
            remember_me=remember_me
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user_data
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login error: {str(e)}'
        }), 500

@app.route('/api/auth/guest', methods=['POST'])
def create_guest():
    """Create guest user"""
    try:
        success, message, user_data = auth_manager.register_user(
            full_name='',
            username='',
            email='',
            password='',
            is_guest=True
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user_data
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Guest creation error: {str(e)}'
        }), 500

@app.route('/api/auth/validate-email', methods=['POST'])
def validate_email():
    """Validate email format"""
    try:
        data = request.json
        email = data.get('email', '').strip()
        
        is_valid = auth_manager.validate_email(email)
        
        return jsonify({
            'success': True,
            'valid': is_valid,
            'message': 'Valid email' if is_valid else 'Invalid email format'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/auth/validate-password', methods=['POST'])
def validate_password():
    """Validate password strength"""
    try:
        data = request.json
        password = data.get('password', '')
        
        is_valid, message, strength = auth_manager.validate_password_strength(password)
        
        return jsonify({
            'success': True,
            'valid': is_valid,
            'message': message,
            'strength': strength
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    try:
        user = auth_manager.get_user_by_id(user_id)
        if user:
            return jsonify({
                'success': True,
                'user': user
            })
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ===================== USER PROFILE ENDPOINTS =====================

@app.route('/api/user/profile', methods=['POST'])
def create_user_profile():
    """Create or update user profile"""
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID is required'
            }), 400
        
        # Verify user exists
        if not auth_manager.validate_user_id(user_id):
            return jsonify({
                'success': False,
                'message': 'Invalid user ID'
            }), 404
        
        # Update profile data
        profile_data = {k: v for k, v in data.items() if k != 'user_id'}
        success = auth_manager.update_user_profile_data(user_id, profile_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'User profile saved successfully',
                'user_id': user_id
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update profile'
            }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/user/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Get user profile by ID"""
    try:
        profile = db.get_user_profile(user_id)
        if profile:
            return jsonify({
                'success': True,
                'data': profile
            })
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/advice/daily', methods=['GET'])
def get_daily_advice():
    """Get AI-powered daily advice"""
    try:
        user_id = request.args.get('user_id')
        
        # Generate daily advice
        advice = ai_advisor.generate_daily_advice(user_id)
        
        return jsonify({
            'success': True,
            'data': advice
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/routine/create', methods=['POST'])
def create_routine():
    """Create a personalized routine"""
    try:
        data = request.json
        user_id = data.get('user_id')
        routine_type = data.get('type')  # student, professional, family
        
        # Generate routine based on user data
        routine = ai_advisor.create_routine(user_id, routine_type)
        
        # Save routine to database
        routine_id = db.save_routine(routine)
        
        return jsonify({
            'success': True,
            'message': 'Routine created successfully',
            'data': routine,
            'routine_id': str(routine_id)
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/financial/analysis', methods=['GET'])
def financial_analysis():
    """Get financial analysis and saving tips"""
    try:
        user_id = request.args.get('user_id')
        
        # Get user financial data
        user_profile = db.get_user_profile(user_id)
        expenses = db.get_user_expenses(user_id)
        
        # Analyze and provide tips
        analysis = ai_advisor.analyze_finances(user_profile, expenses)
        
        return jsonify({
            'success': True,
            'data': analysis
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/tasks/today', methods=['GET'])
def get_today_tasks():
    """Get today's tasks based on meetings, weather, and priorities"""
    try:
        user_id = request.args.get('user_id')
        
        # Get tasks for today
        tasks = ai_advisor.generate_today_tasks(user_id)
        
        return jsonify({
            'success': True,
            'data': tasks
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/meeting/add', methods=['POST'])
def add_meeting():
    """Add a meeting or important event"""
    try:
        data = request.json
        meeting_id = db.save_meeting(data)
        
        return jsonify({
            'success': True,
            'message': 'Meeting added successfully',
            'meeting_id': str(meeting_id)
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/analysis/comprehensive', methods=['GET'])
def get_comprehensive_analysis():
    """Get comprehensive AI analysis of user data"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        # Get user data
        user_profile = db.get_user_profile(user_id)
        if not user_profile:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Get expenses, tasks, and meetings
        expenses = db.get_user_expenses(user_id)
        tasks = db.get_user_tasks(user_id)
        today = datetime.now().strftime('%Y-%m-%d')
        meetings = db.get_user_meetings(user_id, today)
        
        # Generate comprehensive AI analysis
        from data_analyzer import UserDataAnalyzer
        analyzer = UserDataAnalyzer()
        
        insights = analyzer.generate_personalized_insights(
            user_profile, expenses, tasks, meetings
        )
        
        return jsonify({
            'success': True,
            'data': insights,
            'generated_at': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/analysis/spending', methods=['GET'])
def analyze_spending():
    """Analyze user spending patterns with AI"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        expenses = db.get_user_expenses(user_id)
        
        from data_analyzer import UserDataAnalyzer
        analyzer = UserDataAnalyzer()
        analysis = analyzer.analyze_spending_patterns(expenses)
        
        return jsonify({
            'success': True,
            'data': analysis
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/api/analysis/predict-expenses', methods=['GET'])
def predict_expenses_analysis():
    """Predict next month's expenses using AI"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        expenses = db.get_user_expenses(user_id)
        
        from data_analyzer import UserDataAnalyzer
        analyzer = UserDataAnalyzer()
        prediction = analyzer.predict_monthly_expenses(expenses)
        
        return jsonify({
            'success': True,
            'data': prediction
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

# ==================== FILE MANAGEMENT ENDPOINTS ====================

@app.route('/api/files/upload', methods=['POST'])
def upload_file():
    """Upload a file"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No file provided'
            }), 400
        
        file = request.files['file']
        user_id = request.form.get('user_id')
        custom_name = request.form.get('custom_name')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        # Check if file has a filename
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'No file selected'
            }), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'message': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        # Read file data
        file_data = file.read()
        
        # Upload file
        metadata = file_manager.upload_file(
            user_id=user_id,
            file_data=file_data,
            original_filename=secure_filename(file.filename),
            custom_name=custom_name
        )
        
        return jsonify({
            'success': True,
            'message': 'File uploaded successfully',
            'data': metadata
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/files/search', methods=['GET'])
def search_files():
    """Search files with filters"""
    try:
        user_id = request.args.get('user_id')
        query = request.args.get('query', '')
        file_type = request.args.get('file_type')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        sort_by = request.args.get('sort_by', 'upload_date')
        sort_order = int(request.args.get('sort_order', '-1'))
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        # Search files
        results = file_manager.search_files(
            user_id=user_id,
            query=query if query else None,
            file_type=file_type,
            start_date=start_date,
            end_date=end_date,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return jsonify({
            'success': True,
            'data': results,
            'count': len(results)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/files/list', methods=['GET'])
def list_files():
    """List all files for a user"""
    try:
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        files = file_manager.get_user_files(user_id, limit, skip)
        
        return jsonify({
            'success': True,
            'data': files,
            'count': len(files)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/files/download/<metadata_id>', methods=['GET'])
def download_file(metadata_id):
    """Download a file"""
    try:
        # Get metadata
        metadata = file_manager.get_file_metadata(metadata_id)
        if not metadata:
            return jsonify({
                'success': False,
                'message': 'File not found'
            }), 404
        
        # Get file from GridFS
        file_data, content_type, filename = file_manager.get_file(metadata['file_id'])
        
        if file_data is None:
            return jsonify({
                'success': False,
                'message': 'File data not found'
            }), 404
        
        # Send file
        return send_file(
            io.BytesIO(file_data),
            mimetype=content_type,
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/files/<metadata_id>', methods=['DELETE'])
def delete_file(metadata_id):
    """Delete a file"""
    try:
        success = file_manager.delete_file(metadata_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'File deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete file'
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/files/<metadata_id>', methods=['PUT'])
def update_file_metadata(metadata_id):
    """Update file metadata"""
    try:
        data = request.get_json()
        
        # Only allow updating certain fields
        allowed_updates = {}
        if 'custom_name' in data:
            allowed_updates['custom_name'] = data['custom_name']
        if 'description' in data:
            allowed_updates['description'] = data['description']
        if 'tags' in data:
            allowed_updates['tags'] = data['tags']
        
        success = file_manager.update_file_metadata(metadata_id, allowed_updates)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'File metadata updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update file metadata'
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ===================== FINANCE MANAGEMENT ENDPOINTS =====================

@app.route('/api/finance/profile', methods=['GET', 'POST'])
def finance_profile():
    """Get or update user's finance profile"""
    try:
        if request.method == 'GET':
            user_id = request.args.get('user_id', 'demo_user')
            
            profile = db.get_user_finance_profile(user_id)
            
            if not profile:
                # Return empty profile
                return jsonify({
                    'total_income': 0,
                    'total_expenses': 0,
                    'net_savings': 0,
                    'savings_rate': 0
                })
            
            return jsonify(profile)
        
        elif request.method == 'POST':
            data = request.json
            user_id = data.get('user_id', 'demo_user')
            total_income = float(data.get('total_income', 0))
            
            # Update or create finance profile
            profile_data = {
                'user_id': user_id,
                'total_income': total_income,
                'updated_at': datetime.now()
            }
            
            # Save to database
            result = db.update_user_finance_profile(user_id, profile_data)
            
            return jsonify({
                'success': True,
                'message': 'Income updated successfully',
                'profile': profile_data
            }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Note: Regular expenses endpoints are now defined in the DAILY COST TRACKER section below

@app.route('/api/finance/goals', methods=['GET'])
def get_financial_goals():
    """Get user's financial goals"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        
        goals = db.get_financial_goals(user_id)
        
        return jsonify({
            'success': True,
            'goals': goals
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/goal', methods=['POST'])
def add_financial_goal():
    """Add new financial goal"""
    try:
        data = request.json
        user_id = data.get('user_id', 'demo_user')
        
        goal_data = {
            'user_id': user_id,
            'goal_name': data.get('goal_name'),
            'target_amount': float(data.get('target_amount', 0)),
            'current_amount': float(data.get('current_amount', 0)),
            'deadline': data.get('deadline'),
            'priority': int(data.get('priority', 3)),
            'monthly_contribution': float(data.get('monthly_contribution', 0)),
            'category': data.get('category', 'savings'),
            'status': 'active',
            'created_at': datetime.now()
        }
        
        result = db.add_financial_goal(goal_data)
        
        return jsonify({
            'success': True,
            'message': 'Financial goal added successfully',
            'goal': goal_data
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/ai-suggestions', methods=['POST'])
def get_ai_financial_suggestions():
    """Get AI-powered financial suggestions"""
    try:
        data = request.json
        income = float(data.get('income', 0))
        expenses = float(data.get('expenses', 0))
        age = int(data.get('age', 25))
        risk_tolerance = data.get('risk_tolerance', 'moderate')
        
        suggestions = []
        
        # Calculate savings rate
        if income > 0:
            savings_rate = ((income - expenses) / income) * 100
            
            if savings_rate < 20:
                suggestions.append("⚠️ আপনার সেভিংস রেট কম। মাসিক আয়ের অন্তত ২০% সেভ করুন।")
            
            if expenses > income * 0.7:
                suggestions.append("💰 আপনার খরচ বেশি। আননেসেসারি খরচ কমাতে চেষ্টা করুন।")
        
        # Investment suggestions based on age
        if age < 30:
            suggestions.append("📈 আপনার বয়স কম, রিস্ক নিতে পারেন। স্টক মার্কেটে বিনিয়োগ চেষ্টা করুন।")
        elif age < 50:
            suggestions.append("⚖️ ব্যালেন্সড পোর্টফোলিও তৈরি করুন। স্টক এবং ফিক্সড ডিপোজিট মিক্স করুন।")
        else:
            suggestions.append("🛡️ নিরাপদ বিনিয়োগ করুন। সরকারি বন্ড এবং ফিক্সড ডিপোজিট অগ্রাধিকার দিন।")
        
        # Emergency fund
        emergency_fund_needed = expenses * 6
        suggestions.append(f"🚨 ইমার্জেন্সি ফান্ড তৈরি করুন। লক্ষ্য: ৳{emergency_fund_needed:,.0f} (৬ মাসের খরচ)")
        
        # Generate health score
        health_score = generate_financial_health_score({
            'income': income,
            'expenses': expenses,
            'savings': income * 12,  # Rough estimate
            'debt': 0,
            'emergency_fund': emergency_fund_needed * 0.5
        })
        
        return jsonify({
            'suggestions': suggestions,
            'health_score': health_score,
            'suggested_budget': {
                'necessities': income * 0.5,
                'savings': income * 0.2,
                'lifestyle': income * 0.3
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/budget-recommendation', methods=['POST'])
def get_budget_recommendation():
    """Get AI budget recommendation"""
    try:
        data = request.json
        user_data = {
            'income': float(data.get('income', 0)),
            'age': int(data.get('age', 25)),
            'city': data.get('city', 'Dhaka'),
            'family_size': int(data.get('family_size', 1)),
            'existing_expenses': data.get('existing_expenses', {})
        }
        
        recommendation = budget_ai.recommend_budget(user_data)
        
        return jsonify(recommendation)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/investment-advice', methods=['POST'])
def get_investment_advice():
    """Get AI investment advice"""
    try:
        data = request.json
        user_data = data.get('user_data', {})
        investment_amount = float(data.get('investment_amount', 0))
        
        recommendation = investment_advisor.recommend_portfolio(user_data, investment_amount)
        
        return jsonify(recommendation)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/expense-prediction', methods=['POST'])
def predict_expenses_finance():
    """Predict future expenses"""
    try:
        data = request.json
        historical_data = data.get('historical_data', [])
        
        prediction = expense_predictor.predict_next_month(historical_data)
        
        return jsonify(prediction)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/goal-progress/<goal_id>', methods=['GET'])
def get_goal_progress(goal_id):
    """Get financial goal progress"""
    try:
        goal = db.get_financial_goal(goal_id)
        
        if not goal:
            return jsonify({
                'success': False,
                'message': 'Goal not found'
            }), 404
        
        progress = goal_tracker.calculate_goal_progress(goal)
        
        return jsonify({
            'success': True,
            'progress': progress
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/files/statistics', methods=['GET'])
def get_file_statistics():
    """Get file statistics for a user"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID required'
            }), 400
        
        stats = file_manager.get_file_statistics(user_id)
        
        return jsonify({
            'success': True,
            'data': stats
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ============================================================================
# DAILY COST TRACKER ENDPOINTS (NEW)
# ============================================================================

# In-memory storage for daily expenses (for demo purposes)
daily_expenses_store = []
regular_expenses_store = []

@app.route('/api/finance/expenses', methods=['GET'])
def get_expenses():
    """Get user's expenses"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        
        # Filter expenses by user_id
        user_expenses = [exp for exp in regular_expenses_store if exp.get('user_id') == user_id]
        
        return jsonify({
            'success': True,
            'expenses': user_expenses
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/expense', methods=['POST'])
def add_expense():
    """Add new expense"""
    try:
        print("=== ADD EXPENSE REQUEST RECEIVED ===")
        data = request.json
        print(f"Request data: {data}")
        user_id = data.get('user_id', 'demo_user')
        
        expense_data = {
            '_id': f"EXP{int(datetime.now().timestamp() * 1000)}",
            'user_id': user_id,
            'amount': float(data.get('amount', 0)),
            'category': data.get('category', 'Other'),
            'description': data.get('description', ''),
            'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'payment_method': data.get('payment_method', 'Cash'),
            'created_at': datetime.now().isoformat()
        }
        
        # Add to in-memory store
        regular_expenses_store.append(expense_data)
        print(f"Expense added successfully: {expense_data}")
        print(f"Total expenses in store: {len(regular_expenses_store)}")
        
        return jsonify({
            'success': True,
            'message': 'Expense added successfully',
            'expense': expense_data
        }), 201
    
    except Exception as e:
        print(f"!!! ERROR adding expense: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/expense/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    try:
        global regular_expenses_store
        # Remove from store
        regular_expenses_store = [exp for exp in regular_expenses_store if exp.get('_id') != expense_id]
        
        return jsonify({
            'success': True,
            'message': 'Expense deleted successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/daily-expenses', methods=['GET'])
def get_daily_expenses():
    """Get daily expenses for a specific month"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        month = int(request.args.get('month', datetime.now().month))
        year = int(request.args.get('year', datetime.now().year))
        
        # Filter expenses by month and year
        filtered_expenses = [
            exp for exp in daily_expenses_store
            if exp.get('user_id') == user_id
        ]
        
        # Filter by month/year if date is present
        month_filtered = []
        for exp in filtered_expenses:
            exp_date = exp.get('date', '')
            if exp_date:
                try:
                    exp_datetime = datetime.strptime(exp_date, '%Y-%m-%d')
                    if exp_datetime.month == month and exp_datetime.year == year:
                        month_filtered.append(exp)
                except:
                    pass
        
        return jsonify({
            'success': True,
            'expenses': month_filtered,
            'month': month,
            'year': year
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/daily-expense', methods=['POST'])
def add_daily_expense():
    """Add a new daily expense"""
    try:
        data = request.json
        user_id = data.get('user_id', 'demo_user')
        
        expense = {
            'id': f"EXP{int(datetime.now().timestamp() * 1000)}",
            'user_id': user_id,
            'category': data.get('category'),
            'amount': float(data.get('amount', 0)),
            'description': data.get('description', ''),
            'date': data.get('date'),
            'payment_method': data.get('payment_method', 'Cash'),
            'frequency': data.get('frequency', 'daily'),  # daily, weekly, monthly, yearly
            'created_at': datetime.now().isoformat()
        }
        
        # Save to in-memory store
        daily_expenses_store.append(expense)
        
        return jsonify({
            'success': True,
            'message': 'Expense added successfully',
            'expense': expense
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/daily-expense/<expense_id>', methods=['DELETE'])
def delete_daily_expense(expense_id):
    """Delete a daily expense"""
    try:
        global daily_expenses_store
        # Delete from store
        daily_expenses_store = [exp for exp in daily_expenses_store if exp.get('id') != expense_id]
        
        return jsonify({
            'success': True,
            'message': 'Expense deleted successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/finance/predict-monthly-cost', methods=['POST'])
def predict_monthly_cost():
    """Predict monthly cost and provide AI suggestions based on daily expenses"""
    try:
        data = request.json
        month = data.get('month', datetime.now().month)
        year = data.get('year', datetime.now().year)
        expenses = data.get('expenses', [])
        
        if len(expenses) < 3:
            return jsonify({
                'success': False,
                'message': 'Need at least 3 expenses for prediction'
            }), 400
        
        # Calculate current totals
        current_total = sum(float(exp.get('amount', 0)) for exp in expenses)
        
        # Calculate category-wise spending
        category_totals = {}
        for exp in expenses:
            category = exp.get('category', 'Other')
            category_totals[category] = category_totals.get(category, 0) + float(exp.get('amount', 0))
        
        # Get days tracked
        dates = [exp.get('date') for exp in expenses if exp.get('date')]
        if dates:
            days_tracked = len(set(dates))
        else:
            days_tracked = len(expenses)
        
        # Calculate average daily spending
        avg_daily = current_total / max(days_tracked, 1)
        
        # Get days in month
        import calendar
        days_in_month = calendar.monthrange(year, month)[1]
        
        # Predict monthly total (simple linear projection)
        predicted_total = avg_daily * days_in_month
        
        # Predict category-wise
        category_predictions = {}
        for category, amount in category_totals.items():
            category_predictions[category] = (amount / days_tracked) * days_in_month
        
        # Calculate potential savings (15% optimization target)
        potential_savings = predicted_total * 0.15
        
        # Generate AI suggestions
        suggestions = []
        
        # High spending categories
        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        
        if sorted_categories:
            top_category, top_amount = sorted_categories[0]
            percentage = (top_amount / current_total * 100)
            
            if percentage > 40:
                suggestions.append({
                    'priority': 'high',
                    'title': f'{top_category} খরচ অনেক বেশি',
                    'message': f'আপনার মোট খরচের {percentage:.1f}% শুধুমাত্র {top_category} এ যাচ্ছে। এই ক্যাটাগরিতে খরচ কমানোর চেষ্টা করুন।',
                    'potential_saving': top_amount * 0.20
                })
        
        # Daily average comparison
        if avg_daily > 1000:
            suggestions.append({
                'priority': 'high',
                'title': 'দৈনিক খরচ বেশি',
                'message': f'আপনার দৈনিক গড় খরচ ৳{avg_daily:.2f}। ৳800-900 এর মধ্যে রাখার চেষ্টা করুন।',
                'potential_saving': (avg_daily - 850) * days_in_month
            })
        
        # Food category check
        if 'Food' in category_totals:
            food_daily = category_totals['Food'] / days_tracked
            if food_daily > 400:
                suggestions.append({
                    'priority': 'medium',
                    'title': 'খাবারে খরচ কমান',
                    'message': f'দৈনিক খাবারে ৳{food_daily:.2f} খরচ হচ্ছে। বাসায় রান্না করুন, বাইরে কম খান।',
                    'potential_saving': (food_daily - 300) * days_in_month
                })
        
        # Transport optimization
        if 'Transport' in category_totals:
            transport_daily = category_totals['Transport'] / days_tracked
            if transport_daily > 200:
                suggestions.append({
                    'priority': 'medium',
                    'title': 'যাতায়াত খরচ কমান',
                    'message': f'দৈনিক যাতায়াতে ৳{transport_daily:.2f} খরচ হচ্ছে। পাবলিক ট্রান্সপোর্ট ব্যবহার করুন বা carpool করুন।',
                    'potential_saving': (transport_daily - 150) * days_in_month
                })
        
        # Entertainment check
        if 'Entertainment' in category_totals:
            entertainment_pct = (category_totals['Entertainment'] / current_total * 100)
            if entertainment_pct > 15:
                suggestions.append({
                    'priority': 'medium',
                    'title': 'বিনোদন খরচ নিয়ন্ত্রণ করুন',
                    'message': f'আপনার {entertainment_pct:.1f}% খরচ Entertainment এ। এটা 10% এর নিচে রাখুন।',
                    'potential_saving': category_totals['Entertainment'] * 0.40
                })
        
        # Shopping advice
        if 'Shopping' in category_totals:
            shopping_daily = category_totals['Shopping'] / days_tracked
            if shopping_daily > 300:
                suggestions.append({
                    'priority': 'low',
                    'title': 'অপ্রয়োজনীয় কেনাকাটা কমান',
                    'message': 'শপিং করার আগে তালিকা তৈরি করুন। Impulse buying এড়িয়ে চলুন।',
                    'potential_saving': shopping_daily * 0.30 * days_in_month
                })
        
        # Best practice suggestions
        suggestions.append({
            'priority': 'low',
            'title': '💰 বাজেট তৈরি করুন',
            'message': '50-30-20 রুল ফলো করুন: ৫০% প্রয়োজনীয় খরচ, ৩০% চাহিদা, ২০% সেভিংস।',
            'potential_saving': predicted_total * 0.20
        })
        
        suggestions.append({
            'priority': 'low',
            'title': '🏦 জরুরি তহবিল তৈরি করুন',
            'message': '৬ মাসের খরচের সমান একটি ইমার্জেন্সি ফান্ড তৈরি করুন।',
            'potential_saving': 0
        })
        
        suggestions.append({
            'priority': 'low',
            'title': '📊 নিয়মিত ট্র্যাক করুন',
            'message': 'প্রতিদিন খরচ রেকর্ড করুন। সপ্তাহে একবার রিভিউ করুন।',
            'potential_saving': 0
        })
        
        return jsonify({
            'success': True,
            'prediction': {
                'current_total': current_total,
                'predicted_total': predicted_total,
                'days_tracked': days_tracked,
                'days_in_month': days_in_month,
                'avg_daily': avg_daily,
                'potential_savings': potential_savings,
                'category_predictions': category_predictions
            },
            'suggestions': suggestions
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ===================== USER LOCATION ENDPOINTS =====================

@app.route('/api/user/location', methods=['GET', 'POST'])
def user_location():
    """Get or update user's location"""
    try:
        user_id = request.args.get('user_id', 'demo_user') if request.method == 'GET' else request.json.get('user_id', 'demo_user')
        
        if request.method == 'GET':
            location = db.get_user_location(user_id)
            if location:
                return jsonify(location)
            else:
                # Return default location
                return jsonify({
                    'city': 'ঢাকা',
                    'country': 'বাংলাদেশ',
                    'lat': 23.8103,
                    'lon': 90.4125
                })
        
        elif request.method == 'POST':
            data = request.json
            location_data = {
                'user_id': user_id,
                'city': data.get('city'),
                'country': data.get('country'),
                'lat': data.get('lat'),
                'lon': data.get('lon'),
                'updated_at': datetime.now()
            }
            
            db.save_user_location(user_id, location_data)
            
            return jsonify({
                'success': True,
                'message': 'Location updated successfully',
                'location': location_data
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/prayer-times', methods=['GET'])
def get_prayer_times():
    """Get prayer times based on location"""
    try:
        lat = request.args.get('lat', '23.8103')
        lon = request.args.get('lon', '90.4125')
        city = request.args.get('city', 'Dhaka')
        
        # Using Aladhan API for prayer times
        import requests as req
        
        # Get current date
        from datetime import date
        today = date.today()
        
        # Call Aladhan API
        url = f"http://api.aladhan.com/v1/timings/{today.strftime('%d-%m-%Y')}"
        params = {
            'latitude': lat,
            'longitude': lon,
            'method': 2  # ISNA method
        }
        
        response = req.get(url, params=params)
        data = response.json()
        
        if data['code'] == 200:
            timings = data['data']['timings']
            
            # Extract only the 5 prayer times
            prayer_times = {
                'fajr': timings['Fajr'],
                'dhuhr': timings['Dhuhr'],
                'asr': timings['Asr'],
                'maghrib': timings['Maghrib'],
                'isha': timings['Isha']
            }
            
            return jsonify({
                'success': True,
                'timings': prayer_times,
                'location': {
                    'city': city,
                    'lat': lat,
                    'lon': lon
                }
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to fetch prayer times'
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)
