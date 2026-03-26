'use client';

import React, { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import ProfileHover from './ProfileHover';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'ALUMNI';
  };
}

interface CommentThreadProps {
  postId: string;
  currentUserId: string;
  onCommentAdded: () => void;
}

export default function CommentThread({
  postId,
  currentUserId,
  onCommentAdded,
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/social/comments/post/${postId}`);
      setComments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const response = await api.get(`/social/profile/${userId}`);
    return response.data.data;
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await api.post(
        `/social/comments/add/${postId}`,
        { content: newComment }
      );
      
      setComments((prev) => [
        ...prev,
        {
          id: response.data.data.id,
          content: response.data.data.content,
          createdAt: response.data.data.createdAt,
          author: {
            id: response.data.data.author.id,
            name: response.data.data.author.name,
            email: response.data.data.author.email,
            role: response.data.data.author.role,
          },
        },
      ]);
      
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/social/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      {/* Comments list */}
      <div className="space-y-3 mb-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.author.name.charAt(0)}
              </div>
              <div className="flex-1 bg-gray-100 rounded p-2">
                <div className="flex items-center justify-between gap-2">
                  <ProfileHover
                    userId={comment.author.id}
                    trigger={
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.author.name}
                      </span>
                    }
                    fetchProfile={fetchUserProfile}
                  />
                  {comment.author.id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
