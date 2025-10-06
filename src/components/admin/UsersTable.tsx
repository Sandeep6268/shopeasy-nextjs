// components/admin/UsersTable.tsx - UPDATED
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount: number;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onRoleUpdate: (userId: string, newRole: string) => void;
  onUserUpdate: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function UsersTable({ users, loading, onRoleUpdate, onUserUpdate }: UsersTableProps) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
  const router = useRouter();

  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(user => user.role === roleFilter);

  const handleDeleteClick = (userId: string, userEmail: string) => {
    setSelectedUser({ id: userId, email: userEmail });
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setDeletingId(selectedUser.id);
    setModalOpen(false);

    const deleteToast = toast.loading('Deleting user...');
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully', { id: deleteToast });
        onUserUpdate();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete user', { id: deleteToast });
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user', { id: deleteToast });
    } finally {
      setDeletingId(null);
      setSelectedUser(null);
    }
  };

  const handleView = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 border-b border-gray-200 last:border-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No Name'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => onRoleUpdate(user._id, e.target.value)}
                      className={`text-sm font-medium rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.ordersCount} orders
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleView(user._id)}
                      className="text-blue-600 hover:text-blue-900 mr-4 p-1 rounded hover:bg-blue-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(user._id, user.email)}
                      disabled={deletingId === user._id}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete user ${selectedUser?.email}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        type="delete"
      />
    </>
  );
}