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
  updateUserProfile,
  subscribeToProjectTasks,
  upsertProjectTask,
  deleteProjectTask,
  getProfilesByUids,
  subscribeToSharedNotes,
  upsertSharedNote,
  deleteSharedNote,
  getSharedNote
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
  inviteUserToNote: (noteId: string, targetUid: string, noteName: string) => Promise<void>;
  respondToNoteInvite: (notificationId: string, noteId: string, accept: boolean) => Promise<void>;
  factoryReset: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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
  const [projectTasks, setProjectTasksState] = useState<Task[]>([]);
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
      setProjectTasksState([]);
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
    const unsubNotes = subscribeToSharedNotes<Note>(user.uid, setNotesState);
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

  // Subscribe to project tasks whenever the user's projects change
  useEffect(() => {
    if (!user || projects.length === 0) {
      setProjectTasksState([]);
      return;
    }
    const projectIds = projects.map(p => p.id);
    const unsub = subscribeToProjectTasks<Task>(projectIds, setProjectTasksState);
    return () => unsub();
  }, [user, projects]);

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
      tasks: [...tasks, ...projectTasks.filter(t => t.assigneeId === user?.uid)],
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
        if (t.projectId) {
          setProjectTasksState(prev => replaceOrAppend(prev, t));
          firestoreWrite(() => upsertProjectTask(t));
        } else {
          setTasksState(prev => replaceOrAppend(prev, t));
          firestoreWrite(() => upsertUserDoc(user!.uid, 'tasks', t));
        }
      },
      toggleTask: (id: string) => {
        const pTask = projectTasks.find(t => t.id === id);
        if (pTask) {
          const updated = { ...pTask, status: (pTask.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED') as typeof pTask.status };
          setProjectTasksState(prev => replaceOrAppend(prev, updated));
          firestoreWrite(() => upsertProjectTask(updated));
          return;
        }
        
        const task = tasks.find(t => t.id === id);
        if (task) {
          const updated = { ...task, status: (task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED') as typeof task.status };
          setTasksState(prev => replaceOrAppend(prev, updated));
          firestoreWrite(() => upsertUserDoc(user!.uid, 'tasks', updated));
        }
      },
      removeTask: (id: string) => {
        if (projectTasks.some(t => t.id === id)) {
          setProjectTasksState(prev => prev.filter(t => t.id !== id));
          firestoreWrite(() => deleteProjectTask(id));
        } else {
          setTasksState(prev => prev.filter(t => t.id !== id));
          firestoreWrite(() => deleteUserDoc(user!.uid, 'tasks', id));
        }
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
        firestoreWrite(() => upsertSharedNote(n));
      },
      removeNote: (id: string) => {
        setNotesState(prev => prev.filter(n => n.id !== id));
        firestoreWrite(() => deleteSharedNote(id));
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
      inviteUserToNote: async (noteId: string, targetUid: string, noteName: string) => {
        if (!user) return;
        if (targetUid === user.uid) {
          toast('You cannot invite yourself', 'error');
          return;
        }
        try {
          const n = notes.find(n => n.id === noteId);
          if (n) {
            if (n.pendingInvites?.includes(targetUid) || n.collaborators?.includes(targetUid)) {
              toast('This user already has a pending invite or is already a collaborator', 'error');
              return;
            }
            const updatedNote = { 
              ...n, 
              pendingInvites: [...(n.pendingInvites ?? []), targetUid] 
            };
            await upsertSharedNote(updatedNote);
            setNotesState(prev => replaceOrAppend(prev, updatedNote));
          }
          await sendNotificationToUser(targetUid, {
            id: newId(),
            kind: 'note_invite',
            message: `You have been invited to collaborate on the note: ${noteName}`,
            meta: noteId,
            read: false,
            createdAt: new Date().toISOString()
          });
          toast('Invitation sent successfully');
        } catch (e) {
          console.error(e);
          toast('Failed to send note invitation', 'error');
        }
      },
      respondToNoteInvite: async (notificationId: string, noteId: string, accept: boolean) => {
        if (!user) return;
        try {
          if (accept) {
            const noteData = await getSharedNote(noteId);
            if (noteData) {
              const n = noteData as import('../types').Note;
              const alreadyMember = (n.collaborators ?? []).includes(user.uid);
              if (!alreadyMember) {
                const updatedNote = {
                  ...n,
                  collaborators: [...(n.collaborators ?? []), user.uid],
                  pendingInvites: (n.pendingInvites ?? []).filter((uid: string) => uid !== user.uid)
                };
                await upsertSharedNote(updatedNote);
                setNotesState(prev => replaceOrAppend(prev, updatedNote));
              }
            }
          } else {
            const noteData = await getSharedNote(noteId);
            if (noteData) {
              const updatedNote = {
                ...(noteData as import('../types').Note),
                pendingInvites: ((noteData as any).pendingInvites ?? []).filter((uid: string) => uid !== user.uid)
              };
              await upsertSharedNote(updatedNote);
            }
          }
          setNotificationsState(prev => prev.filter(n => n.id !== notificationId));
          await deleteUserDoc(user.uid, 'notifications', notificationId);
          toast(accept ? 'Joined note successfully!' : 'Invitation declined');
        } catch (e) {
          console.error(e);
          toast('Failed to respond to note invitation', 'error');
        }
      },
      factoryReset: async () => {
        if (!user) return;
        try {
          // In a real app with proper batching this would be done on the server,
          // but for this mock we just clear the local state and individual docs if needed.
          setSubjectsState([]);
          setTasksState([]);
          setProjectTasksState([]);
          setAssignmentsState([]);
          setLabsState([]);
          setProjectsState(projects.filter(p => p.ownerId !== user.uid));
          setNotesState([]);
          setTimetableState([]);
          setNotificationsState([]);
          setProfileState(emptyProfile);
          setOnboarded(false);
          await updateUserProfile(user.uid, { ...emptyProfile, onboardedCompleted: false });
          toast('Workspace has been reset to factory defaults', 'success');
        } catch (e) {
          console.error(e);
          toast('Failed to reset workspace', 'error');
        }
      },
      deleteAccount: async () => {
        if (!user) return;
        try {
          toast('Account deletion request initiated...', 'info');
          // Wait briefly so the user sees the toast before potentially redirecting
          await new Promise(r => setTimeout(r, 1000));
          // For security reasons, re-authentication is often required before delete().
          // Calling delete() here will work if the user recently signed in.
          await user.delete();
          // The auth listener will pick this up and clear the user.
        } catch (e: any) {
          console.error(e);
          if (e.code === 'auth/requires-recent-login') {
            toast('Please log out and log back in before deleting your account.', 'error');
          } else {
            toast('Failed to delete account', 'error');
          }
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
    projectTasks,
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
  const context = useContext(StudyForgeContext);
  if (!context) {
    throw new Error('useStudyForge must be used within a StudyForgeProvider');
  }
  return context;
}

// Special hook just for ProjectDetail to get ALL tasks for a specific project
export function useProjectTasks(projectId: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user || !projectId) return;
    return subscribeToProjectTasks<Task>([projectId], setTasks);
  }, [user, projectId]);

  return tasks;
}

const profilesCache: Record<string, { name: string; email?: string; [key: string]: any }> = {};

export function useUserProfiles(uids: string[]) {
  const [profiles, setProfiles] = useState<Record<string, any>>(profilesCache);

  useEffect(() => {
    const missingUids = uids.filter(uid => !profilesCache[uid]);
    if (missingUids.length === 0) return;

    let mounted = true;
    getProfilesByUids(missingUids).then(results => {
      if (!mounted) return;
      Object.assign(profilesCache, results);
      setProfiles({ ...profilesCache });
    }).catch(err => {
      console.error('Failed to fetch user profiles:', err);
    });

    return () => { mounted = false; };
  }, [JSON.stringify(uids)]);

  return profiles;
}