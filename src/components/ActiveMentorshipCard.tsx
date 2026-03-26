import React from 'react';
import { User, MessageCircle, UserX } from 'lucide-react';
import { MentorshipRequest } from '@/types/mentorship';

interface ActiveMentorshipCardProps {
  mentorship: MentorshipRequest;
  isMentor?: boolean; // true if current user is the mentor
  onMessage: (userId: string) => void;
  onEndMentorship: (mentorshipId: string) => void;
  isLoading?: boolean;
}

export const ActiveMentorshipCard: React.FC<ActiveMentorshipCardProps> = ({
  mentorship,
  isMentor = false,
  onMessage,
  onEndMentorship,
  isLoading = false,
}) => {
  const otherUser = isMentor ? mentorship.mentee : mentorship.mentor;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {otherUser?.profile?.profilePicture ? (
            <img
              src={otherUser.profile.profilePicture}
              alt={otherUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {otherUser?.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isMentor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {isMentor ? 'Mentee' : 'Mentor'}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {isMentor ? (
                // Current user is mentor - show mentee info
                <>
                  {mentorship.mentee?.profile?.department && (
                    <p><strong>Department:</strong> {mentorship.mentee.profile.department}</p>
                  )}
                  {mentorship.mentee?.profile?.semester && (
                    <p><strong>Semester:</strong> {mentorship.mentee.profile.semester}</p>
                  )}
                </>
              ) : (
                // Current user is mentee - show mentor info
                <>
                  {mentorship.mentor?.profile?.jobTitle && (
                    <p><strong>Position:</strong> {mentorship.mentor.profile.jobTitle}</p>
                  )}
                  {mentorship.mentor?.profile?.company && (
                    <p><strong>Company:</strong> {mentorship.mentor.profile.company}</p>
                  )}
                </>
              )}
              <p><strong>Started:</strong> {new Date(mentorship.createdAt).toLocaleDateString()}</p>
            </div>

            {otherUser?.profile?.bio && (
              <p className="text-sm text-gray-700 line-clamp-2">
                {otherUser.profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onMessage(otherUser!.id)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 inline mr-1" />
            Message
          </button>
          <button
            onClick={() => onEndMentorship(mentorship.id)}
            disabled={isLoading}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            <UserX className="w-4 h-4 inline mr-1" />
            End
          </button>
        </div>
      </div>
    </div>
  );
};
