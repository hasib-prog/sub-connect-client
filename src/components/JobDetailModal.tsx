import React from 'react';
import { X, MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react';
import { Job } from '@/types/job';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  showApplyButton?: boolean;
  isApplied?: boolean;
  isLoading?: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  showApplyButton = true,
  isApplied = false,
  isLoading = false,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h2>
            <p className="text-xl text-blue-600 font-medium">
              {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{job.type.replace('_', ' ')}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{job._count?.applications || 0} applicants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Posted by
                </h4>
                <div className="flex items-center gap-3">
                  {job.postedBy.profile?.profilePicture && (
                    <img
                      src={job.postedBy.profile.profilePicture}
                      alt={job.postedBy.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {job.postedBy.name}
                    </p>
                    {job.postedBy.profile?.jobTitle && (
                      <p className="text-sm text-gray-600">
                        {job.postedBy.profile.jobTitle}
                      </p>
                    )}
                    {job.postedBy.profile?.company && (
                      <p className="text-sm text-gray-600">
                        {job.postedBy.profile.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {showApplyButton && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <button
                    onClick={() => onApply?.(job.id)}
                    disabled={isApplied || isLoading}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                      isApplied
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Applying...
                      </div>
                    ) : isApplied ? (
                      'Already Applied'
                    ) : (
                      'Apply for this Job'
                    )}
                  </button>
                  {isApplied && (
                    <p className="text-sm text-green-700 mt-2 text-center">
                      You've already applied for this position
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
