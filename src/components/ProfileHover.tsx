'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Briefcase, BookOpen } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI';
  department?: string;
  semester?: number;
  jobTitle?: string;
  company?: string;
  skills?: string[];
  profileImage?: string;
  bio?: string;
}

interface ProfileHoverProps {
  userId: string;
  trigger: React.ReactNode;
  fetchProfile: (userId: string) => Promise<ProfileData>;
}

export default function ProfileHover({ userId, trigger, fetchProfile }: ProfileHoverProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (!profile && !loading) {
      setLoading(true);
      try {
        const data = await fetchProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    timeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 500); // Show preview after 500ms hover
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPreview(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger element */}
      <div className="cursor-pointer hover:underline text-blue-600">
        {trigger}
      </div>

      {/* Preview card */}
      {showPreview && profile && (
        <div
          ref={previewRef}
          className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-fadeIn"
        >
          {/* Profile header */}
          <div className="flex items-start gap-3 mb-3">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">{profile.name}</h3>
              <p className="text-xs text-gray-600">
                {profile.role === 'STUDENT' ? '📚 Student' : '💼 Alumni'}
              </p>
            </div>
          </div>

          {/* Role-specific info */}
          {profile.role === 'STUDENT' ? (
            <div className="space-y-2 mb-3 text-xs">
              {profile.department && (
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>{profile.department}</span>
                </div>
              )}
              {profile.semester && (
                <div className="text-gray-600">
                  Semester: <span className="font-semibold">{profile.semester}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 mb-3 text-xs">
              {profile.jobTitle && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">{profile.jobTitle}</p>
                    {profile.company && <p className="text-gray-600">{profile.company}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1">
                {profile.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 3 && (
                  <span className="text-xs text-gray-600">
                    +{profile.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-xs text-gray-700 mb-3 line-clamp-2">{profile.bio}</p>
          )}

          {/* Email */}
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-gray-200">
            <Mail className="w-4 h-4" />
            <span className="truncate">{profile.email}</span>
          </div>

          {/* Arrow pointer */}
          <div className="absolute top-full left-4 w-2 h-2 bg-white border-b border-r border-gray-200 transform rotate-45 -translate-y-1"></div>
        </div>
      )}

      {/* Loading state */}
      {showPreview && loading && !profile && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
