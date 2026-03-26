import React from 'react';
import { User, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { MentorshipRequest } from '@/types/mentorship';

interface MentorshipRequestCardProps {
  request: MentorshipRequest;
  isIncoming?: boolean; // true if viewing as mentor, false if viewing as mentee
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onMessage?: (userId: string) => void;
  isLoading?: boolean;
}

export const MentorshipRequestCard: React.FC<MentorshipRequestCardProps> = ({
  request,
  isIncoming = false,
  onAccept,
  onReject,
  onMessage,
  isLoading = false,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const otherUser = isIncoming ? request.mentee : request.mentor;

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
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {otherUser?.name}
              </h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                {request.status}
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {isIncoming ? (
                // Viewing as mentor - show mentee info
                <>
                  {request.mentee?.profile?.department && (
                    <p><strong>Department:</strong> {request.mentee.profile.department}</p>
                  )}
                  {request.mentee?.profile?.semester && (
                    <p><strong>Semester:</strong> {request.mentee.profile.semester}</p>
                  )}
                </>
              ) : (
                // Viewing as mentee - show mentor info
                <>
                  {request.mentor?.profile?.jobTitle && (
                    <p><strong>Position:</strong> {request.mentor.profile.jobTitle}</p>
                  )}
                  {request.mentor?.profile?.company && (
                    <p><strong>Company:</strong> {request.mentor.profile.company}</p>
                  )}
                </>
              )}
              <p><strong>Requested:</strong> {formatDate(request.createdAt)}</p>
            </div>

            {otherUser?.profile?.bio && (
              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                {otherUser.profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {request.status === 'ACCEPTED' && onMessage && (
            <button
              onClick={() => onMessage(otherUser!.id)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Message
            </button>
          )}

          {isIncoming && request.status === 'PENDING' && (
            <>
              <button
                onClick={() => onAccept?.(request.id)}
                disabled={isLoading}
                className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => onReject?.(request.id)}
                disabled={isLoading}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
