from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
import io
import base64
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

# New routine endpoints for RoutineSetup component
@app.route('/api/routines', methods=['GET', 'POST'])
def manage_routines():
    """Get all routines for a user or create a new routine"""
    try:
        if request.method == 'GET':
            user_id = request.args.get('userId')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID required'}), 400
            
            routines = db.get_user_routines(user_id)
            return jsonify(routines)
        
        elif request.method == 'POST':
            data = request.json
            user_id = data.get('userId')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID required'}), 400
            
            routine_data = {
                'user_id': user_id,
                'name': data.get('name'),
                'type': data.get('type'),
                'schedule': data.get('schedule', []),
                'createdAt': data.get('createdAt', datetime.now().isoformat())
            }
            
            routine_id = db.save_routine(routine_data)
            routine_data['_id'] = str(routine_id)
            
            return jsonify(routine_data), 201
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/routines/<routine_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_routine(routine_id):
    """Get, update or delete a specific routine"""
    try:
        if request.method == 'DELETE':
            # Delete routine
            from bson import ObjectId
            db.routines.delete_one({'_id': ObjectId(routine_id)})
            return jsonify({'success': True, 'message': 'Routine deleted'})
        
        elif request.method == 'GET':
            # Get specific routine
            from bson import ObjectId
            routine = db.routines.find_one({'_id': ObjectId(routine_id)})
            if routine:
                routine['_id'] = str(routine['_id'])
                return jsonify(routine)
            return jsonify({'success': False, 'message': 'Routine not found'}), 404
        
        elif request.method == 'PUT':
            # Update routine
            from bson import ObjectId
            data = request.json
            db.routines.update_one(
                {'_id': ObjectId(routine_id)},
                {'$set': data}
            )
            return jsonify({'success': True, 'message': 'Routine updated'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

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

# ============================================
# HEALTH SYSTEM ENDPOINTS
# ============================================

# In-memory storage for health data (temporary - will be replaced with DB)
health_profiles_store = []
health_products_store = []

@app.route('/api/health/profile', methods=['GET'])
def get_health_profile():
    """Get user's health profile"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        
        # Get from in-memory store (or database)
        profile = next((p for p in health_profiles_store if p.get('user_id') == user_id), None)
        
        if not profile:
            # Return default profile
            return jsonify({
                'success': True,
                'data': {
                    'bloodPressure': {'systolic': 120, 'diastolic': 80},
                    'heartRate': 72,
                    'weight': 70,
                    'height': 170,
                    'bloodSugar': 95,
                    'temperature': 98.6,
                    'sleep': 7,
                    'waterIntake': 2.5,
                    'steps': 8000
                },
                'history': [],
                'conditions': [],
                'medications': []
            })
        
        return jsonify({
            'success': True,
            'data': profile.get('data', {}),
            'history': profile.get('history', []),
            'conditions': profile.get('conditions', []),
            'medications': profile.get('medications', [])
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health/update', methods=['POST'])
def update_health_profile():
    """Update health profile"""
    try:
        data = request.json
        user_id = data.get('user_id', 'demo_user')
        
        # Create health record
        health_record = {
            'user_id': user_id,
            'data': {
                'bloodPressure': data.get('bloodPressure', {'systolic': 120, 'diastolic': 80}),
                'heartRate': data.get('heartRate', 72),
                'weight': data.get('weight', 70),
                'height': data.get('height', 170),
                'bloodSugar': data.get('bloodSugar', 95),
                'temperature': data.get('temperature', 98.6),
                'sleep': data.get('sleep', 7),
                'waterIntake': data.get('waterIntake', 2.5),
                'steps': data.get('steps', 8000)
            },
            'timestamp': data.get('timestamp', datetime.now().isoformat()),
            'conditions': data.get('conditions', []),
            'medications': data.get('medications', [])
        }
        
        # Find existing profile
        existing_idx = next((i for i, p in enumerate(health_profiles_store) if p.get('user_id') == user_id), None)
        
        if existing_idx is not None:
            # Update existing
            health_profiles_store[existing_idx] = health_record
        else:
            # Add new
            health_profiles_store.append(health_record)
        
        return jsonify({
            'success': True,
            'message': 'Health profile updated successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health/ai-suggestions', methods=['POST'])
def get_health_ai_suggestions():
    """Get AI health suggestions based on user's health data"""
    try:
        data = request.json
        health_data = data.get('healthData', {})
        conditions = data.get('conditions', [])
        
        suggestions = []
        
        # BMI check
        height_m = health_data.get('height', 170) / 100
        weight = health_data.get('weight', 70)
        bmi = weight / (height_m * height_m)
        
        if bmi < 18.5:
            suggestions.append('⚠️ আপনার BMI কম। পুষ্টিকর খাবার বেশি খান।')
        elif bmi >= 25 and bmi < 30:
            suggestions.append('⚠️ আপনার ওজন বেশি। নিয়মিত ব্যায়াম করুন এবং স্বাস্থ্যকর খাবার খান।')
        elif bmi >= 30:
            suggestions.append('🚨 আপনার ওজন অনেক বেশি। ডাক্তারের পরামর্শ নিন।')
        else:
            suggestions.append('✅ আপনার BMI স্বাভাবিক। এভাবে চালিয়ে যান!')
        
        # Blood Pressure check
        bp = health_data.get('bloodPressure', {})
        systolic = bp.get('systolic', 120)
        diastolic = bp.get('diastolic', 80)
        
        if systolic >= 140 or diastolic >= 90:
            suggestions.append('🚨 রক্তচাপ বেশি! লবণ কম খান এবং ডাক্তারের পরামর্শ নিন।')
        elif systolic >= 130 or diastolic >= 80:
            suggestions.append('⚠️ রক্তচাপ একটু বেশি। স্ট্রেস কমান এবং ব্যায়াম করুন।')
        else:
            suggestions.append('✅ রক্তচাপ স্বাভাবিক')
        
        # Blood Sugar check
        blood_sugar = health_data.get('bloodSugar', 95)
        if blood_sugar >= 126:
            suggestions.append('🚨 রক্তে শর্করা অনেক বেশি! অবিলম্বে ডাক্তারের পরামর্শ নিন।')
        elif blood_sugar >= 100:
            suggestions.append('⚠️ রক্তে শর্করা একটু বেশি। মিষ্টি কম খান।')
        else:
            suggestions.append('✅ রক্তে শর্করা স্বাভাবিক')
        
        # Sleep check
        sleep = health_data.get('sleep', 7)
        if sleep < 6:
            suggestions.append('😴 আপনার ঘুম কম হচ্ছে। প্রতিদিন ৭-৮ ঘন্টা ঘুমান।')
        elif sleep > 9:
            suggestions.append('😴 আপনি বেশি ঘুমাচ্ছেন। পরিমিত ঘুম স্বাস্থ্যকর।')
        else:
            suggestions.append('✅ ঘুম পর্যাপ্ত')
        
        # Water intake check
        water = health_data.get('waterIntake', 2.5)
        if water < 2:
            suggestions.append('💧 পানি পান কম হচ্ছে। দিনে কমপক্ষে ৮ গ্লাস পানি পান করুন।')
        else:
            suggestions.append('✅ পানি পান পর্যাপ্ত')
        
        # General suggestions
        suggestions.extend([
            '🥗 তাজা ফল এবং সবজি বেশি খান',
            '🏃 দিনে ৩০ মিনিট হাঁটুন',
            '🧘 মানসিক চাপ কমানোর জন্য ধ্যান করুন',
            '🚭 ধূমপান এড়িয়ে চলুন'
        ])
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health/products', methods=['GET'])
def get_health_products():
    """Get all health products"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        
        # Filter products by user
        user_products = [p for p in health_products_store if p.get('user_id', 'demo_user') == user_id]
        
        return jsonify({
            'success': True,
            'products': user_products
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health/product', methods=['POST'])
def add_health_product():
    """Add a health product"""
    try:
        data = request.json
        user_id = data.get('user_id', 'demo_user')
        
        product = {
            'id': data.get('id', f"PRD{int(datetime.now().timestamp() * 1000)}"),
            'user_id': user_id,
            'name': data.get('name'),
            'category': data.get('category'),
            'price': float(data.get('price', 0)),
            'purchaseDate': data.get('purchaseDate'),
            'image': data.get('image'),
            'description': data.get('description', ''),
            'brand': data.get('brand', ''),
            'quantity': int(data.get('quantity', 1)),
            'unit': data.get('unit', 'piece'),
            'aiRecommendation': data.get('aiRecommendation', {}),
            'createdAt': data.get('createdAt', datetime.now().isoformat())
        }
        
        health_products_store.append(product)
        
        return jsonify({
            'success': True,
            'message': 'Product added successfully',
            'product': product
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health/product/<product_id>', methods=['DELETE'])
def delete_health_product(product_id):
    """Delete a health product"""
    try:
        global health_products_store
        
        health_products_store = [p for p in health_products_store if p.get('id') != product_id]
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health/product-recommendation', methods=['POST'])
def get_product_recommendation():
    """Get AI recommendation for a product based on health conditions"""
    try:
        data = request.json
        product = data.get('product', {})
        health_conditions = data.get('healthConditions', [])
        
        category = product.get('category', '')
        product_name = product.get('name', '').lower()
        
        recommendation = {
            'suitable': 'neutral',
            'message': 'ℹ️ সাধারণ পণ্য',
            'tips': ['গুণমান পরীক্ষা করুন', 'মেয়াদ চেক করুন']
        }
        
        # Medicine/Supplement recommendations
        if category in ['Medicine', 'Supplement']:
            if any('diabetes' in str(c).lower() for c in health_conditions):
                recommendation = {
                    'suitable': 'warning',
                    'message': '⚠️ ডায়াবেটিস রোগীদের জন্য ডাক্তারের পরামর্শ আবশ্যক',
                    'tips': ['ডাক্তারের পরামর্শ ছাড়া খাবেন না', 'রক্তে শর্করা নিয়মিত পরীক্ষা করুন']
                }
            elif any('pressure' in str(c).lower() or 'hypertension' in str(c).lower() for c in health_conditions):
                recommendation = {
                    'suitable': 'warning',
                    'message': '⚠️ উচ্চ রক্তচাপ রোগীদের সতর্কতা',
                    'tips': ['ডাক্তারের নির্দেশ মেনে চলুন', 'লবণ কম খান']
                }
            else:
                recommendation = {
                    'suitable': 'warning',
                    'message': '⚠️ ওষুধ সেবনে সতর্কতা',
                    'tips': ['নির্ধারিত ডোজ মেনে চলুন', 'পার্শ্বপ্রতিক্রিয়া দেখা দিলে ডাক্তারকে জানান']
                }
        
        # Food recommendations
        elif category == 'Food':
            if 'sugar' in product_name or 'sweet' in product_name or 'candy' in product_name:
                if any('diabetes' in str(c).lower() for c in health_conditions):
                    recommendation = {
                        'suitable': 'bad',
                        'message': '❌ ডায়াবেটিস রোগীদের জন্য উপযুক্ত নয়',
                        'tips': ['চিনিযুক্ত খাবার এড়িয়ে চলুন', 'শর্করামুক্ত বিকল্প খুঁজুন']
                    }
                else:
                    recommendation = {
                        'suitable': 'warning',
                        'message': '⚠️ পরিমিত পরিমাণে খান',
                        'tips': ['অতিরিক্ত মিষ্টি স্বাস্থ্যের জন্য ক্ষতিকর']
                    }
            elif any(word in product_name for word in ['fruit', 'vegetable', 'salad', 'ফল', 'সবজি']):
                recommendation = {
                    'suitable': 'good',
                    'message': '✅ স্বাস্থ্যকর খাবার',
                    'tips': ['প্রতিদিন খান', 'তাজা থাকতে ফ্রিজে রাখুন']
                }
            else:
                recommendation = {
                    'suitable': 'neutral',
                    'message': 'ℹ️ পুষ্টি মান দেখে খান',
                    'tips': ['পরিমিত পরিমাণে খান', 'মেয়াদ চেক করুন']
                }
        
        return jsonify({
            'success': True,
            'recommendation': recommendation
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ============= GALLERY & DOCUMENTS API =============

gallery_items_store = []

@app.route('/api/gallery/items', methods=['GET'])
def get_gallery_items():
    """Get all gallery items (photos and documents)"""
    try:
        photos = [item for item in gallery_items_store if item.get('type') == 'photo']
        documents = [item for item in gallery_items_store if item.get('type') == 'document']
        
        return jsonify({
            'success': True,
            'photos': photos,
            'documents': documents
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/gallery/item', methods=['POST'])
def add_gallery_item():
    """Add a new photo or document"""
    try:
        data = request.json
        gallery_items_store.append(data)
        
        return jsonify({
            'success': True,
            'message': 'Item added successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/gallery/item/<item_id>', methods=['DELETE'])
def delete_gallery_item(item_id):
    """Delete a gallery item"""
    try:
        global gallery_items_store
        gallery_items_store = [item for item in gallery_items_store if item.get('id') != item_id]
        
        return jsonify({
            'success': True,
            'message': 'Item deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ============= EVENTS & REMINDERS API =============

events_store = []

@app.route('/api/events/all', methods=['GET'])
def get_all_events():
    """Get all events"""
    try:
        return jsonify({
            'success': True,
            'events': events_store
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/events/add', methods=['POST'])
def add_event():
    """Add a new event"""
    try:
        data = request.json
        events_store.append(data)
        
        return jsonify({
            'success': True,
            'message': 'Event added successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    """Update an event"""
    try:
        data = request.json
        for i, event in enumerate(events_store):
            if event.get('id') == event_id:
                events_store[i] = data
                break
        
        return jsonify({
            'success': True,
            'message': 'Event updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    """Delete an event"""
    try:
        global events_store
        events_store = [event for event in events_store if event.get('id') != event_id]
        
        return jsonify({
            'success': True,
            'message': 'Event deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ============= REPORTS API =============

@app.route('/api/reports/generate', methods=['POST'])
def generate_report():
    """Generate reports based on type and date range"""
    try:
        data = request.json
        report_type = data.get('type', 'overall')
        date_range = data.get('dateRange', 'month')
        
        # This is a placeholder - in production, you'd fetch real data from database
        report = {
            'type': report_type,
            'dateRange': date_range,
            'generatedAt': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'report': report
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ============= AI ASSISTANT API =============

@app.route('/api/ai/voice-command', methods=['POST'])
def process_voice_command():
    """Process voice commands"""
    try:
        data = request.json
        command = data.get('command', '').lower()
        
        # Simple command processing
        response_data = {
            'success': True,
            'response': 'Command processed',
            'action': 'unknown',
            'params': {}
        }
        
        if 'expense' in command or 'খরচ' in command:
            response_data['response'] = 'Opening expense tracker...'
            response_data['action'] = 'navigate'
            response_data['params'] = {'path': '/financial'}
        elif 'health' in command or 'স্বাস্থ্য' in command:
            response_data['response'] = 'Opening health dashboard...'
            response_data['action'] = 'navigate'
            response_data['params'] = {'path': '/health'}
        elif 'prayer' in command or 'নামাজ' in command:
            response_data['response'] = 'Opening prayer times...'
            response_data['action'] = 'navigate'
            response_data['params'] = {'path': '/prayer'}
        elif 'report' in command or 'রিপোর্ট' in command:
            response_data['response'] = 'Opening report generator...'
            response_data['action'] = 'navigate'
            response_data['params'] = {'path': '/reports'}
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/ai/insights', methods=['GET'])
def get_ai_insights():
    """Get AI-generated insights"""
    try:
        # This would be generated from actual data analysis in production
        insights_data = {
            'success': True,
            'suggestions': [],
            'insights': [],
            'predictions': []
        }
        
        return jsonify(insights_data)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/ai/auto-categorize', methods=['POST'])
def auto_categorize_expenses():
    """Auto-categorize expenses using AI"""
    try:
        data = request.json
        expenses = data.get('expenses', [])
        
        # Simple categorization logic (in production, use ML model)
        categorized_count = 0
        for expense in expenses:
            # Add categorization logic here
            categorized_count += 1
        
        return jsonify({
            'success': True,
            'categorizedCount': categorized_count,
            'message': f'{categorized_count} expenses categorized'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ===================== HEALTH RECORDS ENDPOINTS =====================

@app.route('/api/health/profile', methods=['GET'])
def get_health_profile():
    """Get user's latest health profile"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        latest_record = db.get_latest_health_record(user_id)
        history = db.get_health_records(user_id, limit=30)
        
        return jsonify({
            'success': True,
            'data': latest_record,
            'history': history
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/health/update', methods=['POST'])
def update_health_record():
    """Save new health record"""
    try:
        data = request.json
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        record_id = db.save_health_record(user_id, data)
        
        return jsonify({
            'success': True,
            'message': 'Health record saved',
            'record_id': str(record_id)
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/health/ai-suggestions', methods=['POST'])
def get_health_ai_suggestions():
    """Get personalized AI health suggestions"""
    try:
        data = request.json
        user_id = data.get('user_id')
        health_data = data.get('healthData', {})
        conditions = data.get('conditions', [])
        
        suggestions = []
        
        # BMI-based suggestions
        if health_data.get('weight') and health_data.get('height'):
            height_m = health_data['height'] / 100
            bmi = health_data['weight'] / (height_m * height_m)
            
            if bmi < 18.5:
                suggestions.append('⚠️ আপনার BMI কম। পুষ্টিকর খাবার বেশি খান।')
            elif bmi >= 25:
                suggestions.append('⚠️ ওজন নিয়ন্ত্রণে রাখুন। দিনে ৪৫ মিনিট ব্যায়াম করুন।')
            else:
                suggestions.append('✅ আপনার BMI স্বাভাবিক। এভাবে চালিয়ে যান!')
        
        # Blood pressure suggestions
        if health_data.get('bloodPressure'):
            bp = health_data['bloodPressure']
            systolic = bp.get('systolic', 0)
            diastolic = bp.get('diastolic', 0)
            
            if systolic >= 140 or diastolic >= 90:
                suggestions.append('🩺 রক্তচাপ বেশি। লবণ কম খান এবং ডাক্তারের পরামর্শ নিন।')
            elif systolic < 120 and diastolic < 80:
                suggestions.append('✅ রক্তচাপ স্বাভাবিক রয়েছে!')
        
        # Blood sugar suggestions
        if health_data.get('bloodSugar'):
            sugar = health_data['bloodSugar']
            if sugar >= 126:
                suggestions.append('⚠️ রক্তে শর্করা বেশি। চিনি ও মিষ্টি খাবার এড়িয়ে চলুন।')
            elif sugar < 100:
                suggestions.append('✅ রক্তে শর্করা স্বাভাবিক!')
        
        # Sleep suggestions
        if health_data.get('sleep'):
            sleep = health_data['sleep']
            if sleep < 7:
                suggestions.append('😴 প্রতিদিন কমপক্ষে ৭-৮ ঘন্টা ঘুমান।')
            elif sleep >= 7:
                suggestions.append('✅ ঘুমের পরিমাণ ভালো আছে!')
        
        # Generic suggestions
        suggestions.append('💧 প্রতিদিন ৮-১০ গ্লাস পানি পান করুন')
        suggestions.append('🥗 সুষম খাবার খান - শাকসবজি, ফল, প্রোটিন')
        suggestions.append('🚶 নিয়মিত হাঁটুন বা ব্যায়াম করুন')
        
        return jsonify({
            'success': True,
            'suggestions': suggestions[:6]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===================== IMAGE UPLOAD ENDPOINTS =====================

@app.route('/api/images/upload', methods=['POST'])
def upload_image():
    """Upload image to database"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image file'}), 400
        
        file = request.files['image']
        user_id = request.form.get('user_id')
        category = request.form.get('category', 'Other')
        title = request.form.get('title', '')
        
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            # Read image as binary
            import base64
            image_binary = file.read()
            image_base64 = base64.b64encode(image_binary).decode('utf-8')
            
            # Get file info
            filename = secure_filename(file.filename)
            file_ext = filename.rsplit('.', 1)[1].lower()
            
            image_data = {
                'filename': filename,
                'title': title or filename,
                'category': category,
                'file_type': file_ext,
                'size': len(image_binary),
                'data': image_base64
            }
            
            image_id = db.save_image(user_id, image_data)
            
            return jsonify({
                'success': True,
                'message': 'Image uploaded successfully',
                'image_id': str(image_id)
            })
        else:
            return jsonify({'success': False, 'message': 'Invalid file type'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/images/list', methods=['GET'])
def list_images():
    """Get user's images"""
    try:
        user_id = request.args.get('user_id')
        category = request.args.get('category')
        
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        images = db.get_user_images(user_id, category)
        
        # Don't send full image data in list, just metadata
        for img in images:
            img['has_data'] = 'data' in img
            if 'data' in img:
                img.pop('data')
        
        return jsonify({
            'success': True,
            'images': images
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/images/<image_id>', methods=['GET'])
def get_image(image_id):
    """Get specific image with full data"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        images = db.get_user_images(user_id)
        image = next((img for img in images if img['_id'] == image_id), None)
        
        if not image:
            return jsonify({'success': False, 'message': 'Image not found'}), 404
        
        return jsonify({
            'success': True,
            'image': image
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/images/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    """Delete an image"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        success = db.delete_image(image_id, user_id)
        
        if success:
            return jsonify({'success': True, 'message': 'Image deleted'})
        else:
            return jsonify({'success': False, 'message': 'Image not found'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===================== MEDICINE TRACKER ENDPOINTS =====================

@app.route('/api/medicines', methods=['GET', 'POST'])
def manage_medicines():
    """Get all medicines for a user or add a new medicine"""
    try:
        if request.method == 'GET':
            user_id = request.args.get('userId')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID required'}), 400
            
            medicines = list(db.medicines.find({'userId': user_id}))
            for medicine in medicines:
                medicine['_id'] = str(medicine['_id'])
            
            return jsonify(medicines)
        
        elif request.method == 'POST':
            data = request.json
            user_id = data.get('userId')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID required'}), 400
            
            medicine_data = {
                'userId': user_id,
                'name': data.get('name'),
                'dosage': data.get('dosage'),
                'times': data.get('times', {}),
                'startDate': data.get('startDate'),
                'endDate': data.get('endDate'),
                'notes': data.get('notes', ''),
                'createdAt': data.get('createdAt', datetime.now().isoformat()),
                'active': True
            }
            
            result = db.medicines.insert_one(medicine_data)
            medicine_data['_id'] = str(result.inserted_id)
            
            return jsonify(medicine_data), 201
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/medicines/<medicine_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_medicine(medicine_id):
    """Get, update or delete a specific medicine"""
    try:
        from bson import ObjectId
        
        if request.method == 'DELETE':
            db.medicines.delete_one({'_id': ObjectId(medicine_id)})
            return jsonify({'success': True, 'message': 'Medicine deleted'})
        
        elif request.method == 'GET':
            medicine = db.medicines.find_one({'_id': ObjectId(medicine_id)})
            if medicine:
                medicine['_id'] = str(medicine['_id'])
                return jsonify(medicine)
            return jsonify({'success': False, 'message': 'Medicine not found'}), 404
        
        elif request.method == 'PUT':
            data = request.json
            db.medicines.update_one(
                {'_id': ObjectId(medicine_id)},
                {'$set': data}
            )
            return jsonify({'success': True, 'message': 'Medicine updated'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===================== NOTIFICATION ENDPOINTS =====================

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """Get user notifications"""
    try:
        user_id = request.args.get('user_id')
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        notifications = db.get_user_notifications(user_id, unread_only)
        
        return jsonify({
            'success': True,
            'notifications': notifications
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/notifications/<notification_id>/read', methods=['POST'])
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        user_id = request.json.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        success = db.mark_notification_read(notification_id, user_id)
        
        if success:
            return jsonify({'success': True, 'message': 'Notification marked as read'})
        else:
            return jsonify({'success': False, 'message': 'Notification not found'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===================== EXPORT/IMPORT ENDPOINTS =====================

@app.route('/api/export/data', methods=['POST'])
def export_user_data():
    """Export user data to CSV/PDF"""
    try:
        data = request.json
        user_id = data.get('user_id')
        export_format = data.get('format', 'csv')  # csv or pdf
        data_types = data.get('data_types', ['all'])  # which data to export
        
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        import pandas as pd
        from io import BytesIO
        
        # Collect data based on requested types
        export_data = {}
        
        if 'all' in data_types or 'expenses' in data_types:
            expenses = db.get_user_expenses(user_id)
            export_data['expenses'] = expenses
        
        if 'all' in data_types or 'health' in data_types:
            health_records = db.get_health_records(user_id, limit=100)
            export_data['health'] = health_records
        
        if 'all' in data_types or 'tasks' in data_types:
            tasks = db.get_user_tasks(user_id)
            export_data['tasks'] = tasks
        
        # Create export file
        if export_format == 'csv':
            # Create CSV
            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                for sheet_name, data_list in export_data.items():
                    if data_list:
                        df = pd.DataFrame(data_list)
                        df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            output.seek(0)
            file_data = base64.b64encode(output.read()).decode('utf-8')
            filename = f'lifepilot_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
            
        elif export_format == 'pdf':
            # Create PDF (simplified version)
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            
            output = BytesIO()
            c = canvas.Canvas(output, pagesize=letter)
            c.drawString(100, 750, f"Life Pilot AI - Data Export")
            c.drawString(100, 730, f"User ID: {user_id}")
            c.drawString(100, 710, f"Export Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            y = 680
            for data_type, data_list in export_data.items():
                c.drawString(100, y, f"{data_type.upper()}: {len(data_list)} records")
                y -= 20
            
            c.save()
            output.seek(0)
            file_data = base64.b64encode(output.read()).decode('utf-8')
            filename = f'lifepilot_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        
        # Save export record to database
        export_record = {
            'filename': filename,
            'format': export_format,
            'data_types': data_types,
            'file_data': file_data,
            'size': len(file_data)
        }
        
        export_id = db.save_export(user_id, export_record)
        
        return jsonify({
            'success': True,
            'message': 'Data exported successfully',
            'export_id': str(export_id),
            'filename': filename,
            'download_url': f'/api/export/download/{export_id}'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/export/list', methods=['GET'])
def list_exports():
    """Get user's export history"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        exports = db.get_user_exports(user_id)
        
        # Remove file data from list response
        for exp in exports:
            if 'file_data' in exp:
                exp.pop('file_data')
        
        return jsonify({
            'success': True,
            'exports': exports
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/export/download/<export_id>', methods=['GET'])
def download_export(export_id):
    """Download exported file"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        export = db.get_export(export_id, user_id)
        
        if not export:
            return jsonify({'success': False, 'message': 'Export not found'}), 404
        
        # Decode base64 file data
        import base64
        file_data = base64.b64decode(export['file_data'])
        
        return send_file(
            io.BytesIO(file_data),
            mimetype='application/octet-stream',
            as_attachment=True,
            download_name=export['filename']
        )
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)


