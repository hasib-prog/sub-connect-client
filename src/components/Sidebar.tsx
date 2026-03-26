'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const mainLinks = [
    { href: '/', label: 'Feed', icon: '📰' },
    { href: '/jobs', label: 'Job Board', icon: '💼' },
    { href: '/mentors', label: 'Mentorship', icon: '🎓' },
    { href: '/messages', label: 'Messages', icon: '💬' },
  ];

  const alumniLinks = user?.role === 'ALUMNI' ? [
    { href: '/post-job', label: 'Post Job', icon: '➕' },
  ] : [];

  const studentLinks = user?.role === 'STUDENT' ? [
    { href: '/applications', label: 'My Applications', icon: '📋' },
  ] : [];

  const links = [...mainLinks, ...alumniLinks, ...studentLinks];

  return (
    <aside className="w-64 bg-muted/30 border-r border-border p-4 hidden lg:block">
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === link.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <span>{link.icon}</span>
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* User Card */}
      <div className="mt-8 p-4 bg-white border border-border rounded-lg">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'STUDENT' ? '🎓 Student' : '💼 Alumni'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
