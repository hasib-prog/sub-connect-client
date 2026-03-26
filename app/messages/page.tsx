'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import ConversationList from '@/components/ConversationList';
import ChatBox from '@/components/ChatBox';
import { useConversationEvents } from '@/hooks/useSocket';

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedOtherUser, setSelectedOtherUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Setup Socket.io for the current conversation
  useConversationEvents(selectedConversation, user?.id);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleMessageSent = () => {
    // Refresh conversation list to show updated last message
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="h-screen -mx-6 -my-6 flex">
        {/* Conversation List */}
        <div className="w-1/3 min-w-72 border-r border-gray-200 bg-white">
          <ConversationList
            key={refreshKey}
            selectedConversation={selectedConversation}
            onSelectConversation={(convId, otherUserId) => {
              setSelectedConversation(convId);
              // Will get user details from the conversation click
              setSelectedOtherUser({ id: otherUserId, name: '', email: '' });
            }}
          />
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-gray-50">
          {selectedConversation && selectedOtherUser ? (
            <ChatBox
              conversationId={selectedConversation}
              currentUserId={user.id}
              otherUser={selectedOtherUser}
              onMessageSent={handleMessageSent}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
                <p className="text-gray-400 text-sm mt-2">Or start a new conversation from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
