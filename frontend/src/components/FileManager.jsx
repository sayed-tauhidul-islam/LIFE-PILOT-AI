import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUpload, FaSearch, FaDownload, FaTrash, FaEdit, FaFile, FaFilePdf, 
  FaFileExcel, FaFileWord, FaFileImage, FaFileCsv, FaFileArchive,
  FaTimes, FaFilter, FaSortAmountDown, FaSortAmountUp, FaCalendar,
  FaTag, FaInfoCircle, FaFolder
} from 'react-icons/fa';
import axios from 'axios';

const FileManager = ({ userId, theme = 'light', onClose }) => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('upload_date');
  const [sortOrder, setSortOrder] = useState(-1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customName, setCustomName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Theme colors
  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-50',
        input: 'bg-white border-gray-300',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        card: 'bg-gray-50',
        accent: 'text-red-600'
      },
      dark: {
        bg: 'bg-gray-800',
        text: 'text-white',
        border: 'border-gray-600',
        hover: 'hover:bg-gray-700',
        input: 'bg-gray-700 border-gray-600 text-white',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        card: 'bg-gray-700',
        accent: 'text-red-400'
      },
      blue: {
        bg: 'bg-blue-900',
        text: 'text-blue-50',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-800',
        input: 'bg-blue-800 border-blue-600 text-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        buttonSecondary: 'bg-blue-700 hover:bg-blue-600 text-blue-50',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        card: 'bg-blue-800',
        accent: 'text-red-400'
      }
    };
    return themes[theme] || themes.light;
  };

  const colors = getThemeColors();

  // File type icons
  const getFileIcon = (fileType) => {
    const icons = {
      pdf: <FaFilePdf className="text-red-500 text-3xl" />,
      excel: <FaFileExcel className="text-green-500 text-3xl" />,
      word: <FaFileWord className="text-blue-500 text-3xl" />,
      image: <FaFileImage className="text-purple-500 text-3xl" />,
      csv: <FaFileCsv className="text-green-600 text-3xl" />,
      archive: <FaFileArchive className="text-yellow-500 text-3xl" />,
      other: <FaFile className="text-gray-500 text-3xl" />
    };
    return icons[fileType] || icons.other;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Load files
  const loadFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files/search`, {
        params: {
          user_id: userId,
          query: searchQuery || undefined,
          file_type: fileTypeFilter || undefined,
          sort_by: sortBy,
          sort_order: sortOrder
        }
      });

      if (response.data.success) {
        setFiles(response.data.data);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files/statistics`, {
        params: { user_id: userId }
      });

      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadFiles();
      loadStatistics();
    }
  }, [userId, searchQuery, fileTypeFilter, sortBy, sortOrder]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCustomName(file.name);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setCustomName(file.name);
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', userId);
    formData.append('custom_name', customName);

    try {
      const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        alert('File uploaded successfully!');
        setSelectedFile(null);
        setCustomName('');
        loadFiles();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Download file
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${API_URL}/api/files/download/${fileId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  // Delete file
  const handleDelete = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await axios.delete(`${API_URL}/api/files/${fileId}`);
      
      if (response.data.success) {
        alert('File deleted successfully');
        loadFiles();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  // Start editing
  const startEdit = (file) => {
    setEditingFile(file._id);
    setEditName(file.custom_name);
    setEditDescription(file.description || '');
  };

  // Save edit
  const saveEdit = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/files/${editingFile}`, {
        custom_name: editName,
        description: editDescription
      });

      if (response.data.success) {
        alert('File updated successfully');
        setEditingFile(null);
        loadFiles();
      }
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Failed to update file');
    }
  };

  return (
    <div className={`fixed inset-0 ${colors.bg} ${colors.text} z-50 overflow-auto`}>
      {/* Header */}
      <div className={`sticky top-0 ${colors.bg} border-b ${colors.border} p-4 flex justify-between items-center z-10`}>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaFolder className={colors.accent} />
          File Manager
        </h2>
        <button
          onClick={onClose}
          className={`${colors.buttonSecondary} p-2 rounded-lg`}
        >
          <FaTimes />
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`${colors.card} p-4 rounded-lg border ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Files</p>
                  <p className="text-2xl font-bold">{statistics.total_files}</p>
                </div>
                <FaFile className="text-3xl opacity-50" />
              </div>
            </div>
            <div className={`${colors.card} p-4 rounded-lg border ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Size</p>
                  <p className="text-2xl font-bold">{formatFileSize(statistics.total_size)}</p>
                </div>
                <FaInfoCircle className="text-3xl opacity-50" />
              </div>
            </div>
            <div className={`${colors.card} p-4 rounded-lg border ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">File Types</p>
                  <p className="text-2xl font-bold">{Object.keys(statistics.by_type || {}).length}</p>
                </div>
                <FaTag className="text-3xl opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className={`${colors.card} p-6 rounded-lg border ${colors.border} mb-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaUpload className={colors.accent} />
            Upload File
          </h3>

          <div
            className={`border-2 border-dashed ${colors.border} rounded-lg p-8 text-center ${
              dragActive ? 'bg-blue-50' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  {getFileIcon('other')}
                  <div>
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="text-sm opacity-70">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Enter custom name (optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className={`w-full max-w-md mx-auto px-4 py-2 border rounded-lg ${colors.input}`}
                />

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`${colors.button} px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50`}
                  >
                    <FaUpload />
                    {isUploading ? `Uploading ${uploadProgress}%` : 'Upload'}
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className={`${colors.buttonSecondary} px-6 py-2 rounded-lg`}
                  >
                    Cancel
                  </button>
                </div>

                {isUploading && (
                  <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <FaUpload className="mx-auto text-5xl opacity-30 mb-4" />
                <p className="mb-2">Drag and drop a file here, or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`${colors.button} px-6 py-2 rounded-lg`}
                >
                  Browse Files
                </button>
                <p className="text-sm opacity-70 mt-2">
                  Supported: PDF, Excel, Word, Images, CSV, and more
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.gif,.csv,.txt,.zip,.rar"
          />
        </div>

        {/* Search and Filters */}
        <div className={`${colors.card} p-4 rounded-lg border ${colors.border} mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 opacity-50" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${colors.input}`}
                />
              </div>
            </div>

            {/* File Type Filter */}
            <div>
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg ${colors.input}`}
              >
                <option value="">All Types</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="image">Image</option>
                <option value="csv">CSV</option>
                <option value="archive">Archive</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`flex-1 px-4 py-2 border rounded-lg ${colors.input}`}
              >
                <option value="upload_date">Date</option>
                <option value="custom_name">Name</option>
                <option value="file_size">Size</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 1 ? -1 : 1)}
                className={`${colors.buttonSecondary} px-3 py-2 rounded-lg`}
              >
                {sortOrder === 1 ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className={`${colors.card} p-8 rounded-lg border ${colors.border} text-center`}>
              <FaFolder className="mx-auto text-5xl opacity-30 mb-3" />
              <p className="opacity-70">No files found</p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file._id} className={`${colors.card} p-4 rounded-lg border ${colors.border} ${colors.hover}`}>
                {editingFile === file._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg ${colors.input}`}
                      placeholder="File name"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg ${colors.input}`}
                      placeholder="Description (optional)"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className={`${colors.button} px-4 py-2 rounded-lg`}>
                        Save
                      </button>
                      <button onClick={() => setEditingFile(null)} className={`${colors.buttonSecondary} px-4 py-2 rounded-lg`}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getFileIcon(file.file_type)}
                      <div className="flex-1">
                        <h4 className="font-semibold">{file.custom_name}</h4>
                        <p className="text-sm opacity-70">
                          {file.original_filename} • {formatFileSize(file.file_size)} • {formatDate(file.upload_date)}
                        </p>
                        {file.description && (
                          <p className="text-sm opacity-60 mt-1">{file.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(file)}
                        className={`${colors.buttonSecondary} p-2 rounded-lg`}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDownload(file._id, file.custom_name)}
                        className={`${colors.button} p-2 rounded-lg`}
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className={`${colors.danger} p-2 rounded-lg`}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
