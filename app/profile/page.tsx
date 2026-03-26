'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import FollowStats from '@/components/FollowStats';
import FollowersModal from '@/components/FollowersModal';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  if (!user) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
              <span className="text-4xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground mb-4">
                {user?.role === 'STUDENT' ? '🎓 Student' : '💼 Alumni'}
              </p>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Follow Stats */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Network</h2>
          <FollowStats
            userId={user.id}
            onFollowersClick={() => setShowFollowersModal(true)}
            onFollowingClick={() => setShowFollowingModal(true)}
          />
        </div>

        {/* Profile Info */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Email</h2>
          <p className="text-gray-700">{user?.email}</p>
        </div>

        {/* Followers Modal */}
        <FollowersModal
          userId={user.id}
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          tab="followers"
        />

        {/* Following Modal */}
        <FollowersModal
          userId={user.id}
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          tab="following"
        />
      </div>
    </DashboardLayout>
  );
}
