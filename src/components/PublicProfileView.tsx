'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import FollowButton from './FollowButton';
import FollowStats from './FollowStats';
import FollowersModal from './FollowersModal';

interface Profile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI';
  department?: string;
  semester?: number;
  jobTitle?: string;
  company?: string;
  skills?: string[];
  bio?: string;
}

interface PublicProfileViewProps {
  userId: string;
  currentUserId: string;
  onClose: () => void;
}

export default function PublicProfileView({
  userId,
  currentUserId,
  onClose,
}: PublicProfileViewProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/social/profile/${userId}`);
      setProfile(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Profile not found</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex gap-6 items-start mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <span className="text-4xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground mb-4">
              {profile.role === 'STUDENT' ? '🎓 Student' : '💼 Alumni'}
            </p>
            <FollowButton
              targetUserId={userId}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        {/* Network Stats */}
        <div className="border-t border-gray-200 pt-6">
          <FollowStats
            userId={userId}
            onFollowersClick={() => setShowFollowersModal(true)}
            onFollowingClick={() => setShowFollowingModal(true)}
          />
        </div>
      </div>

      {/* Role-specific info */}
      {profile.role === 'STUDENT' ? (
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Academic Info</h2>
          <div className="space-y-3">
            {profile.department && (
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{profile.department}</p>
              </div>
            )}
            {profile.semester && (
              <div>
                <p className="text-sm text-gray-600">Semester</p>
                <p className="font-medium">Semester {profile.semester}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Professional Info</h2>
          <div className="space-y-3">
            {profile.jobTitle && (
              <div>
                <p className="text-sm text-gray-600">Job Title</p>
                <p className="font-medium">{profile.jobTitle}</p>
              </div>
            )}
            {profile.company && (
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{profile.company}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}

      {/* Followers Modal */}
      <FollowersModal
        userId={userId}
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        tab="followers"
      />

      {/* Following Modal */}
      <FollowersModal
        userId={userId}
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        tab="following"
      />
    </div>
  );
}
