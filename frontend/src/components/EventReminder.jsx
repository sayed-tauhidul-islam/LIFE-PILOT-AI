import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Gift, Clock, Plus, X, Edit, Trash2, Check, AlertCircle, User, Phone, MapPin, Repeat } from 'lucide-react';
import api from '../api';

const EventReminder = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'birthdays', 'bills', 'appointments'

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'general', // 'general', 'birthday', 'bill', 'appointment'
    date: '',
    time: '',
    location: '',
    contact: '',
    amount: '',
    notes: '',
    reminderBefore: '1day', // '15min', '1hour', '1day', '1week'
    recurring: 'none', // 'none', 'daily', 'weekly', 'monthly', 'yearly'
    priority: 'medium', // 'low', 'medium', 'high'
    completed: false
  });

  const eventTypes = [
    { value: 'general', label: '🎉 সাধারণ ইভেন্ট', color: 'bg-blue-500' },
    { value: 'birthday', label: '🎂 জন্মদিন', color: 'bg-pink-500' },
    { value: 'bill', label: '💰 বিল পেমেন্ট', color: 'bg-red-500' },
    { value: 'appointment', label: '⚕️ অ্যাপয়েন্টমেন্ট', color: 'bg-green-500' },
    { value: 'meeting', label: '💼 মিটিং', color: 'bg-purple-500' },
    { value: 'reminder', label: '🔔 রিমাইন্ডার', color: 'bg-orange-500' }
  ];

  useEffect(() => {
    loadEvents();
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/api/events/all');
      if (response.data.success) {
        setEvents(response.data.events || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) setEvents(JSON.parse(savedEvents));
    }
  };

  const checkReminders = () => {
    const now = new Date();
    events.forEach(event => {
      if (event.completed) return;
      
      const eventDate = new Date(event.date + ' ' + (event.time || '00:00'));
      const timeDiff = eventDate - now;
      
      let reminderTime = 0;
      switch (event.reminderBefore) {
        case '15min':
          reminderTime = 15 * 60 * 1000;
          break;
        case '1hour':
          reminderTime = 60 * 60 * 1000;
          break;
        case '1day':
          reminderTime = 24 * 60 * 60 * 1000;
          break;
        case '1week':
          reminderTime = 7 * 24 * 60 * 60 * 1000;
          break;
      }

      if (timeDiff > 0 && timeDiff <= reminderTime && !event.reminded) {
        showNotification(event);
        markAsReminded(event.id);
      }
    });
  };

  const showNotification = (event) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🔔 ${event.title}`, {
        body: `${getEventTypeLabel(event.type)} - ${new Date(event.date).toLocaleDateString('bn-BD')} ${event.time || ''}`,
        icon: '/icon.png'
      });
    } else {
      alert(`🔔 রিমাইন্ডার: ${event.title}\n${getEventTypeLabel(event.type)}\nতারিখ: ${new Date(event.date).toLocaleDateString('bn-BD')} ${event.time || ''}`);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const markAsReminded = async (eventId) => {
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, reminded: true } : e
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const getEventTypeLabel = (type) => {
    return eventTypes.find(t => t.value === type)?.label || type;
  };

  const getEventTypeColor = (type) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date) {
      alert('অনুগ্রহ করে শিরোনাম এবং তারিখ লিখুন');
      return;
    }

    const eventData = {
      id: editingEvent ? editingEvent.id : `EVENT${Date.now()}`,
      ...newEvent,
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminded: false
    };

    try {
      const response = editingEvent
        ? await api.put(`/api/events/${eventData.id}`, eventData)
        : await api.post('/api/events/add', eventData);

      if (response.data.success) {
        const updatedEvents = editingEvent
          ? events.map(e => e.id === eventData.id ? eventData : e)
          : [eventData, ...events];
        
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        
        setShowEventModal(false);
        setEditingEvent(null);
        resetForm();
        alert('✅ ইভেন্ট সংরক্ষিত হয়েছে!');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      // Save locally
      const updatedEvents = editingEvent
        ? events.map(e => e.id === eventData.id ? eventData : e)
        : [eventData, ...events];
      
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      setShowEventModal(false);
      setEditingEvent(null);
      resetForm();
      alert('✅ ইভেন্ট সংরক্ষিত হয়েছে (Locally)!');
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      type: 'general',
      date: '',
      time: '',
      location: '',
      contact: '',
      amount: '',
      notes: '',
      reminderBefore: '1day',
      recurring: 'none',
      priority: 'medium',
      completed: false
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('মুছে ফেলতে চান?')) return;

    try {
      await api.delete(`/api/events/${eventId}`);
      const updated = events.filter(e => e.id !== eventId);
      setEvents(updated);
      localStorage.setItem('events', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting:', error);
      const updated = events.filter(e => e.id !== eventId);
      setEvents(updated);
      localStorage.setItem('events', JSON.stringify(updated));
    }
  };

  const toggleComplete = async (eventId) => {
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, completed: !e.completed } : e
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    try {
      const event = updatedEvents.find(e => e.id === eventId);
      await api.put(`/api/events/${eventId}`, event);
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    let filtered = events;

    switch (activeTab) {
      case 'upcoming':
        filtered = events.filter(e => new Date(e.date) >= now && !e.completed);
        break;
      case 'birthdays':
        filtered = events.filter(e => e.type === 'birthday');
        break;
      case 'bills':
        filtered = events.filter(e => e.type === 'bill' && !e.completed);
        break;
      case 'appointments':
        filtered = events.filter(e => e.type === 'appointment' && !e.completed);
        break;
      case 'completed':
        filtered = events.filter(e => e.completed);
        break;
      case 'past':
        filtered = events.filter(e => new Date(e.date) < now && !e.completed);
        break;
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getDaysUntil = (date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredEvents = getFilteredEvents();

  // Calculate stats
  const upcomingCount = events.filter(e => new Date(e.date) >= new Date() && !e.completed).length;
  const birthdayCount = events.filter(e => e.type === 'birthday').length;
  const billCount = events.filter(e => e.type === 'bill' && !e.completed).length;
  const appointmentCount = events.filter(e => e.type === 'appointment' && !e.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">ইভেন্ট ও রিমাইন্ডার</h1>
                <p className="text-gray-600">আপনার সব গুরুত্বপূর্ণ ইভেন্ট ট্র্যাক করুন</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowEventModal(true);
                requestNotificationPermission();
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              নতুন ইভেন্ট
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveTab('upcoming')}>
            <Calendar className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">আসন্ন ইভেন্ট</h3>
            <p className="text-4xl font-bold">{upcomingCount}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveTab('birthdays')}>
            <Gift className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">জন্মদিন</h3>
            <p className="text-4xl font-bold">{birthdayCount}</p>
          </div>

          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveTab('bills')}>
            <AlertCircle className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">বিল</h3>
            <p className="text-4xl font-bold">{billCount}</p>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveTab('appointments')}>
            <Clock className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-1">অ্যাপয়েন্টমেন্ট</h3>
            <p className="text-4xl font-bold">{appointmentCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'upcoming', label: '📅 আসন্ন', color: 'blue' },
              { key: 'birthdays', label: '🎂 জন্মদিন', color: 'pink' },
              { key: 'bills', label: '💰 বিল', color: 'red' },
              { key: 'appointments', label: '⚕️ অ্যাপয়েন্টমেন্ট', color: 'green' },
              { key: 'completed', label: '✅ সম্পন্ন', color: 'gray' },
              { key: 'past', label: '⏰ অতীত', color: 'purple' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  activeTab === tab.key
                    ? `bg-${tab.color}-600 text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {activeTab === 'upcoming' && '📅 আসন্ন ইভেন্ট'}
            {activeTab === 'birthdays' && '🎂 জন্মদিনের তালিকা'}
            {activeTab === 'bills' && '💰 বিল পেমেন্ট'}
            {activeTab === 'appointments' && '⚕️ অ্যাপয়েন্টমেন্ট'}
            {activeTab === 'completed' && '✅ সম্পন্ন ইভেন্ট'}
            {activeTab === 'past' && '⏰ অতীত ইভেন্ট'}
          </h2>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">কোন ইভেন্ট নেই</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => {
                const daysUntil = getDaysUntil(event.date);
                const isToday = daysUntil === 0;
                const isTomorrow = daysUntil === 1;
                const isPast = daysUntil < 0;

                return (
                  <div
                    key={event.id}
                    className={`p-6 rounded-xl border-2 ${
                      event.completed
                        ? 'bg-gray-50 border-gray-300 opacity-60'
                        : isToday
                        ? 'bg-red-50 border-red-500 shadow-lg'
                        : isTomorrow
                        ? 'bg-yellow-50 border-yellow-500'
                        : isPast
                        ? 'bg-gray-50 border-gray-300'
                        : 'bg-white border-gray-200 hover:shadow-lg'
                    } transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getEventTypeColor(event.type)}`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                          
                          {event.priority === 'high' && (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                              🔴 উচ্চ অগ্রাধিকার
                            </span>
                          )}

                          {isToday && (
                            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm font-bold animate-pulse">
                              📍 আজ!
                            </span>
                          )}
                          
                          {isTomorrow && (
                            <span className="px-3 py-1 rounded-full bg-yellow-600 text-white text-sm font-bold">
                              ⏰ আগামীকাল
                            </span>
                          )}
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${event.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {event.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.contact && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{event.contact}</span>
                            </div>
                          )}

                          {event.amount && (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600">💰 ৳{event.amount}</span>
                            </div>
                          )}

                          {event.recurring !== 'none' && (
                            <div className="flex items-center gap-2">
                              <Repeat className="w-4 h-4" />
                              <span>পুনরাবৃত্তি: {event.recurring}</span>
                            </div>
                          )}
                        </div>

                        {event.notes && (
                          <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded-lg">{event.notes}</p>
                        )}

                        {!event.completed && !isPast && daysUntil > 0 && (
                          <div className="mt-2 text-sm font-semibold text-blue-600">
                            ⏳ {daysUntil} দিন বাকি
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => toggleComplete(event.id)}
                          className={`p-2 rounded-lg transition-all ${
                            event.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                          }`}
                          title={event.completed ? 'সম্পন্ন' : 'সম্পন্ন করুন'}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingEvent ? '✏️ ইভেন্ট সম্পাদনা' : '➕ নতুন ইভেন্ট'}
                </h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Type */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">ইভেন্ট টাইপ *</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      required
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">অগ্রাধিকার</label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="low">🟢 নিম্ন</option>
                      <option value="medium">🟡 মধ্যম</option>
                      <option value="high">🔴 উচ্চ</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">শিরোনাম *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">তারিখ *</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">সময়</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">স্থান</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder="যেমন: ঢাকা মেডিকেল"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">যোগাযোগ</label>
                    <input
                      type="text"
                      value={newEvent.contact}
                      onChange={(e) => setNewEvent({...newEvent, contact: e.target.value})}
                      placeholder="নাম বা ফোন নম্বর"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Amount (for bills) */}
                {newEvent.type === 'bill' && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">পরিমাণ (৳)</label>
                    <input
                      type="number"
                      value={newEvent.amount}
                      onChange={(e) => setNewEvent({...newEvent, amount: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reminder */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">রিমাইন্ডার</label>
                    <select
                      value={newEvent.reminderBefore}
                      onChange={(e) => setNewEvent({...newEvent, reminderBefore: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="15min">১৫ মিনিট আগে</option>
                      <option value="1hour">১ ঘন্টা আগে</option>
                      <option value="1day">১ দিন আগে</option>
                      <option value="1week">১ সপ্তাহ আগে</option>
                    </select>
                  </div>

                  {/* Recurring */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">পুনরাবৃত্তি</label>
                    <select
                      value={newEvent.recurring}
                      onChange={(e) => setNewEvent({...newEvent, recurring: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="none">নেই</option>
                      <option value="daily">প্রতিদিন</option>
                      <option value="weekly">সাপ্তাহিক</option>
                      <option value="monthly">মাসিক</option>
                      <option value="yearly">বার্ষিক</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">নোট</label>
                  <textarea
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    rows="3"
                    placeholder="অতিরিক্ত বিবরণ..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
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
      </div>
    </div>
  );
};

export default EventReminder;
