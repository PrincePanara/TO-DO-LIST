import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type {
  AppNotification,
  Assignment,
  ClassSlot,
  LabWork,
  Note,
  Project,
  StudentProfile,
  Subject,
  Task } from
'../types';
import { useAuth } from './AuthContext';
import { 
  upsertUserDoc, 
  deleteUserDoc, 
  subscribeToUserCollection,
  subscribeToUserProfile,
  subscribeToSharedProjects,
  upsertSharedProject,
  deleteSharedProject,
  sendNotificationToUser,
  getSharedProject,
  updateUserProfile
} from '../firebase/db';

export type Theme = 'light' | 'dark';
export interface Toast {
  id: string;
  message: string;
  tone: 'success' | 'error' | 'info';
}

const emptyProfile: StudentProfile = {
  name: '',
  college: '',
  course: '',
  branch: '',
  semester: '',
  academicYear: ''
};

interface StudyForgeState {
  profile: StudentProfile;
  subjects: Subject[];
  tasks: Task[];
  assignments: Assignment[];
  labs: LabWork[];
  projects: Project[];
  notes: Note[];
  timetable: ClassSlot[];
  notifications: AppNotification[];
  theme: Theme;
  toasts: Toast[];
  onboarded: boolean;
  profileLoaded: boolean;
}

