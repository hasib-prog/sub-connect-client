'use client';

import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import CreatePostForm from '@/components/CreatePostForm';
import Feed from '@/components/Feed';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [feedKey, setFeedKey] = useState(0);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">SUB Connect</h1>
          <p className="text-xl text-muted-foreground mb-8">University Networking Platform</p>
          <a
            href="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  const handlePostCreated = () => {
    setFeedKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-primary-foreground/90">
            {user.role === 'STUDENT'
              ? 'Connect with peers, find mentors, and explore opportunities'
              : 'Share your experience, hire talented students, and mentor the next generation'}
          </p>
        </div>

        {/* Create Post Form */}
        <CreatePostForm
          userName={user.name}
          onPostCreated={handlePostCreated}
        />

        {/* Feed */}
        <Feed key={feedKey} currentUserId={user.id} />
      </div>
    </DashboardLayout>
  );
}
