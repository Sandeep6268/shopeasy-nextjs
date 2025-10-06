// app/profile/page.tsx - FIXED
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
      const response = await fetch('/api/auth/me'); // ✅ Correct endpoint
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      } else {
        toast.error('Failed to load profile data');
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
      // ✅ Use the correct update endpoint
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update auth context
        if (updateProfile) {
          await updateProfile({ name: formData.name.trim() });
        }
        setIsEditing(false);
        await fetchUserProfile(); // Refresh profile data
        toast.success('Profile updated successfully!', { id: updateToast });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile', { id: updateToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
                {profileData?.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                    <p className="text-gray-900">{formatDate(profileData.createdAt)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
            <button
              onClick={() => router.push('/auth/change-password')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Account Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="text-gray-900">
                  {profileData?.createdAt ? formatDate(profileData.createdAt) : 'Recently'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Orders</span>
                <span className="text-gray-900">{profileData?.ordersCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wishlist items</span>
                <span className="text-gray-900">{profileData?.wishlistCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/orders')}
                className="w-full text-left text-blue-600 hover:text-blue-700 py-2 transition duration-200"
              >
                Order History
              </button>
              
              
              <button 
                onClick={() => router.push('/wishlist')}
                className="w-full text-left text-blue-600 hover:text-blue-700 py-2 transition duration-200"
              >
                My Wishlist
              </button>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}