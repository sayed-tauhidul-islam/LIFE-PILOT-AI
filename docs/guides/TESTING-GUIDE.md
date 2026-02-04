# File Management System - Testing Guide

## Quick Test Steps

### 1. Verify Backend is Running

```bash
# Check backend health
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "healthy" }
```

### 2. Test File Upload

```bash
# Create a test file
echo "This is a test file" > test.txt

# Upload using curl
curl -X POST http://localhost:5000/api/files/upload \
  -F "file=@test.txt" \
  -F "user_id=test-user" \
  -F "custom_name=My Test File"
```

### 3. Test File Search

```bash
# Search all files for user
curl "http://localhost:5000/api/files/search?user_id=test-user"

# Search with query
curl "http://localhost:5000/api/files/search?user_id=test-user&query=test"

# Search by file type
curl "http://localhost:5000/api/files/search?user_id=test-user&file_type=text"
```

### 4. Test File Statistics

```bash
curl "http://localhost:5000/api/files/statistics?user_id=test-user"
```

### 5. Test File Download

```bash
# Get file ID from search results, then:
curl "http://localhost:5000/api/files/download/<FILE_ID>" -o downloaded_file.txt
```

## Frontend Testing

### Access File Manager

1. Open http://localhost:3000
2. Fill in user profile
3. Click profile icon (top right)
4. Select "My Files"
5. File Manager should open

### Test Upload

1. Drag a file into the upload zone OR
2. Click "Browse Files" and select a file
3. Enter a custom name (optional)
4. Click "Upload"
5. File should appear in the list below

### Test Search

1. Type in the search bar
2. Select a file type from dropdown
3. Change sort options
4. Results should update in real-time

### Test Download

1. Find a file in the list
2. Click the download button (blue)
3. File should download to your computer

### Test Edit

1. Click edit button (gray) on a file
2. Modify the name or description
3. Click "Save"
4. Changes should be reflected

### Test Delete

1. Click delete button (red) on a file
2. Confirm deletion
3. File should be removed from list

## Expected File Types Support

Test with these file types:

- ✅ test.pdf (PDF)
- ✅ test.xlsx (Excel)
- ✅ test.docx (Word)
- ✅ test.jpg (Image)
- ✅ test.csv (CSV)
- ✅ test.txt (Text)
- ✅ test.zip (Archive)

## Troubleshooting

### File Upload Fails

- Check file type is allowed
- Verify user_id is provided
- Check backend logs for errors

### Search Returns Empty

- Verify files exist for user_id
- Check search filters
- Try searching without filters

### Download Fails

- Verify file_id is correct
- Check GridFS has the file
- Check backend logs

### UI Not Showing

- Clear browser cache
- Check console for errors
- Verify FileManager component is imported

## Performance Testing

### Upload Large File

```bash
# Create 10MB test file
dd if=/dev/zero of=large_test.bin bs=1M count=10

# Upload
curl -X POST http://localhost:5000/api/files/upload \
  -F "file=@large_test.bin" \
  -F "user_id=test-user" \
  -F "custom_name=Large Test File"
```

### Multiple Files

Upload 10+ files and test:

- Search performance
- Pagination
- Statistics accuracy

## Verification Checklist

### Backend

- [ ] All 7 file endpoints respond
- [ ] Files stored in GridFS
- [ ] Metadata in files_metadata collection
- [ ] Search returns correct results
- [ ] Download works for all file types
- [ ] Delete removes both file and metadata
- [ ] Statistics accurate

### Frontend

- [ ] File Manager opens from navbar
- [ ] Drag-drop works
- [ ] Browse files works
- [ ] Upload shows progress
- [ ] Search filters work
- [ ] Sort options work
- [ ] Download button works
- [ ] Edit saves changes
- [ ] Delete confirms and removes
- [ ] Statistics display correctly
- [ ] Theme changes apply

### Database

- [ ] files_metadata collection exists
- [ ] fs.files collection exists (GridFS)
- [ ] fs.chunks collection exists (GridFS)
- [ ] Indexes created
- [ ] Files retrievable

## Success Criteria

✅ All file types upload successfully
✅ Search finds files by name
✅ Filter by type works
✅ Download retrieves correct file
✅ Edit updates metadata
✅ Delete removes file completely
✅ Statistics show accurate data
✅ UI theme changes apply
✅ No console errors
✅ Backend logs no errors

## Test Results Template

```
Date: ____________
Tester: ____________

Backend Tests:
[ ] Health check: ____
[ ] Upload: ____
[ ] Search: ____
[ ] Download: ____
[ ] Delete: ____
[ ] Statistics: ____

Frontend Tests:
[ ] Open File Manager: ____
[ ] Drag-drop upload: ____
[ ] Browse upload: ____
[ ] Search: ____
[ ] Filter: ____
[ ] Sort: ____
[ ] Download: ____
[ ] Edit: ____
[ ] Delete: ____

Issues Found:
_________________________
_________________________

Overall Status: ____
```
