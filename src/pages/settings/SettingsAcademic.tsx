import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, TextInput } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';

export function SettingsAcademic() {
  const { profile, setProfile, subjects } = useStudyForge();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Academic Settings" 
        subtitle="Manage your semester, year, and subject configuration." 
        backTo="/app/settings" 
        backLabel="Settings" 
      />

      <div className="space-y-6">
        <Card className="p-6">
          <SectionHeading title="Academic Profile" hint={`${subjects.length} subjects in this semester.`} />
          
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Semester"
                value={profile.semester}
                onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                options={Array.from({ length: 8 }, (_, i) => ({
                  value: String(i + 1),
                  label: `Semester ${i + 1}`
                }))} 
              />
              
              <TextInput
                label="Academic year"
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })} 
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="white" onClick={() => navigate('/app/subjects')}>
                Manage subjects
              </Button>
              <Button onClick={() => navigate('/import')}>
                Import syllabus PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
