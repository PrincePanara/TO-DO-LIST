import React, { useState } from 'react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';

export function SettingsNotifications() {
  const [reminders, setReminders] = useState({
    assignment: true,
    lab: true,
    project: true,
    timetable: false
  });

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Notifications" 
        subtitle="Manage your alerts and reminders." 
        backTo="/app/settings" 
        backLabel="Settings" 
      />

      <div className="space-y-6">
        <Card className="p-6">
          <SectionHeading title="Reminders" />
          
          <div className="space-y-4">
            <Toggle
              label="Assignment reminders"
              description="24 hours before each due date"
              checked={reminders.assignment}
              onChange={(v) => setReminders({ ...reminders, assignment: v })} 
            />
            
            <Toggle
              label="Lab reminders"
              description="Before each submission date"
              checked={reminders.lab}
              onChange={(v) => setReminders({ ...reminders, lab: v })} 
            />
            
            <Toggle
              label="Project reminders"
              description="On milestone deadlines"
              checked={reminders.project}
              onChange={(v) => setReminders({ ...reminders, project: v })} 
            />
            
            <Toggle
              label="Timetable reminders"
              description="15 minutes before every class"
              checked={reminders.timetable}
              onChange={(v) => setReminders({ ...reminders, timetable: v })} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
