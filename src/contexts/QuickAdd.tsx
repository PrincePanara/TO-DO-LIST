import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  Assignment,
  ClassSlot,
  LabWork,
  Note,
  Project,
  ProjectType,
  Subject,
  Task } from
'../types';
import { newId, useStudyForge } from './StudyForgeContext';
import { useAuth } from './AuthContext';
import { TaskForm } from '../components/forms/TaskForm';
import { SubjectForm } from '../components/forms/SubjectForm';
import { AssignmentForm } from '../components/forms/AssignmentForm';
import { LabForm } from '../components/forms/LabForm';
import { ProjectForm } from '../components/forms/ProjectForm';
import { ClassForm } from '../components/forms/ClassForm';
import { isoOffset } from '../utils/date';

export type QuickAddKind =
'task' |
'assignment' |
'lab' |
'mini-project' |
'major-project' |
'note' |
'subject' |
'class';

interface QuickAddOptions {
  subjectId?: string;
  projectId?: string;
  day?: ClassSlot['day'];
  editTask?: Task;
  editAssignment?: Assignment;
  editLab?: LabWork;
  editProject?: Project;
  editSubject?: Subject;
  editClass?: ClassSlot;
}

interface QuickAddValue {
  open: (kind: QuickAddKind, options?: QuickAddOptions) => void;
}

const QuickAddContext = createContext<QuickAddValue | null>(null);

export function QuickAddProvider({ children }: {children: React.ReactNode;}) {
  const { upsertNote, toast } = useStudyForge();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kind, setKind] = useState<QuickAddKind | null>(null);
  const [options, setOptions] = useState<QuickAddOptions>({});

  const close = useCallback(() => setKind(null), []);

  const open = useCallback(
    (next: QuickAddKind, opts: QuickAddOptions = {}) => {
      if (next === 'note') {
        const note: Note = {
          id: newId(),
          title: 'Untitled note',
          subjectId: opts.subjectId ?? null,
          type: 'LECTURE',
          tags: [],
          content: '',
          updatedAt: isoOffset(0),
          ownerId: user?.uid ?? '',
          pendingInvites: []
        };
        upsertNote(note);
        toast('Note created ✓');
        navigate(`/app/notes/${note.id}`);
        return;
      }
      setOptions(opts);
      setKind(next);
    },
    [navigate, toast, upsertNote, user]
  );

  const value = useMemo(() => ({ open }), [open]);

  return (
    <QuickAddContext.Provider value={value}>
      {children}
      {kind === 'task' && (
        <TaskForm
          open={true}
          onClose={close}
          editing={options.editTask}
          presetSubjectId={options.subjectId}
          presetProjectId={options.projectId} />
      )}
      {kind === 'assignment' &&
      <AssignmentForm
        open
        onClose={close}
        editing={options.editAssignment}
        presetSubjectId={options.subjectId} />

      }
      {kind === 'lab' &&
      <LabForm open onClose={close} editing={options.editLab} presetSubjectId={options.subjectId} />
      }
      {(kind === 'mini-project' || kind === 'major-project') &&
      <ProjectForm
        open
        onClose={close}
        editing={options.editProject}
        presetType={(kind === 'major-project' ? 'MAJOR' : 'MINI') as ProjectType}
        presetSubjectId={options.subjectId} />

      }
      {kind === 'subject' && <SubjectForm open onClose={close} editing={options.editSubject} />}
      {kind === 'class' &&
      <ClassForm open onClose={close} editing={options.editClass} presetDay={options.day} />
      }
    </QuickAddContext.Provider>);

}

export function useQuickAdd() {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error('useQuickAdd must be used inside QuickAddProvider');
  return ctx;
}