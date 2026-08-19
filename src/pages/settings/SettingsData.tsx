import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { AlertTriangleIcon } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export function SettingsData() {
  const { toast, factoryReset, deleteAccount } = useStudyForge();
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFactoryReset = async () => {
    await factoryReset();
    setShowResetModal(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Data & Advanced" 
        subtitle="Manage your backups, exports, and account deletion." 
        backTo="/app/settings" 
        backLabel="Settings" 
      />

      <div className="space-y-6">
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
            <Button variant="danger" className="w-full sm:w-auto" onClick={() => setShowResetModal(true)}>
              Factory reset workspace
            </Button>
            <Button variant="danger" className="w-full sm:w-auto" onClick={() => setShowDeleteModal(true)}>
              Delete account permanently
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Factory Reset Workspace"
        subtitle="This will clear all your data."
        footer={
          <>
            <Button variant="white" onClick={() => setShowResetModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleFactoryReset}>Yes, Reset Workspace</Button>
          </>
        }>
        <div className="text-sm">
          Are you sure you want to completely clear your workspace? All subjects, tasks, notes, and labs will be permanently deleted. This action cannot be undone.
        </div>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        subtitle="Permanently delete your profile."
        footer={
          <>
            <Button variant="white" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount}>Yes, Delete Account</Button>
          </>
        }>
        <div className="text-sm">
          Are you sure you want to delete your entire account? This will wipe your profile and remove you from the system. You will need to create a new account to use the application again.
        </div>
      </Modal>
    </div>
  );
}
