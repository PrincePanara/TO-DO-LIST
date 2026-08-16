import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { AlertTriangleIcon } from 'lucide-react';

export function SettingsData() {
  const { toast } = useStudyForge();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Data & Advanced" 
        subtitle="Manage your backups, exports, and account deletion." 
        backTo="/app/settings" 
        backLabel="Settings" 
      />

      <div className="space-y-6">
        <Card className="p-6">
          <SectionHeading title="Data Management" />
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="white" onClick={() => navigate('/import')}>
              Import Data
            </Button>
            <Button variant="white" onClick={() => toast('Export started ✓')}>
              Export Data
            </Button>
            <Button variant="white" onClick={() => toast('Backup created ✓')}>
              Backup Now
            </Button>
          </div>
        </Card>

        <Card className="border-danger p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border-3 border-ink bg-danger text-white dark:border-white">
              <AlertTriangleIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">Danger zone</h2>
              <p className="muted text-sm">These actions cannot be undone.</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button variant="danger" className="w-full sm:w-auto" onClick={() => toast('Factory reset started')}>
              Factory reset workspace
            </Button>
            <Button variant="danger" className="w-full sm:w-auto" onClick={() => toast('Account deletion started')}>
              Delete account permanently
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
