import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  getDoc,
  getDocs,
  where,
  or
} from 'firebase/firestore';
import { db } from './config';

export const collections = {
  subjects: 'subjects',
  tasks: 'tasks',
  assignments: 'assignments',
  labs: 'labs',
  projects: 'projects',
  notes: 'notes',
  timetable: 'timetable',
  notifications: 'notifications'
} as const;

export type CollectionName = keyof typeof collections;

/**
 * Upsert (Create or Update) a document in a user's subcollection
 */
export async function upsertUserDoc(uid: string, collectionName: CollectionName, data: { id: string; [key: string]: any }) {
  const docRef = doc(db, 'users', uid, collectionName, data.id);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Delete a document from a user's subcollection
 */
export async function deleteUserDoc(uid: string, collectionName: CollectionName, docId: string) {
  const docRef = doc(db, 'users', uid, collectionName, docId);
  await deleteDoc(docRef);
}

/**
 * Subscribe to a user's subcollection for real-time updates
 */
export function subscribeToUserCollection<T>(
  uid: string, 
  collectionName: CollectionName, 
  callback: (data: T[]) => void
) {
  const q = query(collection(db, 'users', uid, collectionName));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as T);
    callback(items);
  }, (error) => {
    console.error(`Error subscribing to ${collectionName}:`, error);
  });
}

/**
 * Update the user's main profile document
 */
export async function updateUserProfile(uid: string, data: any) {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Subscribe to the user's main profile document
 */
export function subscribeToUserProfile(uid: string, callback: (data: any) => void) {
  const docRef = doc(db, 'users', uid);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to user profile:`, error);
  });
}

/**
 * Fetch multiple user profiles by an array of UIDs
 */
export async function getProfilesByUids(uids: string[]) {
  if (uids.length === 0) return {};
  
  const results: Record<string, any> = {};
  
  // chunk uids in arrays of 30 because Firestore 'in' query limit is 30
  const chunks = [];
  for (let i = 0; i < uids.length; i += 30) {
    chunks.push(uids.slice(i, i + 30));
  }
  
  await Promise.all(chunks.map(async (chunk) => {
    const q = query(
      collection(db, 'users'),
      where('__name__', 'in', chunk)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      results[doc.id] = doc.data();
    });
  }));
  
  return results;
}

/**
 * Send a notification to a specific user's subcollection
 */
export async function sendNotificationToUser(targetUid: string, data: { id: string; [key: string]: any }) {
  const docRef = doc(db, 'users', targetUid, 'notifications', data.id);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Root-level Shared Projects
 */
export async function upsertSharedProject(data: { id: string; [key: string]: any }) {
  const docRef = doc(db, 'projects', data.id);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function deleteSharedProject(docId: string) {
  const docRef = doc(db, 'projects', docId);
  await deleteDoc(docRef);
}

export function subscribeToSharedProjects<T>(uid: string, callback: (data: T[]) => void) {
  const q = query(
    collection(db, 'projects'),
    or(
      where('ownerId', '==', uid),
      where('members', 'array-contains', uid)
    )
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as T);
    callback(items);
  }, (error) => {
    console.error(`Error subscribing to shared projects:`, error);
  });
}

/**
 * One-time fetch of a shared project document by ID
 * Used when accepting an invite before the project is in local state
 */
export async function getSharedProject(projectId: string) {
  const docRef = doc(db, 'projects', projectId);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

/**
 * Root-level Project Tasks
 */
export async function upsertProjectTask(data: { id: string; [key: string]: any }) {
  const docRef = doc(db, 'projectTasks', data.id);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function deleteProjectTask(docId: string) {
  const docRef = doc(db, 'projectTasks', docId);
  await deleteDoc(docRef);
}

export function subscribeToProjectTasks<T>(projectIds: string[], callback: (data: T[]) => void) {
  if (projectIds.length === 0) {
    callback([]);
    return () => {};
  }
  
  // Firestore `in` query is limited to 30 values, but typical use cases won't exceed this.
  // Chunking would be needed for > 30 projects.
  const q = query(
    collection(db, 'projectTasks'),
    where('projectId', 'in', projectIds.slice(0, 30))
  );
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as T);
    callback(items);
  }, (error) => {
    console.error(`Error subscribing to project tasks:`, error);
  });
}

/**
 * Root-level Shared Notes
 */
export async function upsertSharedNote(data: { id: string; [key: string]: any }) {
  const docRef = doc(db, 'notes', data.id);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function deleteSharedNote(docId: string) {
  const docRef = doc(db, 'notes', docId);
  await deleteDoc(docRef);
}

export function subscribeToSharedNotes<T>(uid: string, callback: (data: T[]) => void) {
  const q = query(
    collection(db, 'notes'),
    or(
      where('ownerId', '==', uid),
      where('collaborators', 'array-contains', uid)
    )
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as T);
    callback(items);
  }, (error) => {
    console.error(`Error subscribing to shared notes:`, error);
  });
}

export async function getSharedNote(noteId: string) {
  const docRef = doc(db, 'notes', noteId);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}
