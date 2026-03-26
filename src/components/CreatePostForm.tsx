'use client';

import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

interface CreatePostFormProps {
  userName: string;
  onPostCreated: () => void;
}

export default function CreatePostForm({
  userName,
  onPostCreated,
}: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      
      await api.post('/social/posts/create', {
        content: content.trim(),
      });

      setContent('');
      onPostCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {/* Form header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
          {userName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">Share your thoughts...</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share updates, ask questions, or celebrate achievements..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          rows={4}
          disabled={submitting}
        />

        {/* Action buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setContent('')}
            disabled={!content.trim() || submitting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post
              </>
            )}
          </button>
        </div>

        {/* Char count */}
        <p className="text-xs text-gray-500 mt-2">
          {content.length} characters
        </p>
      </form>
    </div>
  );
}
