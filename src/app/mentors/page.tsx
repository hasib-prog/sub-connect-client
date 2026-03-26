'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, UserCheck, Clock } from 'lucide-react';
import { MentorCard } from '@/components/MentorCard';
import { MentorshipRequestCard } from '@/components/MentorshipRequestCard';
import { ActiveMentorshipCard } from '@/components/ActiveMentorshipCard';
import {
  Mentor,
  MentorshipRequest,
  MentorsResponse,
  MentorshipRequestsResponse,
  ActiveMentorshipsResponse
} from '@/types/mentorship';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

type TabType = 'browse' | 'requests' | 'active';

export default function MentorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sentRequests, setSentRequests] = useState<MentorshipRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<MentorshipRequest[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<{
    mentoring: MentorshipRequest[];
    beingMentored: MentorshipRequest[];
  }>({ mentoring: [], beingMentored: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestedMentors, setRequestedMentors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      if (activeTab === 'browse') {
        fetchMentors();
      } else if (activeTab === 'requests') {
        fetchRequests();
      } else if (activeTab === 'active') {
        fetchActiveMentorships();
      }
    }
  }, [user, activeTab, searchTerm]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get<MentorsResponse>(`/mentorship/available?${params}`);
      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [sentResponse, receivedResponse] = await Promise.all([
        api.get<MentorshipRequestsResponse>('/mentorship/requests/sent'),
        user?.role === 'ALUMNI'
          ? api.get<MentorshipRequestsResponse>('/mentorship/requests/received')
          : Promise.resolve({ data: { requests: [] } })
      ]);

      setSentRequests(sentResponse.data.requests);
      setReceivedRequests(receivedResponse.data.requests);

      // Update requested mentors set
      const requested = new Set(sentResponse.data.requests.map(r => r.mentorId));
      setRequestedMentors(requested);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveMentorships = async () => {
    try {
      setLoading(true);
      const response = await api.get<ActiveMentorshipsResponse>('/mentorship/active');
      setActiveMentorships(response.data);
    } catch (error) {
      console.error('Failed to fetch active mentorships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentorId: string) => {
    try {
      await api.post('/mentorship/request', { mentorId });
      setRequestedMentors(prev => new Set([...prev, mentorId]));
    } catch (error) {
      console.error('Failed to request mentorship:', error);
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      await api.put(`/mentorship/requests/${requestId}/respond`, { action });
      await fetchRequests(); // Refresh requests
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  const handleEndMentorship = async (mentorshipId: string) => {
    try {
      await api.delete(`/mentorship/${mentorshipId}`);
      await fetchActiveMentorships(); // Refresh active mentorships
    } catch (error) {
      console.error('Failed to end mentorship:', error);
    }
  };

  const handleMessage = (userId: string) => {
    router.push(`/messages?user=${userId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please log in to access mentorship
          </h2>
          <p className="text-gray-600">
            You need to be logged in to connect with mentors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship</h1>
          <p className="text-gray-600">
            {user.role === 'STUDENT'
              ? 'Connect with alumni mentors to guide your career journey'
              : 'Help students grow by sharing your experience and knowledge'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            {user.role === 'STUDENT' ? 'Find Mentors' : 'Available Mentees'}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Requests
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck className="w-4 h-4 inline mr-2" />
            Active
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, position, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mentors Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mentors found
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'Check back later for available mentors'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onRequestMentorship={handleRequestMentorship}
                    isRequested={requestedMentors.has(mentor.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-8">
            {/* Sent Requests (for students) */}
            {user.role === 'STUDENT' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sent Requests
                </h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : sentRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No sent requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((request) => (
                      <MentorshipRequestCard
                        key={request.id}
                        request={request}
                        isIncoming={false}
                        onMessage={handleMessage}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Received Requests (for alumni) */}
            {user.role === 'ALUMNI' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Received Requests
                </h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : receivedRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No received requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedRequests.map((request) => (
                      <MentorshipRequestCard
                        key={request.id}
                        request={request}
                        isIncoming={true}
                        onAccept={(id) => handleRespondToRequest(id, 'accept')}
                        onReject={(id) => handleRespondToRequest(id, 'reject')}
                        onMessage={handleMessage}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-8">
            {/* Mentoring (for alumni) */}
            {user.role === 'ALUMNI' && activeMentorships.mentoring.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Mentoring
                </h2>
                <div className="space-y-4">
                  {activeMentorships.mentoring.map((mentorship) => (
                    <ActiveMentorshipCard
                      key={mentorship.id}
                      mentorship={mentorship}
                      isMentor={true}
                      onMessage={handleMessage}
                      onEndMentorship={handleEndMentorship}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Being Mentored (for students) */}
            {activeMentorships.beingMentored.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  My Mentors
                </h2>
                <div className="space-y-4">
                  {activeMentorships.beingMentored.map((mentorship) => (
                    <ActiveMentorshipCard
                      key={mentorship.id}
                      mentorship={mentorship}
                      isMentor={false}
                      onMessage={handleMessage}
                      onEndMentorship={handleEndMentorship}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeMentorships.mentoring.length === 0 && activeMentorships.beingMentored.length === 0 && !loading && (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No active mentorships
                </h3>
                <p className="text-gray-600">
                  {user.role === 'STUDENT'
                    ? 'Start by browsing available mentors and sending requests'
                    : 'Accept mentorship requests to start mentoring students'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
