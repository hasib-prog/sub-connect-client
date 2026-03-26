'use client';

import React, { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import api from '@/lib/api';
import ProfileHover from './ProfileHover';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI';
}

interface FollowersModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  tab: 'followers' | 'following';
}

export default function FollowersModal({
  userId,
  isOpen,
  onClose,
  tab,
}: FollowersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [userId, tab, page, isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = tab === 'followers' ? 'followers' : 'following';
      const response = await api.get(`/follow/${endpoint}/${userId}`, {
        params: { page, limit: 20 },
      });
      setUsers(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error(`Failed to fetch ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (targetUserId: string) => {
    const response = await api.get(`/social/profile/${targetUserId}`);
    return response.data.data;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:w-96 max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-lg">
          <h3 className="font-bold text-lg text-gray-900">
            {tab === 'followers' ? 'Followers' : 'Following'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No {tab} yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <ProfileHover
                        userId={user.id}
                        trigger={
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                        }
                        fetchProfile={fetchUserProfile}
                      />
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
