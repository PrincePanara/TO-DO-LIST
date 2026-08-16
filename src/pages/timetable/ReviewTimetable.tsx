import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRightIcon, XIcon, TrashIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, TextInput } from '../../components/ui/Field';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import type { ClassSlot, SubjectColor } from '../../types';

const days: ClassSlot['day'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const slotTone: Record<SubjectColor, string> = {
  purple: 'bg-brand text-white',
  yellow: 'bg-sun text-ink',
  red: 'bg-danger text-white',
  green: 'bg-ok text-ink',
  white: 'bg-white text-ink dark:bg-white/10 dark:text-white'
};

function hourIndex(hhmm: string) {
  return hours.indexOf(`${hhmm.slice(0, 2)}:00`);
}

export function ReviewTimetable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjects, upsertClass, toast } = useStudyForge();
  const defaultSubjectId = subjects.length > 0 ? subjects[0].id : '';

  const parsedClasses = location.state?.classes as ClassSlot[] | undefined;

  const [detectedClasses, setDetectedClasses] = useState<ClassSlot[]>(
    parsedClasses && parsedClasses.length > 0 
      ? parsedClasses 
      : [] // empty default if nothing was parsed
  );

  const [editingSlot, setEditingSlot] = useState<Partial<ClassSlot> | null>(null);

  const handleGridClick = (day: ClassSlot['day'], hour: string) => {
    // Check if clicked on an empty slot
    const startHour = hour;
    const endHour = hours[hours.indexOf(hour) + 1] || `${parseInt(hour) + 1}:00`;
    
    setEditingSlot({
      id: newId(),
      subjectId: defaultSubjectId,
      day: day,
      start: startHour,
      end: endHour,
      room: '',
      kind: 'THEORY'
    });
  };

  const handleEditClick = (c: ClassSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSlot(c);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    
    setDetectedClasses(prev => {
      const exists = prev.find(c => c.id === editingSlot.id);
      if (exists) {
        return prev.map(c => c.id === editingSlot.id ? editingSlot as ClassSlot : c);
      }
      return [...prev, editingSlot as ClassSlot];
    });
    setEditingSlot(null);
  };

  const handleDeleteModal = () => {
    if (!editingSlot) return;
    setDetectedClasses(prev => prev.filter(c => c.id !== editingSlot.id));
    setEditingSlot(null);
  };

  const confirmAndSave = () => {
    detectedClasses.forEach(c => {
      if (c.subjectId) {
        upsertClass(c);
      }
    });
    toast(`${detectedClasses.length} classes added to your timetable ✓`);
    navigate('/app/timetable');
  };

  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }));

  return (
    <div className="mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
          Review Timetable Grid
        </h1>
        <p className="muted mt-4 text-base">
          We extracted this grid from your file. Click on any block to edit its details, or click an empty slot to add a missing class.
        </p>
      </div>

      <Card className="overflow-x-auto p-4 mb-24">
        <div
          className="grid min-w-[860px] gap-1 relative"
          style={{
            gridTemplateColumns: '76px repeat(6, minmax(120px, 1fr))',
            gridTemplateRows: `40px repeat(${hours.length}, 74px)`
          }}>
          
          <div aria-hidden />
          {days.map((d) => (
            <div
              key={d}
              className="flex items-center justify-center border-3 border-ink bg-white font-display text-xs font-bold uppercase tracking-[0.12em] dark:border-white dark:bg-white/5 dark:text-white"
            >
              {d}
            </div>
          ))}

          {hours.map((h, i) => (
            <div
              key={h}
              className="flex items-start justify-end pr-2 font-display text-[11px] font-bold uppercase tracking-[0.1em]"
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              {h}
            </div>
          ))}

          {hours.map((h, i) => (
            days.map((d, di) => (
              <button
                key={`${h}-${d}`}
                type="button"
                onClick={() => handleGridClick(d, h)}
                aria-label={`Add class on ${d} at ${h}`}
                className="border-3 border-dashed border-ink/25 hover:border-brand hover:bg-brand-soft focus-brut dark:border-white/25"
                style={{ gridColumn: di + 2, gridRow: i + 2 }}
              />
            ))
          ))}

          {detectedClasses.map((c) => {
            const start = hourIndex(c.start);
            const end = hourIndex(c.end);
            const di = days.indexOf(c.day);
            if (start < 0 || di < 0) return null;
            const span = Math.max(1, (end < 0 ? start + 1 : end) - start);
            const s = subjects.find(sub => sub.id === c.subjectId);
            
            return (
              <button
                key={c.id}
                onClick={(e) => handleEditClick(c, e)}
                className={`group relative flex flex-col justify-between border-3 border-ink p-2 shadow-brut-xs text-left press focus-brut dark:border-white ${
                  slotTone[s?.color ?? 'white']
                }`}
                style={{ gridColumn: di + 2, gridRow: `${start + 2} / span ${span}`, zIndex: 10 }}
              >
                <div>
                  <p className="font-display text-[11px] font-bold uppercase leading-tight">
                    {s?.code ?? 'CLASS'}
                  </p>
                  <p className="mt-0.5 line-clamp-2 font-display text-xs font-bold uppercase leading-tight">
                    {s?.name ?? 'Unknown Subject'}
                  </p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-80">
                  {c.room} • {c.kind}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Editing Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-ink">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Edit Class</h2>
              <button onClick={() => setEditingSlot(null)} className="p-1 hover:bg-ink/5 focus-brut">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <Select
                label="Subject"
                value={editingSlot.subjectId}
                onChange={(e) => setEditingSlot({ ...editingSlot, subjectId: e.target.value })}
                options={subjectOptions.length > 0 ? subjectOptions : [{value: '', label: 'No subjects available'}]}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  type="time"
                  label="Start"
                  value={editingSlot.start}
                  onChange={(e) => setEditingSlot({ ...editingSlot, start: e.target.value })}
                />
                <TextInput
                  type="time"
                  label="End"
                  value={editingSlot.end}
                  onChange={(e) => setEditingSlot({ ...editingSlot, end: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Type"
                  value={editingSlot.kind}
                  onChange={(e) => setEditingSlot({ ...editingSlot, kind: e.target.value as 'THEORY' | 'LAB' })}
                  options={[{ value: 'THEORY', label: 'THEORY' }, { value: 'LAB', label: 'LAB' }]}
                />
                <TextInput
                  label="Room"
                  value={editingSlot.room}
                  onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                />
              </div>
              <div className="flex justify-between mt-8">
                <Button type="button" variant="white" onClick={handleDeleteModal} className="text-danger hover:bg-danger/10">
                  <TrashIcon className="w-4 h-4 mr-2" /> Remove
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t-3 border-ink bg-white px-5 py-4 shadow-brut dark:border-white dark:bg-[#232228]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="font-display text-lg font-bold uppercase tracking-tight">
            {detectedClasses.length} class{detectedClasses.length === 1 ? '' : 'es'} mapped
          </p>
          <Button size="lg" onClick={confirmAndSave} disabled={detectedClasses.length === 0 || subjectOptions.length === 0}>
            Confirm and Save <ArrowRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
