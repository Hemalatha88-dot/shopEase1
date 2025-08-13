import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const StoreSections = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stores/sections');
      setSections(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingSection) {
        // Update existing section
        const response = await api.put(`/stores/sections/${editingSection.id}`, formData);
        if (response.data.success) {
          setEditingSection(null);
          setShowAddForm(false);
          resetForm();
          fetchSections();
        }
      } else {
        // Create new section
        const response = await api.post('/stores/sections', formData);
        if (response.data.success) {
          setShowAddForm(false);
          resetForm();
          fetchSections();
        }
      }
    } catch (error) {
      console.error('Failed to save section:', error);
      setError(error.response?.data?.message || 'Failed to save section');
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section? This will also affect any offers assigned to this section.')) {
      return;
    }

    try {
      const response = await api.delete(`/stores/sections/${sectionId}`);
      if (response.data.success) {
        fetchSections();
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
      setError(error.response?.data?.message || 'Failed to delete section');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingSection(null);
    setError('');
  };

  const generateQRCode = (sectionId) => {
    // Generate QR code for section-specific offers
    const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin || 'http://localhost:3000';
    const qrUrl = `${frontendUrl}/offers/${user?.storeId}/section/${sectionId}`;
    window.open(`/qr-generator?url=${encodeURIComponent(qrUrl)}&title=Section QR Code`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Sections</h1>
          <p className="text-gray-600">Manage your store sections and generate QR codes for each section</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Add/Edit Section Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSection ? 'Edit Section' : 'Add New Section'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Electronics, Clothing, Groceries"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of this section"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                {editingSection ? 'Update Section' : 'Create Section'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Sections ({sections.length})
          </h3>
        </div>
        
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sections created yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first store section to organize your offers and products
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create First Section
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sections.map((section) => (
              <div key={section.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{section.name}</h4>
                    {section.description && (
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Section ID: {section.id}</span>
                      <span>Created: {new Date(section.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* <button
                      onClick={() => generateQRCode(section.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Generate QR Code"
                    >
                      <QrCodeIcon className="h-5 w-5" />
                    </button> */}
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit Section"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Section"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Setup Guide */}
      {sections.length === 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Quick Setup Guide</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Step 1:</strong> Create store sections (e.g., Electronics, Clothing, Groceries)</p>
            <p><strong>Step 2:</strong> Add offers/products and assign them to sections</p>
            <p><strong>Step 3:</strong> Generate QR codes for each section</p>
            <p><strong>Step 4:</strong> Place QR codes in respective store sections</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSections; 