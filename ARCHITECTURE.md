# File Management System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React Frontend - Port 3000)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  │
│  │   Navbar     │───▶│ File Manager │───▶│  Profile Icon   │  │
│  │   Component  │    │  Modal/Page  │    │   Dropdown      │  │
│  └──────────────┘    └──────────────┘    └─────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           FileManager.jsx Component                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • Upload Zone (Drag & Drop)                            │  │
│  │  • Search Bar & Filters                                 │  │
│  │  • File List with Actions                               │  │
│  │  • Statistics Dashboard                                 │  │
│  │  • Theme Support (Light/Dark/Blue)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ HTTP Requests (Axios)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                             │
│                    (Flask Server - Port 5000)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                    app.py - API Routes                     ││
│  ├────────────────────────────────────────────────────────────┤│
│  │  POST   /api/files/upload                                  ││
│  │  GET    /api/files/search                                  ││
│  │  GET    /api/files/list                                    ││
│  │  GET    /api/files/download/<id>                           ││
│  │  DELETE /api/files/<id>                                    ││
│  │  PUT    /api/files/<id>                                    ││
│  │  GET    /api/files/statistics                              ││
│  └────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │              file_manager.py - Core Logic                  ││
│  ├────────────────────────────────────────────────────────────┤│
│  │  • FileManager Class                                       ││
│  │  • GridFS Integration                                      ││
│  │  • File Upload/Download Logic                             ││
│  │  • Search & Filter Logic                                   ││
│  │  • Metadata Management                                     ││
│  │  • Statistics Calculation                                  ││
│  └────────────────────────────────────────────────────────────┘│
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ MongoDB Driver (pymongo)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                           │
│                      (MongoDB Service)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │  files_metadata      │    │       GridFS Storage        │  │
│  │   Collection         │    │    (fs.files + fs.chunks)   │  │
│  ├──────────────────────┤    ├──────────────────────────────┤  │
│  │ • _id                │    │ • File Binary Data          │  │
│  │ • user_id            │    │ • Chunked Storage (16MB)    │  │
│  │ • file_id (GridFS)   │    │ • Content-Type              │  │
│  │ • original_filename  │    │ • Upload Date               │  │
│  │ • custom_name        │    │ • File Metadata             │  │
│  │ • file_type          │    └──────────────────────────────┘  │
│  │ • file_size          │                                      │
│  │ • upload_date        │    ┌──────────────────────────────┐  │
│  │ • last_modified      │    │         Indexes             │  │
│  │ • description        │    ├──────────────────────────────┤  │
│  │ • tags []            │    │ • user_id + upload_date     │  │
│  └──────────────────────┘    │ • user_id + file_name       │  │
│                               │ • user_id + file_type       │  │
│                               │ • user_id + custom_name     │  │
│                               └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Upload Flow

```
User → Drag/Drop File → FileManager Component
         │
         ▼
     FormData Created (file + user_id + custom_name)
         │
         ▼
     POST /api/files/upload
         │
         ▼
     file_manager.py → upload_file()
         │
         ├──▶ Read file binary data
         ├──▶ Determine file type & category
         ├──▶ Store in GridFS (fs.files + fs.chunks)
         ├──▶ Create metadata document
         └──▶ Save to files_metadata collection
         │
         ▼
     Return metadata to frontend
         │
         ▼
     Display in file list + Update statistics
```

### Search Flow

```
User → Enter search query + Select filters
         │
         ▼
     GET /api/files/search?user_id=X&query=Y&file_type=Z
         │
         ▼
     file_manager.py → search_files()
         │
         ├──▶ Build MongoDB query
         ├──▶ Apply text search ($regex)
         ├──▶ Apply filters (type, date range)
         ├──▶ Apply sorting
         └──▶ Execute query on files_metadata
         │
         ▼
     Return matching files
         │
         ▼
     Display filtered results in UI
```

### Download Flow

```
User → Click Download Button
         │
         ▼
     GET /api/files/download/<metadata_id>
         │
         ▼
     file_manager.py → get_file()
         │
         ├──▶ Fetch metadata from files_metadata
         ├──▶ Get file_id
         ├──▶ Retrieve from GridFS using file_id
         └──▶ Read all chunks
         │
         ▼
     Send file as attachment with proper headers
         │
         ▼
     Browser downloads file
```

### Delete Flow

```
User → Click Delete → Confirm
         │
         ▼
     DELETE /api/files/<metadata_id>
         │
         ▼
     file_manager.py → delete_file()
         │
         ├──▶ Find metadata document
         ├──▶ Get file_id from metadata
         ├──▶ Delete from GridFS (removes chunks)
         └──▶ Delete metadata document
         │
         ▼
     Return success
         │
         ▼
     Remove from UI + Update statistics
```

