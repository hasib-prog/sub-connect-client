'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import api from '@/lib/api';

interface FollowButtonProps {
  targetUserId: string;
  currentUserId: string;
  onFollowStatusChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  targetUserId,
  currentUserId,
  onFollowStatusChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserId === targetUserId) {
      setLoading(false);
      return;
    }
    fetchFollowStatus();
  }, [targetUserId, currentUserId]);

  const fetchFollowStatus = async () => {
    try {
      const response = await api.get(`/follow/status/${targetUserId}`);
      setIsFollowing(response.data.data.isFollowing);
    } catch (error) {
      console.error('Failed to fetch follow status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      setSubmitting(true);
      if (isFollowing) {
        await api.post(`/follow/unfollow/${targetUserId}`);
        setIsFollowing(false);
      } else {
        await api.post(`/follow/follow/${targetUserId}`);
        setIsFollowing(true);
      }
      onFollowStatusChange?.(isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Don't show button for own profile
  if (currentUserId === targetUserId) {
    return null;
  }

  if (loading) {
    return (
      <button disabled className="px-4 py-2 rounded bg-gray-100 text-gray-600 opacity-50">
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={submitting}
      className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 ${
        isFollowing
          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </button>
  );
}
