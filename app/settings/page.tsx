'use client';

import { DashboardLayout } from '@/components/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Settings page coming soon!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