## Component Architecture

### Frontend Components

```
UserDashboard
    │
    ├── Navbar
    │     └── Profile Dropdown
    │           └── "My Files" → Opens FileManager
    │
    └── FileManager (Modal)
          ├── Header (Title + Close Button)
          ├── Statistics Cards
          │     ├── Total Files
          │     ├── Total Size
          │     └── File Types Count
          ├── Upload Section
          │     ├── Drag-Drop Zone
          │     ├── File Browser
          │     ├── Custom Name Input
          │     └── Upload Button + Progress
          ├── Search & Filters Section
          │     ├── Search Input
          │     ├── Type Filter Dropdown
          │     └── Sort Options
          └── Files List
                └── For each file:
                      ├── File Icon (by type)
                      ├── File Info (name, size, date)
                      └── Actions
                            ├── Edit Button
                            ├── Download Button
                            └── Delete Button
```

### Backend Classes

```
FileManager Class
    │
    ├── __init__()
    │     ├── Connect to MongoDB
    │     ├── Initialize GridFS
    │     └── Create indexes
    │
    ├── upload_file()
    │     ├── Determine file type
    │     ├── Store in GridFS
    │     └── Save metadata
    │
    ├── get_file()
    │     └── Retrieve from GridFS
    │
    ├── search_files()
    │     ├── Build query
    │     ├── Apply filters
    │     └── Return results
    │
    ├── get_user_files()
    │     └── Paginated list
    │
    ├── update_file_metadata()
    │     └── Update document
    │
    ├── delete_file()
    │     ├── Delete GridFS file
    │     └── Delete metadata
    │
    └── get_file_statistics()
          └── Aggregate stats
```

## File Type Categories

```
Input File Extensions
        │
        ▼
    Categorization Logic (_get_file_category)
        │
        ├─▶ .pdf              → "pdf"
        ├─▶ .xlsx, .xls       → "excel"
        ├─▶ .doc, .docx       → "word"
        ├─▶ .jpg, .png        → "image"
        ├─▶ .csv              → "csv"
        ├─▶ .txt, .md         → "text"
        ├─▶ .ppt, .pptx       → "powerpoint"
        ├─▶ .zip, .rar        → "archive"
        ├─▶ .mp4, .avi        → "video"
        ├─▶ .mp3, .wav        → "audio"
        └─▶ (other)           → "other"
        │
        ▼
    Stored in metadata.file_type
        │
        ▼
    Used for:
        • Filtering
        • Icon display
        • Statistics
```

## Security Architecture

```
Request
    │
    ▼
┌──────────────────────┐
│  File Type Check     │ → Only allowed extensions
├──────────────────────┤
│  Filename Sanitize   │ → secure_filename()
├──────────────────────┤
│  User ID Validation  │ → Required for all operations
├──────────────────────┤
│  MIME Type Verify    │ → Content-type validation
├──────────────────────┤
│  User Isolation      │ → Files filtered by user_id
└──────────────────────┘
    │
    ▼
Proceed with operation
```

## Performance Optimizations

```
Request Flow
    │
    ├─▶ Database Indexes
    │       └─▶ Fast queries on user_id, file_type, date
    │
    ├─▶ GridFS Chunking
    │       └─▶ Efficient storage & streaming
    │
    ├─▶ Pagination
    │       └─▶ Limit results (default 50)
    │
    ├─▶ Metadata Separation
    │       └─▶ Search without loading file data
    │
    └─▶ Indexes
            └─▶ Compound indexes for common queries
```

## Technology Stack

```
┌─────────────────────────────────────┐
│         Frontend Layer              │
│  • React 18                         │
│  • Tailwind CSS                     │
│  • Axios                            │
│  • React Icons                      │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│         API Layer                   │
│  • Flask 3.0.0                      │
│  • flask-cors                       │
│  • RESTful endpoints                │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│      Business Logic Layer           │
│  • FileManager class                │
│  • File type detection              │
│  • Search algorithms                │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│      File Processing Layer          │
│  • python-magic-bin                 │
│  • Pillow (images)                  │
│  • openpyxl (Excel)                 │
│  • PyPDF2 (PDFs)                    │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│      Storage Layer                  │
│  • MongoDB                          │
│  • GridFS                           │
│  • pymongo driver                   │
└─────────────────────────────────────┘
```

This architecture provides a robust, scalable, and secure file management system!
