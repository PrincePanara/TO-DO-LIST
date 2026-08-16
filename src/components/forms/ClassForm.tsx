import React, { useState } from 'react';
import type { ClassSlot } from '../../types';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChipGroup, Select, TextInput, Toggle } from '../ui/Field';

const days: {value: ClassSlot['day'];label: string;}[] = [
{ value: 'MON', label: 'Mon' },
{ value: 'TUE', label: 'Tue' },
{ value: 'WED', label: 'Wed' },
{ value: 'THU', label: 'Thu' },
{ value: 'FRI', label: 'Fri' },
{ value: 'SAT', label: 'Sat' }];


export function ClassForm({
  open,
  onClose,
  editing,
  presetDay





}: {open: boolean;onClose: () => void;editing?: ClassSlot;presetDay?: ClassSlot['day'];}) {
  const { subjects, upsertClass, toast } = useStudyForge();
  const [subjectId, setSubjectId] = useState(editing?.subjectId ?? subjects[0]?.id ?? '');
  const [teacher, setTeacher] = useState(
    editing?.teacher ?? subjects.find((s) => s.id === (editing?.subjectId ?? subjects[0]?.id))?.teacher ?? ''
  );
  const [room, setRoom] = useState(editing?.room ?? '');
  const [day, setDay] = useState<ClassSlot['day']>(editing?.day ?? presetDay ?? 'MON');
  const [start, setStart] = useState(editing?.start ?? '09:00');
  const [end, setEnd] = useState(editing?.end ?? '10:00');
  const [kind, setKind] = useState<ClassSlot['kind']>(editing?.kind ?? 'THEORY');
  const [repeat, setRepeat] = useState(true);
  const [reminder, setReminder] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertClass({
      id: editing?.id ?? newId(),
      subjectId,
      teacher,
      room,
      day,
      start,
      end,
      kind
    });
    toast(editing ? 'Class updated ✓' : 'Added to timetable ✓');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Class' : 'Add Class'}
      subtitle="Slots use your subject colour across the timetable."
      width="md"
      footer={
      <>
          <Button variant="white" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="class-form" type="submit">
            Add to timetable
          </Button>
        </>
      }>
      
      <form id="class-form" onSubmit={submit} className="space-y-5">
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => {
            setSubjectId(e.target.value);
            const s = subjects.find((x) => x.id === e.target.value);
            if (s) setTeacher(s.teacher);
          }}
          options={subjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }))} />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput label="Teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          <TextInput
            label="Room"
            placeholder="Room 204 / Lab 03"
            value={room}
            onChange={(e) => setRoom(e.target.value)} />
          
        </div>
        <ChipGroup label="Day" value={day} options={days} onChange={setDay} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            label="Start time"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)} />
          
          <TextInput
            label="End time"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)} />
          
        </div>
        <ChipGroup
          label="Session type"
          value={kind}
          options={[
          { value: 'THEORY', label: 'Theory' },
          { value: 'LAB', label: 'Lab' }]
          }
          onChange={setKind} />
        
        <Toggle
          label="Repeat weekly"
          description="Show this slot every week of the semester"
          checked={repeat}
          onChange={setRepeat} />
        
        <Toggle
          label="Reminder"
          description="Notify me 15 minutes before class"
          checked={reminder}
          onChange={setReminder} />
        
      </form>
    </Modal>);

}