'use client';

import { DashboardLayout } from '@/components/DashboardLayout';

export default function MentorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mentorship</h1>
          <p className="text-muted-foreground">Connect with mentors in your field</p>
        </div>

        <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Mentorship features coming soon!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
