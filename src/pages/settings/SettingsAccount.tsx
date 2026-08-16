import React from 'react';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { UserIcon } from 'lucide-react';

export function SettingsAccount() {
  const { profile, setProfile, toast } = useStudyForge();
  const { user } = useAuth();

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Account Settings" 
        subtitle="Manage your profile information and password." 
        backTo="/app/settings" 
        backLabel="Settings" 
      />

      <div className="space-y-6">
        <Card className="p-6">
          <SectionHeading title="Profile" />
          
          <div className="mb-6 flex items-center gap-4">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="h-16 w-16 rounded-full border-2 border-ink object-cover shadow-brut-xs"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-brand shadow-brut-xs text-white">
                <UserIcon className="h-8 w-8" strokeWidth={2} />
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">{profile.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-5">
            <TextInput
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
            />
            
            <TextInput 
              label="Email" 
              type="email" 
              value={user?.email || ''} 
              readOnly 
              className="opacity-70 cursor-not-allowed" 
            />
            
            <Button variant="white" onClick={() => toast('Password reset link sent ✓')}>
              Change password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
