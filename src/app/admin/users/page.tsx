// app/admin/users/page.tsx - UPDATED
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UsersTable from '@/components/admin/UsersTable';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const updateToast = toast.loading('Updating user role...');
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success('User role updated successfully!', { id: updateToast });
        // Refresh users list
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update user role', { id: updateToast });
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role', { id: updateToast });
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </div>

        <UsersTable 
          users={users} 
          loading={loading}
          onRoleUpdate={updateUserRole}
          onUserUpdate={fetchUsers} // Pass refresh function
        />
      </div>
    </div>
  );
}