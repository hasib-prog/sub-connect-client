import React from 'react';
import { User, Briefcase, MessageCircle } from 'lucide-react';
import { Mentor } from '@/types/mentorship';

interface MentorCardProps {
  mentor: Mentor;
  onRequestMentorship: (mentorId: string) => void;
  isRequested?: boolean;
  isLoading?: boolean;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onRequestMentorship,
  isRequested = false,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {mentor.profile?.profilePicture ? (
          <img
            src={mentor.profile.profilePicture}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {mentor.name}
          </h3>

          {mentor.profile?.jobTitle && (
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span>{mentor.profile.jobTitle}</span>
            </div>
          )}

          {mentor.profile?.company && (
            <p className="text-gray-600 mb-3">
              {mentor.profile.company}
            </p>
          )}

          {mentor.profile?.bio && (
            <p className="text-gray-700 text-sm line-clamp-3 mb-4">
              {mentor.profile.bio}
            </p>
          )}

          <button
            onClick={() => onRequestMentorship(mentor.id)}
            disabled={isRequested || isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              isRequested
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            {isLoading ? 'Requesting...' : isRequested ? 'Request Sent' : 'Request Mentorship'}
          </button>
        </div>
      </div>
    </div>
  );
};
