# Authentication module for user management
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid
import re
import os
from dotenv import load_dotenv

load_dotenv()

class AuthManager:
    def __init__(self):
        try:
            mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
            self.client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
            self.db = self.client['lifepilot_ai']
            self.users_collection = self.db['users']
            
            # Create unique indexes (ignore if they already exist)
            try:
                self.users_collection.create_index('email', unique=True)
                self.users_collection.create_index('username', unique=True)
                self.users_collection.create_index('user_id', unique=True)
            except Exception as e:
                print(f"Index creation warning: {e}")
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            raise
    
    def generate_user_id(self):
        """Generate a unique user ID"""
        return f"LP-{uuid.uuid4().hex[:12].upper()}"
    
    def generate_guest_id(self):
        """Generate a unique guest ID"""
        return f"GUEST-{uuid.uuid4().hex[:10].upper()}"
    
    def generate_guest_username(self):
        """Generate a unique guest username"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"guest_{timestamp}_{uuid.uuid4().hex[:6]}"
    
    def validate_email(self, email):
        """Validate email format"""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_pattern, email) is not None
    
    def validate_password_strength(self, password):
        """
        Validate password strength
        Returns: (is_valid, message, strength_score)
        """
        if len(password) < 6:
            return False, "Password must be at least 6 characters long", 0
        
        return True, "Password accepted", 6
    
    def register_user(self, full_name, username, email, password, is_guest=False):
        """
        Register a new user
        Returns: (success, message, user_data)
        """
        try:
            # For guest users
            if is_guest:
                user_id = self.generate_guest_id()
                username = self.generate_guest_username()
                email = f"{username}@guest.lifepilot.ai"
                password_hash = generate_password_hash("guest_password")
                
                user_data = {
                    'user_id': user_id,
                    'full_name': 'Guest User',
                    'username': username,
                    'email': email,
                    'password_hash': password_hash,
                    'is_guest': True,
                    'created_at': datetime.now(),
                    'last_login': datetime.now(),
                    'profile_data': {}
                }
                
                result = self.users_collection.insert_one(user_data)
                
                return True, "Guest account created successfully", {
                    'user_id': user_id,
                    'username': username,
                    'full_name': 'Guest User',
                    'email': email,
                    'is_guest': True
                }
            
            # For regular users
            # Validate email
            if not self.validate_email(email):
                return False, "Invalid email format", None
            
            # Check if email already exists
            if self.users_collection.find_one({'email': email}):
                return False, "Email already registered", None
            
            # Check if username already exists
            if self.users_collection.find_one({'username': username}):
                return False, "Username already taken", None
            
            # Validate minimum password length
            if len(password) < 6:
                return False, "Password must be at least 6 characters long", None
            
            # Generate unique user ID
            user_id = self.generate_user_id()
            
            # Hash password
            password_hash = generate_password_hash(password)
            
            # Create user document
            user_data = {
                'user_id': user_id,
                'full_name': full_name,
                'username': username,
                'email': email,
                'password_hash': password_hash,
                'is_guest': False,
                'created_at': datetime.now(),
                'last_login': datetime.now(),
                'profile_data': {},
                'settings': {
                    'theme': 'light',
                    'notifications': True,
                    'language': 'en'
                }
            }
            
            # Insert into database
            result = self.users_collection.insert_one(user_data)
            
            return True, "User registered successfully", {
                'user_id': user_id,
                'username': username,
                'full_name': full_name,
                'email': email,
                'is_guest': False
            }
            
        except Exception as e:
            return False, f"Registration error: {str(e)}", None
    
    def login_user(self, email, password, remember_me=False):
        """
        Login user
        Returns: (success, message, user_data)
        """
        try:
            # Find user by email
            user = self.users_collection.find_one({'email': email})
            
            if not user:
                return False, "Invalid email or password", None
            
            # Check password
            if not check_password_hash(user['password_hash'], password):
                return False, "Invalid email or password", None
            
            # Update last login
            self.users_collection.update_one(
                {'_id': user['_id']},
                {'$set': {'last_login': datetime.now()}}
            )
            
            # Prepare user data to return
            user_data = {
                'user_id': user['user_id'],
                'username': user['username'],
                'full_name': user['full_name'],
                'email': user['email'],
                'is_guest': user.get('is_guest', False),
                'remember_me': remember_me
            }
            
            return True, "Login successful", user_data
            
        except Exception as e:
            return False, f"Login error: {str(e)}", None
    
    def get_user_by_id(self, user_id):
        """Get user data by user ID"""
        try:
            user = self.users_collection.find_one({'user_id': user_id})
            if user:
                return {
                    'user_id': user['user_id'],
                    'username': user['username'],
                    'full_name': user['full_name'],
                    'email': user['email'],
                    'is_guest': user.get('is_guest', False),
                    'created_at': user['created_at'],
                    'profile_data': user.get('profile_data', {})
                }
            return None
        except Exception as e:
            print(f"Error getting user: {str(e)}")
            return None
    
    def update_user_profile_data(self, user_id, profile_data):
        """Update user's profile data"""
        try:
            result = self.users_collection.update_one(
                {'user_id': user_id},
                {'$set': {'profile_data': profile_data, 'updated_at': datetime.now()}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating profile: {str(e)}")
            return False
    
    def validate_user_id(self, user_id):
        """Check if user ID exists"""
        try:
            return self.users_collection.find_one({'user_id': user_id}) is not None
        except Exception as e:
            print(f"Error validating user ID: {str(e)}")
            return False
