'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import api from '@/lib/api';

interface Conversation {
  conversationId: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'ALUMNI';
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ConversationListProps {
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string, otherUserId: string) => void;
}

export default function ConversationList({
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
    // Refresh every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Messages</h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-gray-100 animate-pulse h-16"
              ></div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No conversations yet</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.conversationId}
              onClick={() => onSelectConversation(conv.conversationId, conv.otherUser.id)}
              className={`w-full p-3 border-b border-gray-100 text-left hover:bg-gray-50 transition ${
                selectedConversation === conv.conversationId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {conv.otherUser.name}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage.length > 50
                      ? conv.lastMessage.substring(0, 50) + '...'
                      : conv.lastMessage}
                  </p>
                </div>
                <p className="text-xs text-gray-500 flex-shrink-0">
                  {new Date(conv.lastMessageTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
