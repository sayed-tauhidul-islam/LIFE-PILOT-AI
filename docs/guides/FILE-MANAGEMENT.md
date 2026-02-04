# File Management API Documentation

## Overview

Complete file management system with upload, storage, search, and download capabilities.

## Supported File Types

- **PDF**: .pdf
- **Excel**: .xlsx, .xls, .xlsm, .xlsb
- **Word**: .doc, .docx, .odt
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .svg, .webp, .ico
- **CSV**: .csv, .tsv
- **Text**: .txt, .md, .rtf
- **PowerPoint**: .ppt, .pptx, .odp
- **Archives**: .zip, .rar, .7z, .tar, .gz
- **Video**: .mp4, .avi, .mov, .wmv, .flv, .mkv
- **Audio**: .mp3, .wav, .flac, .aac, .ogg

## API Endpoints

### 1. Upload File

**POST** `/api/files/upload`

Upload a file to the system.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `file`: File to upload (required)
  - `user_id`: User identifier (required)
  - `custom_name`: Custom name for the file (optional)

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "file_metadata_id",
    "user_id": "user123",
    "file_id": "gridfs_file_id",
    "original_filename": "document.pdf",
    "custom_name": "My Important Document",
    "file_extension": ".pdf",
    "file_type": "pdf",
    "mime_type": "application/pdf",
    "file_size": 1048576,
    "upload_date": "2024-01-15T10:30:00",
    "last_modified": "2024-01-15T10:30:00"
  }
}
```

### 2. Search Files

**GET** `/api/files/search`

Search for files with advanced filters.

**Query Parameters:**

- `user_id` (required): User identifier
- `query` (optional): Search text (searches filename, custom name, description, tags)
- `file_type` (optional): Filter by file type (pdf, excel, word, image, csv, etc.)
- `start_date` (optional): Filter files uploaded after this date (ISO format)
- `end_date` (optional): Filter files uploaded before this date (ISO format)
- `sort_by` (optional): Sort field (upload_date, custom_name, file_size) - default: upload_date
- `sort_order` (optional): Sort direction (1 for ascending, -1 for descending) - default: -1

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "file_metadata_id",
      "user_id": "user123",
      "file_id": "gridfs_file_id",
      "original_filename": "report.pdf",
      "custom_name": "Monthly Report January",
      "file_type": "pdf",
      "file_size": 524288,
      "upload_date": "2024-01-15T10:30:00",
      "last_modified": "2024-01-15T10:30:00"
    }
  ],
  "count": 1
}
```

### 3. List User Files

**GET** `/api/files/list`

Get all files for a user with pagination.

**Query Parameters:**

- `user_id` (required): User identifier
- `limit` (optional): Number of files to return - default: 50
- `skip` (optional): Number of files to skip - default: 0

**Response:**

```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

### 4. Download File

**GET** `/api/files/download/<metadata_id>`

Download a file.

**Path Parameters:**

- `metadata_id`: File metadata ID

**Response:**

- File binary data with appropriate content-type header

### 5. Delete File

**DELETE** `/api/files/<metadata_id>`

Delete a file and its metadata.

**Path Parameters:**

- `metadata_id`: File metadata ID

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 6. Update File Metadata

**PUT** `/api/files/<metadata_id>`

Update file metadata (name, description, tags).

**Path Parameters:**

- `metadata_id`: File metadata ID

**Request Body:**

```json
{
  "custom_name": "New File Name",
  "description": "Updated description",
  "tags": ["important", "work", "2024"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "File metadata updated successfully"
}
```

### 7. File Statistics

**GET** `/api/files/statistics`

Get file statistics for a user.

**Query Parameters:**

- `user_id` (required): User identifier

**Response:**

```json
{
  "success": true,
  "data": {
    "total_files": 45,
    "total_size": 157286400,
    "by_type": {
      "pdf": {
        "count": 20,
        "size": 104857600
      },
      "excel": {
        "count": 15,
        "size": 31457280
      },
      "image": {
        "count": 10,
        "size": 20971520
      }
    }
  }
}
```

## File Storage

Files are stored using MongoDB GridFS, which:

- Handles files larger than 16MB
- Stores files in chunks for efficient streaming
- Maintains file metadata separately for fast searching
- Provides built-in file versioning capabilities

## Search Capabilities

The search system supports:

1. **Text Search**: Search in filename, custom name, description, and tags
2. **File Type Filtering**: Filter by specific file categories
3. **Date Range Filtering**: Find files uploaded within a date range
4. **Custom Sorting**: Sort by date, name, or size
5. **Flexible Sort Order**: Ascending or descending

## File Categories

Files are automatically categorized by extension:

- **pdf**: PDF documents
- **excel**: Spreadsheets
- **word**: Word documents
- **image**: Image files
- **csv**: CSV/TSV data files
- **text**: Plain text files
- **powerpoint**: Presentations
- **archive**: Compressed files
- **video**: Video files
- **audio**: Audio files
- **other**: Uncategorized files

## Frontend Integration

### FileManager Component

The FileManager component provides:

- **Drag-and-drop upload**: Drop files directly into the upload zone
- **Custom file naming**: Rename files before uploading
- **Advanced search**: Search with filters for type, date, and name
- **File statistics**: View total files, size, and type breakdown
- **File operations**: Download, delete, and edit metadata
- **Theme support**: Matches application theme (light/dark/blue)
- **Real-time updates**: Automatically refreshes after operations

### Integration with Navbar

Access file manager through:

1. Click profile icon in navbar
2. Select "My Files" from dropdown
3. File manager opens in full-screen modal

## Security Considerations

1. **File Type Validation**: Only allowed file types can be uploaded
2. **User Isolation**: Files are isolated by user_id
3. **Secure Filenames**: Filenames are sanitized using secure_filename
4. **Content-Type Validation**: MIME types are verified
5. **Access Control**: All operations require valid user_id

## Usage Examples

### Upload File (JavaScript)

```javascript
const formData = new FormData();
formData.append("file", fileObject);
formData.append("user_id", "user123");
formData.append("custom_name", "My Document");

const response = await axios.post("/api/files/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

### Search Files (JavaScript)

```javascript
const response = await axios.get("/api/files/search", {
  params: {
    user_id: "user123",
    query: "report",
    file_type: "pdf",
    sort_by: "upload_date",
    sort_order: -1,
  },
});
```

### Download File (JavaScript)

```javascript
const response = await axios.get(`/api/files/download/${fileId}`, {
  responseType: "blob",
});

const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement("a");
link.href = url;
link.setAttribute("download", fileName);
document.body.appendChild(link);
link.click();
link.remove();
```

## Performance Optimization

1. **Indexed Searches**: MongoDB indexes on user_id, file_name, file_type, and upload_date
2. **Pagination**: List endpoint supports limit/skip for large file collections
3. **Efficient Storage**: GridFS chunks files for optimal storage and retrieval
4. **Metadata Caching**: Separate metadata collection for fast searches without loading file data

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad request (missing parameters, invalid file type)
- `404`: File not found
- `500`: Server error
