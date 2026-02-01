import React, { useState, useEffect } from 'react';
import { Image, Upload, FileText, X, Download, Search, Filter, Calendar, Tag, Star, Trash2, Eye, Edit } from 'lucide-react';
import api from '../api';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('photo'); // 'photo' or 'document'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedItem, setSelectedItem] = useState(null);

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    tags: [],
    category: 'Personal',
    file: null,
    filePreview: null,
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { name: 'Personal', icon: '👤', color: 'bg-blue-500' },
    { name: 'Family', icon: '👨‍👩‍👧', color: 'bg-green-500' },
    { name: 'Work', icon: '💼', color: 'bg-purple-500' },
    { name: 'Travel', icon: '✈️', color: 'bg-orange-500' },
    { name: 'Food', icon: '🍔', color: 'bg-red-500' },
    { name: 'Events', icon: '🎉', color: 'bg-pink-500' },
    { name: 'Documents', icon: '📄', color: 'bg-yellow-500' },
    { name: 'Receipts', icon: '🧾', color: 'bg-teal-500' },
    { name: 'Medicine', icon: '💊', color: 'bg-indigo-500' },
    { name: 'Reports', icon: '📊', color: 'bg-cyan-500' },
    { name: 'License', icon: '🪪', color: 'bg-lime-500' },
    { name: 'NID', icon: '🆔', color: 'bg-amber-500' },
    { name: 'Bill', icon: '💳', color: 'bg-rose-500' },
    { name: 'Certificate', icon: '🎓', color: 'bg-emerald-500' },
    { name: 'Insurance', icon: '🛡️', color: 'bg-violet-500' },
    { name: 'Other', icon: '📦', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/api/gallery/items');
      if (response.data.success) {
        setPhotos(response.data.photos || []);
        setDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      // Load from localStorage as fallback
      const savedPhotos = localStorage.getItem('photoGallery');
      const savedDocs = localStorage.getItem('documentGallery');
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      if (savedDocs) setDocuments(JSON.parse(savedDocs));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({
          ...newItem,
          file: reader.result,
          filePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!newItem.title || !newItem.file) {
      alert('অনুগ্রহ করে শিরোনাম এবং ফাইল নির্বাচন করুন');
      return;
    }

    const itemData = {
      id: `ITEM${Date.now()}`,
      ...newItem,
      createdAt: new Date().toISOString(),
      type: uploadType
    };

    try {
      const response = await api.post('/api/gallery/item', itemData);
      
      if (response.data.success) {
        if (uploadType === 'photo') {
          const updatedPhotos = [itemData, ...photos];
          setPhotos(updatedPhotos);
          localStorage.setItem('photoGallery', JSON.stringify(updatedPhotos));
        } else {
          const updatedDocs = [itemData, ...documents];
          setDocuments(updatedDocs);
          localStorage.setItem('documentGallery', JSON.stringify(updatedDocs));
        }
        
        setShowUploadModal(false);
        resetForm();
        alert('✅ আপলোড সফল হয়েছে!');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      // Save to localStorage as fallback
      if (uploadType === 'photo') {
        const updatedPhotos = [itemData, ...photos];
        setPhotos(updatedPhotos);
        localStorage.setItem('photoGallery', JSON.stringify(updatedPhotos));
      } else {
        const updatedDocs = [itemData, ...documents];
        setDocuments(updatedDocs);
        localStorage.setItem('documentGallery', JSON.stringify(updatedDocs));
      }
      setShowUploadModal(false);
      resetForm();
      alert('✅ আপলোড সফল হয়েছে (Locally)!');
    }
  };

  const resetForm = () => {
    setNewItem({
      title: '',
      description: '',
      tags: [],
      category: 'Personal',
      file: null,
      filePreview: null,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id, type) => {
    if (!confirm('মুছে ফেলতে চান?')) return;

    try {
      await api.delete(`/api/gallery/item/${id}`);
      
      if (type === 'photo') {
        const updated = photos.filter(p => p.id !== id);
        setPhotos(updated);
        localStorage.setItem('photoGallery', JSON.stringify(updated));
      } else {
        const updated = documents.filter(d => d.id !== id);
        setDocuments(updated);
        localStorage.setItem('documentGallery', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      // Delete from localStorage
      if (type === 'photo') {
        const updated = photos.filter(p => p.id !== id);
        setPhotos(updated);
        localStorage.setItem('photoGallery', JSON.stringify(updated));
      } else {
        const updated = documents.filter(d => d.id !== id);
        setDocuments(updated);
        localStorage.setItem('documentGallery', JSON.stringify(updated));
      }
    }
  };

  const getFilteredItems = (items) => {
    let filtered = items;

    if (filterTag !== 'All') {
      filtered = filtered.filter(item => item.category === filterTag);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const downloadItem = (item) => {
    const link = document.createElement('a');
    link.href = item.file;
    link.download = `${item.title}.${item.file.split(';')[0].split('/')[1]}`;
    link.click();
  };

  const allItems = [...photos, ...documents];
  const filteredPhotos = getFilteredItems(photos);
  const filteredDocuments = getFilteredItems(documents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Image className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">ফটো গ্যালারি ও ডকুমেন্ট</h1>
                <p className="text-gray-600">আপনার ছবি এবং ডকুমেন্ট সংরক্ষণ করুন</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUploadType('photo');
                  setShowUploadModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Upload className="w-5 h-5" />
                ফটো আপলোড
              </button>
              <button
                onClick={() => {
                  setUploadType('document');
                  setShowUploadModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <FileText className="w-5 h-5" />
                ডকুমেন্ট আপলোড
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <Image className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">মোট ফটো</h3>
            <p className="text-4xl font-bold">{photos.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <FileText className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">মোট ডকুমেন্ট</h3>
            <p className="text-4xl font-bold">{documents.length}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <Tag className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">মোট আইটেম</h3>
            <p className="text-4xl font-bold">{allItems.length}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম, বিবরণ, বা ট্যাগ খুঁজুন..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="All">সব ক্যাটেগরি</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
            >
              {viewMode === 'grid' ? '📋 List' : '🔲 Grid'}
            </button>
          </div>
        </div>

        {/* Photos Section */}
        {filteredPhotos.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-6 h-6 text-blue-600" />
              ফটো গ্যালারি
            </h2>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
              {filteredPhotos.map(photo => (
                <div key={photo.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={viewMode === 'grid' ? 'h-48' : 'w-48 flex-shrink-0'}>
                    <img
                      src={photo.file}
                      alt={photo.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedItem(photo)}
                    />
                  </div>
                  
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{photo.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadItem(photo)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(photo.id, 'photo')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {photo.description && (
                      <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(photo.date).toLocaleDateString('bn-BD')}
                    </div>
                    
                    {photo.category && (
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-bold text-white ${categories.find(c => c.name === photo.category)?.color}`}>
                        {categories.find(c => c.name === photo.category)?.icon} {photo.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Section */}
        {filteredDocuments.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              ডকুমেন্ট লাইব্রেরি
            </h2>

            <div className="space-y-3">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.date).toLocaleDateString('bn-BD')}
                        </span>
                        {doc.category && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${categories.find(c => c.name === doc.category)?.color}`}>
                            {doc.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(doc)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadItem(doc)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, 'document')}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPhotos.length === 0 && filteredDocuments.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">কোন আইটেম পাওয়া যায়নি</p>
            <p className="text-gray-400">নতুন ফটো বা ডকুমেন্ট আপলোড করুন</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {uploadType === 'photo' ? '📸 ফটো আপলোড' : '📄 ডকুমেন্ট আপলোড'}
                </h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="p-6 space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    ফাইল নির্বাচন করুন *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {newItem.filePreview ? (
                      <div className="relative">
                        <img
                          src={newItem.filePreview}
                          alt="Preview"
                          className="w-full h-64 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setNewItem({...newItem, file: null, filePreview: null})}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-600 font-semibold">ক্লিক করে ফাইল নির্বাচন করুন</span>
                        <span className="text-xs text-gray-400 mt-1">Max 10MB</span>
                        <input
                          type="file"
                          accept={uploadType === 'photo' ? 'image/*' : 'image/*,application/pdf'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">শিরোনাম *</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ক্যাটেগরি</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">তারিখ</label>
                  <input
                    type="date"
                    value={newItem.date}
                    onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">বিবরণ</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows="3"
                    placeholder="বিস্তারিত লিখুন..."
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      resetForm();
                    }}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <img
                  src={selectedItem.file}
                  alt={selectedItem.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg mb-4"
                />
                
                {selectedItem.description && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>তারিখ: {new Date(selectedItem.date).toLocaleDateString('bn-BD')}</span>
                  <span className={`px-3 py-1 rounded-full text-white font-bold ${categories.find(c => c.name === selectedItem.category)?.color}`}>
                    {selectedItem.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
