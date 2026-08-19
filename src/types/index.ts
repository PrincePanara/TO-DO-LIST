export type Priority = 'URGENT' | 'IMPORTANT' | 'NORMAL';
export type WorkStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskCategory =
'STUDY' |
'ASSIGNMENT' |
'LAB' |
'MINI_PROJECT' |
'MAJOR_PROJECT' |
'PERSONAL';
export type SubjectColor = 'purple' | 'yellow' | 'red' | 'green' | 'white';
export type NoteType = 'LECTURE' | 'REVISION' | 'IMPORTANT' | 'EXAM' | 'IDEAS';
export type ProjectType = 'MINI' | 'MAJOR';
export type ProjectStage =
'IDEA' |
'PLANNING' |
'DEVELOPMENT' |
'TESTING' |
'DOCUMENTATION' |
'PRESENTATION' |
'COMPLETED';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  teacher: string;
  theory: boolean;
  lab: boolean;
  units: number;
  description: string;
  color: SubjectColor;
  archived?: boolean;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string | null;
  projectId?: string | null;
  assigneeId?: string | null;
  category: TaskCategory;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  status: WorkStatus;
  estimatedHours: number;
  checklist: ChecklistItem[];
  reminder: boolean;
}

export interface Assignment {
  id: string;
  number: number;
  title: string;
  subjectId: string;
  description: string;
  instructions: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  status: WorkStatus;
  checklist: ChecklistItem[];
  notes: string;
  attachments: string[];
  links: string[];
  submitted: boolean;
}

export interface VivaQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface LabWork {
  id: string;
  number: number;
  title: string;
  subjectId: string;
  objective: string;
  theory: string;
  requirements: string[];
  procedure: string[];
  code: string;
  output: string;
  viva: VivaQuestion[];
  notes: string;
  submissionDate: string;
  status: WorkStatus;
  checklist: ChecklistItem[];
  attachments: string[];
  color?: SubjectColor;
}

export interface Milestone {
  id: string;
  title: string;
  status: WorkStatus;
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  subjectId: string;
  description: string;
  startDate: string;
  deadline: string;
  priority: Priority;
  ownerId: string;
  members: string[];
  pendingInvites: string[];
  technologies: string[];
  repoLink: string;
  docsLink: string;
  notes: string;
  stage: ProjectStage;
  milestones: Milestone[];
  status: WorkStatus;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string | null;
  type: NoteType;
  tags: string[];
  content: string;
  updatedAt: string;
  shared?: boolean;
  ownerId?: string;
  collaborators?: string[];
  pendingInvites?: string[];
}

export interface ClassSlot {
  id: string;
  subjectId: string;
  teacher: string;
  room: string;
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  start: string;
  end: string;
  kind: 'THEORY' | 'LAB';
}

export interface AppNotification {
  id: string;
  kind: 'urgent' | 'warn' | 'info' | 'success' | 'project_invite' | 'note_invite';
  message: string;
  meta: string;
  createdAt: string;
  read: boolean;
}

export interface StudentProfile {
  name: string;
  college: string;
  course: string;
  branch: string;
  semester: string;
  academicYear: string;
}

export interface DetectedSubject extends Subject {
  selected: boolean;
}