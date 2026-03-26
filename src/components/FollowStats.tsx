'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface FollowStatsProps {
  userId: string;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export default function FollowStats({
  userId,
  onFollowersClick,
  onFollowingClick,
}: FollowStatsProps) {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowCounts();
  }, [userId]);

  const fetchFollowCounts = async () => {
    try {
      const response = await api.get(`/follow/counts/${userId}`);
      setFollowerCount(response.data.data.followerCount);
      setFollowingCount(response.data.data.followingCount);
    } catch (error) {
      console.error('Failed to fetch follow counts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex gap-6">
      <button
        onClick={onFollowersClick}
        className="text-center hover:bg-gray-50 p-2 rounded transition"
      >
        <div className="text-lg font-bold text-gray-900">{followerCount}</div>
        <div className="text-xs text-gray-600">Follower{followerCount !== 1 ? 's' : ''}</div>
      </button>
      <button
        onClick={onFollowingClick}
        className="text-center hover:bg-gray-50 p-2 rounded transition"
      >
        <div className="text-lg font-bold text-gray-900">{followingCount}</div>
        <div className="text-xs text-gray-600">Following</div>
      </button>
    </div>
  );
}
