import React, { useState, useEffect } from 'react';
import { Package, Upload, Search, TrendingUp, TrendingDown, Camera, X, Check, AlertCircle, DollarSign, Calendar, Star, Heart, ShoppingBag } from 'lucide-react';
import api from '../api';

const ProductTracker = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Food',
    price: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    image: null,
    imagePreview: null,
    description: '',
    brand: '',
    quantity: 1,
    unit: 'piece'
  });

  const categories = [
    { name: 'Food', icon: '🍎', color: 'bg-green-500' },
    { name: 'Medicine', icon: '💊', color: 'bg-red-500' },
    { name: 'Supplement', icon: '💪', color: 'bg-orange-500' },
    { name: 'Personal Care', icon: '🧴', color: 'bg-pink-500' },
    { name: 'Household', icon: '🏠', color: 'bg-blue-500' },
    { name: 'Electronics', icon: '📱', color: 'bg-purple-500' },
    { name: 'Clothing', icon: '👕', color: 'bg-indigo-500' },
    { name: 'Other', icon: '📦', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/api/health/products');
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Load from localStorage as fallback
      const savedProducts = localStorage.getItem('healthProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: reader.result,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAIRecommendation = async (product) => {
    try {
      // Get user's health conditions from localStorage or API
      const healthConditions = JSON.parse(localStorage.getItem('healthConditions') || '[]');
      
      const response = await api.post('/api/health/product-recommendation', {
        product: product,
        healthConditions: healthConditions
      });

      return response.data.recommendation;
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      // Fallback recommendations based on category
      if (product.category === 'Medicine' || product.category === 'Supplement') {
        return {
          suitable: 'warning',
          message: '⚠️ ডাক্তারের পরামর্শ ছাড়া গ্রহণ করবেন না',
          tips: ['ডোজ সঠিকভাবে মেনে চলুন', 'পার্শ্বপ্রতিক্রিয়া লক্ষ্য রাখুন']
        };
      } else if (product.category === 'Food') {
        return {
          suitable: 'good',
          message: '✅ স্বাস্থ্যকর খাবার',
          tips: ['পরিমিত পরিমাণে খান', 'তাজা রাখুন']
        };
      }
      return {
        suitable: 'neutral',
        message: 'ℹ️ সাধারণ পণ্য',
        tips: ['গুণমান পরীক্ষা করুন']
      };
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price) {
      alert('অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }

    // Get AI recommendation
    const aiRecommendation = await getAIRecommendation(newProduct);

    const productData = {
      ...newProduct,
      id: `PRD${Date.now()}`,
      price: parseFloat(newProduct.price),
      aiRecommendation: aiRecommendation,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await api.post('/api/health/product', productData);
      
      if (response.data.success) {
        setProducts([productData, ...products]);
        // Also save to localStorage
        const updatedProducts = [productData, ...products];
        localStorage.setItem('healthProducts', JSON.stringify(updatedProducts));
        
        setShowAddModal(false);
        setNewProduct({
          name: '',
          category: 'Food',
          price: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          image: null,
          imagePreview: null,
          description: '',
          brand: '',
          quantity: 1,
          unit: 'piece'
        });
        alert('✅ পণ্য সংরক্ষিত হয়েছে!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      // Save to localStorage as fallback
      const updatedProducts = [productData, ...products];
      setProducts(updatedProducts);
      localStorage.setItem('healthProducts', JSON.stringify(updatedProducts));
      setShowAddModal(false);
      alert('✅ পণ্য সংরক্ষিত হয়েছে (Locally)!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('এই পণ্য মুছে ফেলতে চান?')) return;

    try {
      await api.delete(`/api/health/product/${productId}`);
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('healthProducts', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      // Delete from localStorage
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('healthProducts', JSON.stringify(updatedProducts));
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (filterCategory !== 'All') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const calculateStats = () => {
    const totalSpent = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const avgPrice = products.length > 0 ? totalSpent / products.length : 0;
    
    return {
      totalProducts: products.length,
      totalSpent: totalSpent,
      avgPrice: avgPrice
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <Package className="w-10 h-10 mb-2" />
          <h3 className="text-lg font-semibold mb-1">মোট পণ্য</h3>
          <p className="text-4xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <DollarSign className="w-10 h-10 mb-2" />
          <h3 className="text-lg font-semibold mb-1">মোট খরচ</h3>
          <p className="text-4xl font-bold">৳{stats.totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <TrendingUp className="w-10 h-10 mb-2" />
          <h3 className="text-lg font-semibold mb-1">গড় মূল্য</h3>
          <p className="text-4xl font-bold">৳{stats.avgPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্য খুঁজুন..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          >
            <option value="All">সব ক্যাটেগরি</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            পণ্য যোগ করুন
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {getFilteredProducts().length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">কোন পণ্য পাওয়া যায়নি</p>
          <p className="text-gray-400">নতুন পণ্য যোগ করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredProducts().map((product) => {
            const category = categories.find(c => c.name === product.category);
            const daysSincePurchase = Math.floor((new Date() - new Date(product.purchaseDate)) / (1000 * 60 * 60 * 24));

            return (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                {/* Product Image */}
                {product.image ? (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${category?.color}`}>
                      {category?.icon} {product.category}
                    </span>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  
                  {/* Brand */}
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
                  )}

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <div>
                      <p className="text-2xl font-bold text-green-600">৳{product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{product.quantity} {product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Purchase Date</p>
                      <p className="text-sm font-semibold text-gray-700">{product.purchaseDate}</p>
                      <p className="text-xs text-gray-400">{daysSincePurchase} দিন আগে</p>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  {product.aiRecommendation && (
                    <div className={`p-3 rounded-lg ${
                      product.aiRecommendation.suitable === 'good' ? 'bg-green-50 border-2 border-green-200' :
                      product.aiRecommendation.suitable === 'warning' ? 'bg-yellow-50 border-2 border-yellow-200' :
                      'bg-gray-50 border-2 border-gray-200'
                    }`}>
                      <p className="text-sm font-semibold mb-1">{product.aiRecommendation.message}</p>
                      {product.aiRecommendation.tips && (
                        <ul className="text-xs text-gray-600 space-y-1">
                          {product.aiRecommendation.tips.map((tip, idx) => (
                            <li key={idx}>• {tip}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">নতুন পণ্য যোগ করুন</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">পণ্যের ছবি</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {newProduct.imagePreview ? (
                    <div className="relative">
                      <img
                        src={newProduct.imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setNewProduct({...newProduct, image: null, imagePreview: null})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-600 font-semibold">ছবি আপলোড করুন</span>
                      <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">পণ্যের নাম *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ব্র্যান্ড</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ক্যাটেগরি *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">মূল্য (৳) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ক্রয়ের তারিখ *</label>
                  <input
                    type="date"
                    value={newProduct.purchaseDate}
                    onChange={(e) => setNewProduct({...newProduct, purchaseDate: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">পরিমাণ</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                      className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                    <select
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="piece">piece</option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="box">box</option>
                      <option value="packet">packet</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">বিবরণ</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  rows="3"
                  placeholder="পণ্যের বিবরণ লিখুন..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTracker;
