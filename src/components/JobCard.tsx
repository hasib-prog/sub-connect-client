import React from 'react';
import { MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  showApplyButton?: boolean;
  isApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onViewDetails,
  showApplyButton = true,
  isApplied = false,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <p className="text-lg text-blue-600 font-medium mb-2">
            {job.company}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{job.type.replace('_', ' ')}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{job._count?.applications || 0} applicants</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Posted {formatDate(job.createdAt)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 line-clamp-3">
          {job.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {job.postedBy.profile?.profilePicture && (
            <img
              src={job.postedBy.profile.profilePicture}
              alt={job.postedBy.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {job.postedBy.name}
            </p>
            {job.postedBy.profile?.jobTitle && (
              <p className="text-xs text-gray-600">
                {job.postedBy.profile.jobTitle} at {job.postedBy.profile.company}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(job.id)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            View Details
          </button>
          {showApplyButton && (
            <button
              onClick={() => onApply?.(job.id)}
              disabled={isApplied}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isApplied
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
