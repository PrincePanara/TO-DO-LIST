import React, { useState } from 'react';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../../components/ui/Card';
import { ChipGroup } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';

export function SettingsAppearance() {
  const { theme, toggleTheme } = useStudyForge();
  const [appearance, setAppearance] = useState<'LIGHT' | 'DARK' | 'SYSTEM'>(
    theme === 'dark' ? 'DARK' : 'LIGHT'
  );

  const setAppearanceMode = (mode: 'LIGHT' | 'DARK' | 'SYSTEM') => {
    setAppearance(mode);
    const wantsDark =
      mode === 'DARK' ||
      (mode === 'SYSTEM' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (wantsDark !== (theme === 'dark')) toggleTheme();
  };

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Appearance" 
        subtitle="Customize the look and feel of your workspace." 
        backTo="/app/settings" 
        backLabel="Settings" 
      />

      <div className="space-y-6">
        <Card className="p-6">
          <SectionHeading title="Theme" />
          
          <ChipGroup
            label="Theme Selection"
            value={appearance}
            options={[
              { value: 'LIGHT', label: 'Light' },
              { value: 'DARK', label: 'Dark' },
              { value: 'SYSTEM', label: 'System' }
            ]}
            onChange={setAppearanceMode} 
          />
        </Card>
      </div>
    </div>
  );
}
