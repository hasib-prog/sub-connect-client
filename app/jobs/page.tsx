'use client';

import { DashboardLayout } from '@/components/DashboardLayout';

export default function JobsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Job Board</h1>
          <p className="text-muted-foreground">Explore job opportunities posted by alumni</p>
        </div>

        <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Job board features coming soon!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
