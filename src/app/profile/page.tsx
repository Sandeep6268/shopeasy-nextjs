// app/profile/page.tsx - FIXED WITH BETTER ERROR HANDLING
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount: number;
  wishlistCount: number;
}

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      //console.log('🔄 Fetching user profile...');
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Profile fetch failed:', response.status, errorText);
        
        let errorMessage = 'Failed to load profile data';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, use the text directly
          errorMessage = errorText || errorMessage;
        }
        
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      //console.log('✅ Profile data received:', data);
      
      if (data.success && data.user) {
        setProfileData(data.user);
      } else {
        toast.error(data.error || 'Invalid profile data received');
      }
    } catch (error) {
      console.error('💥 Error fetching profile:', error);
      toast.error('Network error: Failed to load profile data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    // Check if name actually changed
    if (formData.name === user?.name) {
      setIsEditing(false);
      toast.success('No changes detected');
      return;
    }

    setIsUpdating(true);
    const updateToast = toast.loading('Updating profile...');

    try {
      //console.log('🔄 Updating profile with:', { name: formData.name.trim() });
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      // Check if response is OK first
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update failed:', response.status, errorText);
        
        let errorMessage = 'Failed to update profile';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, use the text directly
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Now parse the JSON
      const data = await response.json();
      //console.log('✅ Update response:', data);
      
      if (data.success) {
        // Update both context and local state
        if (updateProfile) {
          await updateProfile({ name: formData.name.trim() });
        }
        
        setIsEditing(false);
        await fetchUserProfile(); // Refresh profile data
        toast.success('Profile updated successfully!', { id: updateToast });
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error: any) {
      console.error('💥 Update profile error:', error);
      toast.error(error.message || 'Failed to update profile', { id: updateToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div>
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
              <div className="h-32 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-300 rounded-lg"></div>
              <div className="h-40 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email address cannot be changed</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900 text-lg font-medium">{user.name || 'Not provided'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <p className="text-gray-900 text-lg">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <p className="text-gray-900 text-lg capitalize">{user.role}</p>
                </div>
                
                {profileData?.createdAt && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-gray-900 text-lg">{formatDate(profileData.createdAt)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Security Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Password</h3>
                <p className="text-gray-600 text-sm">Last changed: Recently</p>
              </div>
              <button
                onClick={() => router.push('/auth/change-password')}
                className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Orders</span>
                <span className="text-lg font-semibold text-gray-900">{profileData?.ordersCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Wishlist</span>
                <span className="text-lg font-semibold text-gray-900">{profileData?.wishlistCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/orders')}
                className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <span className="font-medium">Order History</span>
              </button>
              
              <button 
                onClick={() => router.push('/wishlist')}
                className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <span className="font-medium">My Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}