interface StudyForgeActions {
  setProfile: (p: StudentProfile) => void;
  addSubjects: (s: Subject[]) => void;
  upsertSubject: (s: Subject) => void;
  removeSubject: (id: string) => void;
  upsertTask: (t: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  upsertAssignment: (a: Assignment) => void;
  removeAssignment: (id: string) => void;
  upsertLab: (l: LabWork) => void;
  removeLab: (id: string) => void;
  upsertProject: (p: Project) => void;
  removeProject: (id: string) => void;
  upsertNote: (n: Note) => void;
  removeNote: (id: string) => void;
  upsertClass: (c: ClassSlot) => void;
  removeClass: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  inviteUserToProject: (projectId: string, targetUid: string, projectName: string) => Promise<void>;
  respondToInvite: (notificationId: string, projectId: string, accept: boolean) => Promise<void>;
  toggleTheme: () => void;
  setOnboarded: (v: boolean) => void;
  toast: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
  subject: (id: string | null | undefined) => Subject | undefined;
}

const StudyForgeContext = createContext<(StudyForgeState & StudyForgeActions) | null>(null);

export const newId = () => Math.random().toString(36).slice(2, 10);

const replaceOrAppend = <T extends {id: string;},>(list: T[], item: T): T[] =>
list.some((x) => x.id === item.id) ?
list.map((x) => x.id === item.id ? item : x) :
[item, ...list];

export function StudyForgeProvider({ children }: {children: React.ReactNode;}) {
  const { user } = useAuth();
  
  const [profile, setProfileState] = useState<StudentProfile>(emptyProfile);
  const [subjects, setSubjectsState] = useState<Subject[]>([]);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [assignments, setAssignmentsState] = useState<Assignment[]>([]);
  const [labs, setLabsState] = useState<LabWork[]>([]);
  const [projects, setProjectsState] = useState<Project[]>([]);
  const [notes, setNotesState] = useState<Note[]>([]);
  const [timetable, setTimetableState] = useState<ClassSlot[]>([]);
  const [notifications, setNotificationsState] = useState<AppNotification[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [onboarded, setOnboarded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Firebase Real-time listeners
  useEffect(() => {
    if (!user) {
      // Clear data on logout
      setProfileState(emptyProfile);
      setSubjectsState([]);
      setTasksState([]);
      setAssignmentsState([]);
      setLabsState([]);
      setProjectsState([]);
      setNotesState([]);
      setTimetableState([]);
      setNotificationsState([]);
      setOnboarded(false);
      setProfileLoaded(false);
      return;
    }

    const unsubProfile = subscribeToUserProfile(user.uid, (data) => {
      setProfileLoaded(true); // mark profile as loaded regardless of data
      if (data) {
        setProfileState(data as StudentProfile);
        if (data.onboardedCompleted) {
          setOnboarded(true);
        }
      }
    });

    const unsubSubjects = subscribeToUserCollection<Subject>(user.uid, 'subjects', setSubjectsState);
    const unsubTasks = subscribeToUserCollection<Task>(user.uid, 'tasks', setTasksState);
    const unsubAssignments = subscribeToUserCollection<Assignment>(user.uid, 'assignments', setAssignmentsState);
    const unsubLabs = subscribeToUserCollection<LabWork>(user.uid, 'labs', setLabsState);
    const unsubProjects = subscribeToSharedProjects<Project>(user.uid, setProjectsState);
    const unsubNotes = subscribeToUserCollection<Note>(user.uid, 'notes', setNotesState);
    const unsubTimetable = subscribeToUserCollection<ClassSlot>(user.uid, 'timetable', setTimetableState);
    const unsubNotifications = subscribeToUserCollection<AppNotification>(user.uid, 'notifications', setNotificationsState);

    return () => {
      unsubProfile();
      unsubSubjects();
      unsubTasks();
      unsubAssignments();
      unsubLabs();
      unsubProjects();
      unsubNotes();
      unsubTimetable();
      unsubNotifications();
    };
  }, [user]);

  const toast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = newId();
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }, []);

  // Safe wrapper for firestore writes
  const firestoreWrite = async (action: () => Promise<void>) => {
    if (!user) {
      toast('You must be logged in to save data', 'error');
      return;
    }
    try {
      await action();
    } catch (err: any) {
      console.error(err);
      toast('Failed to save to database', 'error');
    }
  };

  const value = useMemo(
    () => ({
      profile,
      subjects,
      tasks,
      assignments,
      labs,
      projects,
      notes,
      timetable,
      notifications,
      theme,
      toasts,
      onboarded,
      profileLoaded,
      
      setProfile: (p: StudentProfile) => {
        setProfileState(p);
        firestoreWrite(() => updateUserProfile(user!.uid, p));
      },
      addSubjects: (list: Subject[]) => {
        list.forEach(s => firestoreWrite(() => upsertUserDoc(user!.uid, 'subjects', s)));
      },
      upsertSubject: (s: Subject) => {
        setSubjectsState(prev => replaceOrAppend(prev, s)); // Optimistic UI
        firestoreWrite(() => upsertUserDoc(user!.uid, 'subjects', s));
      },
      removeSubject: (id: string) => {
        setSubjectsState(prev => prev.filter(s => s.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'subjects', id));
      },
      upsertTask: (t: Task) => {
        setTasksState(prev => replaceOrAppend(prev, t));
        firestoreWrite(() => upsertUserDoc(user!.uid, 'tasks', t));
      },
      toggleTask: (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
          const updated = { ...task, status: task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' as const };
          setTasksState(prev => replaceOrAppend(prev, updated));
          firestoreWrite(() => upsertUserDoc(user!.uid, 'tasks', updated));
        }
      },
      removeTask: (id: string) => {
        setTasksState(prev => prev.filter(t => t.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'tasks', id));
      },
      upsertAssignment: (a: Assignment) => {
        setAssignmentsState(prev => replaceOrAppend(prev, a));
        firestoreWrite(() => upsertUserDoc(user!.uid, 'assignments', a));
      },
      removeAssignment: (id: string) => {
        setAssignmentsState(prev => prev.filter(a => a.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'assignments', id));
      },
      upsertLab: (l: LabWork) => {
        setLabsState(prev => replaceOrAppend(prev, l));
        firestoreWrite(() => upsertUserDoc(user!.uid, 'labs', l));
      },
      removeLab: (id: string) => {
        setLabsState(prev => prev.filter(l => l.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'labs', id));
      },
      upsertProject: (p: Project) => {
        setProjectsState(prev => replaceOrAppend(prev, p));
        firestoreWrite(() => upsertSharedProject(p));
      },
      removeProject: (id: string) => {
        setProjectsState(prev => prev.filter(p => p.id !== id));
        firestoreWrite(() => deleteSharedProject(id));
      },
      upsertNote: (n: Note) => {
        setNotesState(prev => replaceOrAppend(prev, n));
        firestoreWrite(() => upsertUserDoc(user!.uid, 'notes', n));
      },
      removeNote: (id: string) => {
        setNotesState(prev => prev.filter(n => n.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'notes', id));
      },
      upsertClass: (c: ClassSlot) => {
        setTimetableState(prev => replaceOrAppend(prev, c));
        firestoreWrite(() => upsertUserDoc(user!.uid, 'timetable', c));
      },
      removeClass: (id: string) => {
        setTimetableState(prev => prev.filter(c => c.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'timetable', id));
      },
      markNotificationRead: (id: string) => {
        const n = notifications.find(n => n.id === id);
        if (n) {
          const updated = { ...n, read: true };
          setNotificationsState(prev => replaceOrAppend(prev, updated));
          firestoreWrite(() => upsertUserDoc(user!.uid, 'notifications', updated));
        }
      },
      markAllNotificationsRead: () => {
        notifications.forEach(n => {
          if (!n.read) {
            const updated = { ...n, read: true };
            firestoreWrite(() => upsertUserDoc(user!.uid, 'notifications', updated));
          }
        });
      },
      removeNotification: (id: string) => {
        setNotificationsState(prev => prev.filter(n => n.id !== id));
        firestoreWrite(() => deleteUserDoc(user!.uid, 'notifications', id));
      },
      inviteUserToProject: async (projectId: string, targetUid: string, projectName: string) => {
        if (!user) return;
        if (targetUid === user.uid) {
          toast('You cannot invite yourself', 'error');
          return;
        }
        try {
          // Add UID to project's pendingInvites array
          const proj = projects.find(p => p.id === projectId);
          if (proj) {
            if (proj.pendingInvites?.includes(targetUid) || proj.members?.includes(targetUid)) {
              toast('This user already has a pending invite or is already a member', 'error');
              return;
            }
            const updatedProj = { 
              ...proj, 
              pendingInvites: [...(proj.pendingInvites ?? []), targetUid] 
            };
            await upsertSharedProject(updatedProj);
            setProjectsState(prev => replaceOrAppend(prev, updatedProj));
          }
          // Send notification to the invited user
          await sendNotificationToUser(targetUid, {
            id: newId(),
            kind: 'project_invite',
            message: `You have been invited to join the project: ${projectName}`,
            meta: projectId,
            read: false,
            createdAt: new Date().toISOString()
          });
          toast('Invitation sent successfully');
        } catch (e) {
          console.error(e);
          toast('Failed to send invitation', 'error');
        }
      },
      respondToInvite: async (notificationId: string, projectId: string, accept: boolean) => {
        if (!user) return;
        
        try {
          if (accept) {
            // Fetch project directly from Firestore — it may not be in local state yet
            // because the invitee isn't a member until they accept
            const projData = await getSharedProject(projectId);
            if (projData) {
              const proj = projData as import('../types').Project;
              const alreadyMember = (proj.members ?? []).includes(user.uid);
              if (!alreadyMember) {
                const updatedProj = {
                  ...proj,
                  members: [...(proj.members ?? []), user.uid],
                  pendingInvites: (proj.pendingInvites ?? []).filter((uid: string) => uid !== user.uid)
                };
                await upsertSharedProject(updatedProj);
                setProjectsState(prev => replaceOrAppend(prev, updatedProj));
              }
            }
          } else {
            // Reject: remove the UID from pendingInvites on the project
            const proj = await getSharedProject(projectId);
            if (proj) {
              const updatedProj = {
                ...(proj as import('../types').Project),
                pendingInvites: ((proj as any).pendingInvites ?? []).filter((uid: string) => uid !== user.uid)
              };
              await upsertSharedProject(updatedProj);
            }
          }
          // Remove notification regardless of accept/reject
          setNotificationsState(prev => prev.filter(n => n.id !== notificationId));
          await deleteUserDoc(user.uid, 'notifications', notificationId);
          toast(accept ? 'Joined project successfully!' : 'Invitation declined');
        } catch (e) {
          console.error(e);
          toast('Failed to respond to invitation', 'error');
        }
      },
      toggleTheme: () => setTheme((t) => t === 'light' ? 'dark' : 'light'),
      setOnboarded: (v: boolean) => {
        setOnboarded(v);
        firestoreWrite(() => updateUserProfile(user!.uid, { onboardedCompleted: v }));
      },
      toast,
      dismissToast: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
      subject: (id: string | null | undefined) => subjects.find((s) => s.id === id)
    }),
    [
    profile,
    subjects,
    tasks,
    assignments,
    labs,
    projects,
    notes,
    timetable,
    notifications,
    theme,
    toasts,
    onboarded,
    profileLoaded,
    toast,
    user]
  );

  return <StudyForgeContext.Provider value={value}>{children}</StudyForgeContext.Provider>;
}

export function useStudyForge() {
  const ctx = useContext(StudyForgeContext);
  if (!ctx) throw new Error('useStudyForge must be used inside StudyForgeProvider');
  return ctx;
}