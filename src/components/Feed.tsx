'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
import ProfileHover from './ProfileHover';
import CommentThread from './CommentThread';
import api from '@/lib/api';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  author: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'ALUMNI';
  };
}

interface FeedProps {
  currentUserId: string;
}

export default function Feed({ currentUserId }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/social/posts/feed', {
        params: {
          page,
          limit: itemsPerPage,
        },
      });
      setPosts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const response = await api.get(`/social/profile/${userId}`);
    return response.data.data;
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await api.post(`/social/likes/unlike/${postId}`);
      } else {
        await api.post(`/social/likes/like/${postId}`);
      }
      
      // Update UI
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/social/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleCommentCountUpdate = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      )
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <p className="text-gray-500">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Post header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <ProfileHover
                      userId={post.author.id}
                      trigger={
                        <span className="font-semibold text-gray-900">
                          {post.author.name}
                        </span>
                      }
                      fetchProfile={fetchUserProfile}
                    />
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Delete button */}
                {post.author.id === currentUserId && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Post content */}
            <div className="p-4 text-gray-800">{post.content}</div>

            {/* Post actions */}
            <div className="px-4 py-3 border-t border-gray-200 flex gap-4">
              {/* Like button */}
              <button
                onClick={() => handleLike(post.id, post.isLiked)}
                className={`flex items-center gap-2 text-sm font-medium transition ${
                  post.isLiked
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={post.isLiked ? 'currentColor' : 'none'}
                />
                {post.likeCount}
              </button>

              {/* Comment button */}
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                <MessageCircle className="w-5 h-5" />
                {post.commentCount}
              </button>

              {/* Share button */}
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Comment thread */}
            {expandedComments.has(post.id) && (
              <CommentThread
                postId={post.id}
                currentUserId={currentUserId}
                onCommentAdded={() => handleCommentCountUpdate(post.id)}
              />
            )}
          </div>
        ))
      )}

      {/* Pagination */}
      {posts.length > 0 && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={posts.length < itemsPerPage}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
