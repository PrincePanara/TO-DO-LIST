import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  getDoc,
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
