import React, { useState } from 'react';
import type { Priority, Project, ProjectType } from '../../types';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChipGroup, Select, TextArea, TextInput } from '../ui/Field';
import { ListInput } from './ListInput';
import { isoOffset } from '../../utils/date';

const priorities: {value: Priority;label: string;}[] = [
{ value: 'URGENT', label: 'Urgent' },
{ value: 'IMPORTANT', label: 'Important' },
{ value: 'NORMAL', label: 'Normal' }];


export function ProjectForm({
  open,
  onClose,
  editing,
  presetType,
  presetSubjectId






}: {open: boolean;onClose: () => void;editing?: Project;presetType?: ProjectType;presetSubjectId?: string;}) {
  const { subjects, upsertProject, toast } = useStudyForge();
  const { user } = useAuth();
  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState<ProjectType>(editing?.type ?? presetType ?? 'MINI');
  const [subjectId, setSubjectId] = useState(
    editing?.subjectId ?? presetSubjectId ?? subjects[0]?.id ?? ''
  );
  const [description, setDescription] = useState(editing?.description ?? '');
  const [startDate, setStartDate] = useState(editing?.startDate ?? isoOffset(0));
  const [deadline, setDeadline] = useState(editing?.deadline ?? isoOffset(30));
  const [priority, setPriority] = useState<Priority>(editing?.priority ?? 'IMPORTANT');
  const [technologies, setTechnologies] = useState<string[]>(editing?.technologies ?? []);
  const [repoLink, setRepoLink] = useState(editing?.repoLink ?? '');
  const [docsLink, setDocsLink] = useState(editing?.docsLink ?? '');
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    upsertProject({
      id: editing?.id ?? newId(),
      name: name.trim(),
      type,
      subjectId,
      description,
      startDate,
      deadline,
      priority,
      ownerId: editing?.ownerId ?? user?.uid ?? '',
      members: editing?.members ?? [],
      pendingInvites: editing?.pendingInvites ?? [],
      technologies,
      repoLink,
      docsLink,
      notes,
      stage: editing?.stage ?? 'IDEA',
      status: editing?.status ?? 'NOT_STARTED',
      milestones:
      editing?.milestones ?? (
      type === 'MAJOR' ?
      [
      { id: newId(), title: 'Planning & research', status: 'NOT_STARTED', progress: 0 },
      { id: newId(), title: 'Development', status: 'NOT_STARTED', progress: 0 },
      { id: newId(), title: 'Testing', status: 'NOT_STARTED', progress: 0 },
      { id: newId(), title: 'Documentation', status: 'NOT_STARTED', progress: 0 },
      { id: newId(), title: 'Final presentation', status: 'NOT_STARTED', progress: 0 }] :

      [
      { id: newId(), title: 'Build core feature', status: 'NOT_STARTED', progress: 0 },
      { id: newId(), title: 'Polish & submit', status: 'NOT_STARTED', progress: 0 }])

    });
    toast(editing ? 'Project updated ✓' : 'Project created ✓');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Project' : 'Create Project'}
      subtitle="Mini or major — milestones are generated for you."
      footer={
      <>
          <Button variant="white" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="project-form" type="submit">
            Save Project
          </Button>
        </>
      }>
      
      <form id="project-form" onSubmit={submit} className="space-y-5">
        <TextInput
          label="Project name"
          placeholder="e.g. Smart Campus System"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required />
        
        <ChipGroup
          label="Project type"
          value={type}
          options={[
          { value: 'MINI', label: 'Mini Project' },
          { value: 'MAJOR', label: 'Major Project' }]
          }
          onChange={setType} />
        
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          options={subjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }))} />
        
        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} />
          
          <TextInput
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)} />
          
        </div>
        <ChipGroup label="Priority" value={priority} options={priorities} onChange={setPriority} />
        <ListInput
          label="Technologies"
          values={technologies}
          onChange={setTechnologies}
          placeholder="Add technology" />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            label="Repository link"
            placeholder="https://github.com/…"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)} />
          
          <TextInput
            label="Documentation link"
            placeholder="https://…"
            value={docsLink}
            onChange={(e) => setDocsLink(e.target.value)} />
          
        </div>
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </form>
    </Modal>);

}