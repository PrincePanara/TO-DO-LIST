import React, { useState } from 'react';
import type { ChecklistItem, Priority, Task, TaskCategory } from '../../types';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChipGroup, Select, TextArea, TextInput, Toggle } from '../ui/Field';
import { ChecklistEditor } from './ChecklistEditor';
import { isoOffset } from '../../utils/date';

const categories: {value: TaskCategory;label: string;}[] = [
{ value: 'STUDY', label: 'Study' },
{ value: 'ASSIGNMENT', label: 'Assignment' },
{ value: 'LAB', label: 'Lab' },
{ value: 'MINI_PROJECT', label: 'Mini Project' },
{ value: 'MAJOR_PROJECT', label: 'Major Project' },
{ value: 'PERSONAL', label: 'Personal' }];


const priorities: {value: Priority;label: string;}[] = [
{ value: 'URGENT', label: 'Urgent' },
{ value: 'IMPORTANT', label: 'Important' },
{ value: 'NORMAL', label: 'Normal' }];


export function TaskForm({
  open,
  onClose,
  editing,
  presetSubjectId,
  presetProjectId
}: {open: boolean;onClose: () => void;editing?: Task;presetSubjectId?: string; presetProjectId?: string;}) {
  const { subjects, projects, upsertTask, toast } = useStudyForge();
  const { user } = useAuth();
  const [title, setTitle] = useState(editing?.title ?? '');
  const [subjectId, setSubjectId] = useState(editing?.subjectId ?? presetSubjectId ?? '');
  const [category, setCategory] = useState<TaskCategory>(editing?.category ?? 'STUDY');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? isoOffset(1));
  const [dueTime, setDueTime] = useState(editing?.dueTime ?? '17:00');
  const [priority, setPriority] = useState<Priority>(editing?.priority ?? 'NORMAL');
  const [hours, setHours] = useState(String(editing?.estimatedHours ?? 1));
  const [checklist, setChecklist] = useState<ChecklistItem[]>(editing?.checklist ?? []);
  const [reminder, setReminder] = useState(editing?.reminder ?? true);
  const [projectId, setProjectId] = useState(editing?.projectId ?? presetProjectId ?? '');
  const [assigneeId, setAssigneeId] = useState(editing?.assigneeId ?? '');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [error, setError] = useState('');

  // If a project is selected, fetch its members to populate the assignee dropdown
  const selectedProject = projects.find(p => p.id === projectId);
  const projectMembers = selectedProject ? [selectedProject.ownerId, ...selectedProject.members] : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task name is required');
      return;
    }
    upsertTask({
      id: editing?.id ?? newId(),
      title: title.trim(),
      subjectId: subjectId || null,
      projectId: projectId || null,
      assigneeId: assigneeId || null,
      category,
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      status: editing?.status ?? 'NOT_STARTED',
      estimatedHours: Number(hours) || 0,
      checklist,
      reminder
    });
    toast(editing ? 'Task updated ✓' : 'Task created ✓');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Task' : 'Add Task'}
      subtitle="Everything you need to remember, in one place."
      footer={
      <>
          <Button variant="white" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="task-form" type="submit">
            {editing ? 'Save Task' : 'Create Task'}
          </Button>
        </>
      }>
      
      <form id="task-form" onSubmit={submit} className="space-y-5">
        <TextInput
          label="Task name"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          error={error}
          required />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={[
            { value: '', label: 'No subject' },
            ...subjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }))]
            } />
          
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            options={categories} />
          
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Subject (Optional)" 
            value={subjectId} 
            onChange={(e) => setSubjectId(e.target.value)}
            options={[{value: '', label: 'General'}, ...subjects.map(s => ({value: s.id, label: s.name}))]} 
          />

          <Select 
            label="Project (Optional)" 
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)} 
            disabled={!!presetProjectId}
            options={[{value: '', label: 'None'}, ...projects.map(p => ({value: p.id, label: p.name}))]} 
          />
        </div>

        {projectId && (
          <Select 
            label="Assign to Member (Optional)" 
            value={assigneeId} 
            onChange={(e) => setAssigneeId(e.target.value)}
            options={[{value: '', label: 'Unassigned'}, ...projectMembers.map(uid => ({value: uid, label: uid === user?.uid ? 'You' : uid}))]} 
          />
        )}

        <TextArea
          label="Description"
          placeholder="What exactly needs to be done?"
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
        
        <div className="grid gap-5 sm:grid-cols-3">
          <TextInput
            label="Deadline date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} />
          
          <TextInput
            label="Deadline time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)} />
          
          <TextInput
            label="Estimated time (hours)"
            type="number"
            min={0}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)} />
          
        </div>
        <ChipGroup label="Priority" value={priority} options={priorities} onChange={setPriority} />
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <div>
          <span className="brut-label">Attachments</span>
          <input
            type="file"
            multiple
            aria-label="Attachments"
            onChange={(e) =>
            setAttachments(Array.from(e.target.files ?? []).map((f) => f.name))
            }
            className="brut-input file:mr-3 file:border-3 file:border-ink file:bg-sun file:px-3 file:py-1 file:font-display file:text-xs file:font-bold file:uppercase" />
          
          {attachments.length > 0 &&
          <p className="muted mt-2 text-xs">{attachments.join(', ')}</p>
          }
        </div>
        <Toggle
          label="Reminder"
          description="Notify me before the deadline"
          checked={reminder}
          onChange={setReminder} />
        
      </form>
    </Modal>);

}