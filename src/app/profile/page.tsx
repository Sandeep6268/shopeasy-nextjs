// app/profile/page.tsx - FULLY UPDATED & ERROR FIXED
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
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load profile' }));
        toast.error(errorData.error || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
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
      return;
    }

    setIsUpdating(true);
    const updateToast = toast.loading('Updating profile...');

    try {
      // Use direct API call instead of context method to avoid issues
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update both context and local state
        if (updateProfile) {
          await updateProfile({ name: formData.name.trim() });
        }
        
        setIsEditing(false);
        await fetchUserProfile(); // Refresh profile data
        toast.success('Profile updated successfully!', { id: updateToast });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Update failed' }));
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
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
          {/* Header */}
          <div>
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          
          {/* Content */}
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
        {/* Main Content - Profile Information */}
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
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
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
                    <p className="text-sm text-gray-500 mt-1">This will be displayed on your profile and orders</p>
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
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
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

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          {/* Account Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700">Orders</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{profileData?.ordersCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700">Wishlist</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{profileData?.wishlistCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700">Member Since</span>
                </div>
                <span className="text-sm font-medium text-gray-900 text-right">
                  {profileData?.createdAt ? formatDate(profileData.createdAt) : 'Recently'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/orders')}
                className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
              >
                <span className="font-medium">Order History</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={() => router.push('/wishlist')}
                className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
              >
                <span className="font-medium">My Wishlist</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={() => router.push('/addresses')}
                className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
              >
                <span className="font-medium">Saved Addresses</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 text-sm mb-4">
              Our support team is here to help you with any questions.
            </p>
            <button 
              onClick={() => router.push('/contact')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}