from pymongo import MongoClient
from gridfs import GridFS
from datetime import datetime
from bson import ObjectId
import os
import mimetypes

class FileManager:
    def __init__(self):
        """Initialize File Manager with GridFS"""
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.db_name = os.getenv('DATABASE_NAME', 'lifepilot_ai')
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client[self.db_name]
        
        # GridFS for file storage
        self.fs = GridFS(self.db)
        
        # File metadata collection
        self.files_metadata = self.db['files_metadata']
        
        # Create indexes
        self._create_indexes()
    
    def _create_indexes(self):
        """Create indexes for efficient searching"""
        self.files_metadata.create_index([('user_id', 1), ('upload_date', -1)])
        self.files_metadata.create_index([('user_id', 1), ('file_name', 1)])
        self.files_metadata.create_index([('user_id', 1), ('file_type', 1)])
        self.files_metadata.create_index([('user_id', 1), ('custom_name', 1)])
    
    def upload_file(self, user_id, file_data, original_filename, custom_name=None):
        """
        Upload file to GridFS and store metadata
        
        Args:
            user_id: User ID
            file_data: Binary file data
            original_filename: Original filename
            custom_name: Optional custom name for the file
        
        Returns:
            File metadata dictionary
        """
        # Determine file type
        file_extension = os.path.splitext(original_filename)[1].lower()
        mime_type = mimetypes.guess_type(original_filename)[0] or 'application/octet-stream'
        
        # Map extension to category
        file_category = self._get_file_category(file_extension)
        
        # Store file in GridFS
        file_id = self.fs.put(
            file_data,
            filename=original_filename,
            content_type=mime_type,
            user_id=user_id
        )
        
        # Create metadata
        metadata = {
            'user_id': user_id,
            'file_id': str(file_id),
            'original_filename': original_filename,
            'custom_name': custom_name or original_filename,
            'file_extension': file_extension,
            'file_type': file_category,
            'mime_type': mime_type,
            'file_size': len(file_data),
            'upload_date': datetime.now(),
            'last_modified': datetime.now(),
            'tags': [],
            'description': ''
        }
        
        # Store metadata
        result = self.files_metadata.insert_one(metadata)
        metadata['_id'] = str(result.inserted_id)
        metadata['upload_date'] = metadata['upload_date'].isoformat()
        metadata['last_modified'] = metadata['last_modified'].isoformat()
        
        return metadata
    
    def _get_file_category(self, extension):
        """Categorize file by extension"""
        categories = {
            'pdf': ['.pdf'],
            'excel': ['.xlsx', '.xls', '.xlsm', '.xlsb'],
            'word': ['.doc', '.docx', '.odt'],
            'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico'],
            'csv': ['.csv', '.tsv'],
            'text': ['.txt', '.md', '.rtf'],
            'powerpoint': ['.ppt', '.pptx', '.odp'],
            'archive': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'video': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'],
            'audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg']
        }
        
        for category, extensions in categories.items():
            if extension in extensions:
                return category
        
        return 'other'
    
    def get_file(self, file_id):
        """Retrieve file from GridFS"""
        try:
            grid_out = self.fs.get(ObjectId(file_id))
            return grid_out.read(), grid_out.content_type, grid_out.filename
        except Exception as e:
            return None, None, None
    
    def get_file_metadata(self, metadata_id):
        """Get file metadata by ID"""
        try:
            metadata = self.files_metadata.find_one({'_id': ObjectId(metadata_id)})
            if metadata:
                metadata['_id'] = str(metadata['_id'])
                metadata['upload_date'] = metadata['upload_date'].isoformat()
                metadata['last_modified'] = metadata['last_modified'].isoformat()
            return metadata
        except:
            return None
    
    def search_files(self, user_id, query=None, file_type=None, start_date=None, end_date=None, sort_by='upload_date', sort_order=-1):
        """
        Search files with advanced filters
        
        Args:
            user_id: User ID
            query: Search query for filename or custom name
            file_type: Filter by file type (pdf, excel, image, etc.)
            start_date: Start date for filtering
            end_date: End date for filtering
            sort_by: Field to sort by (upload_date, file_name, file_size)
            sort_order: 1 for ascending, -1 for descending
        
        Returns:
            List of file metadata
        """
        # Build search filter
        search_filter = {'user_id': user_id}
        
        # Text search
        if query:
            search_filter['$or'] = [
                {'original_filename': {'$regex': query, '$options': 'i'}},
                {'custom_name': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}},
                {'tags': {'$regex': query, '$options': 'i'}}
            ]
        
        # File type filter
        if file_type:
            search_filter['file_type'] = file_type
        
        # Date range filter
        if start_date or end_date:
            date_filter = {}
            if start_date:
                date_filter['$gte'] = datetime.fromisoformat(start_date)
            if end_date:
                date_filter['$lte'] = datetime.fromisoformat(end_date)
            if date_filter:
                search_filter['upload_date'] = date_filter
        
        # Execute search
        results = list(self.files_metadata.find(search_filter).sort(sort_by, sort_order))
        
        # Format results
        for result in results:
            result['_id'] = str(result['_id'])
            result['upload_date'] = result['upload_date'].isoformat()
            result['last_modified'] = result['last_modified'].isoformat()
        
        return results
    
    def get_user_files(self, user_id, limit=50, skip=0):
        """Get all files for a user with pagination"""
        files = list(
            self.files_metadata.find({'user_id': user_id})
            .sort('upload_date', -1)
            .limit(limit)
            .skip(skip)
        )
        
        for file in files:
            file['_id'] = str(file['_id'])
            file['upload_date'] = file['upload_date'].isoformat()
            file['last_modified'] = file['last_modified'].isoformat()
        
        return files
    
    def update_file_metadata(self, metadata_id, updates):
        """Update file metadata (name, description, tags)"""
        updates['last_modified'] = datetime.now()
        
        result = self.files_metadata.update_one(
            {'_id': ObjectId(metadata_id)},
            {'$set': updates}
        )
        
        return result.modified_count > 0
    
    def delete_file(self, metadata_id):
        """Delete file and its metadata"""
        try:
            # Get metadata
            metadata = self.files_metadata.find_one({'_id': ObjectId(metadata_id)})
            if not metadata:
                return False
            
            # Delete from GridFS
            self.fs.delete(ObjectId(metadata['file_id']))
            
            # Delete metadata
            self.files_metadata.delete_one({'_id': ObjectId(metadata_id)})
            
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
    
    def get_file_statistics(self, user_id):
        """Get file statistics for user"""
        pipeline = [
            {'$match': {'user_id': user_id}},
            {'$group': {
                '_id': '$file_type',
                'count': {'$sum': 1},
                'total_size': {'$sum': '$file_size'}
            }}
        ]
        
        stats = list(self.files_metadata.aggregate(pipeline))
        
        total_files = sum(s['count'] for s in stats)
        total_size = sum(s['total_size'] for s in stats)
        
        return {
            'total_files': total_files,
            'total_size': total_size,
            'by_type': {s['_id']: {'count': s['count'], 'size': s['total_size']} for s in stats}
        }
