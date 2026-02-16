import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Simple type for Event and Attendee to help readability
type Attendee = { id: string; username: string };

type EventData = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  created_by: string; // firebase uid
  attendees?: Attendee[];
  createdAt?: any;
};

const EVENTS_COLLECTION = 'events';

/**
 * Create a new event document in Firestore.
 * eventData should follow the EventData shape.
 */
export async function createEvent(eventData: EventData) {
  const colRef = collection(db, EVENTS_COLLECTION);
  const toSave = {
    ...eventData,
    attendees: eventData.attendees || [],
    createdAt: serverTimestamp(),
  };
  // addDoc creates a document with an auto-generated ID
  const ref = await addDoc(colRef, toSave);
  return ref.id; // return the Firestore doc id
}

/**
 * Real-time subscription to the events collection.
 * callback receives an array of { id, ...data } objects.
 * Returns an unsubscribe function.
 */
export function subscribeEvents(callback: (events: any[]) => void) {
  const colRef = collection(db, EVENTS_COLLECTION);
  const unsub = onSnapshot(colRef, (snapshot) => {
    const events = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    callback(events);
  });
  return unsub;
}

/**
 * Get a single event document by Firestore document id (docId).
 */
export async function getEventById(docId: string) {
  const ref = doc(db, EVENTS_COLLECTION, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) };
}

/**
 * Update an event document. Only owner (created_by) may update.
 * Throws if not authorized.
 */
export async function updateEvent(docId: string, patch: Partial<EventData>, currentUser: { uid: string }) {
  const ref = doc(db, EVENTS_COLLECTION, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Event not found');
  const data = snap.data() as any;
  if (data.created_by !== currentUser.uid) {
    throw new Error('Not authorized');
  }
  await updateDoc(ref, patch as any);
}

/**
 * Delete an event document. Only owner may delete.
 */
export async function deleteEvent(docId: string, currentUser: { uid: string }) {
  const ref = doc(db, EVENTS_COLLECTION, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Event not found');
  const data = snap.data() as any;
  if (data.created_by !== currentUser.uid) {
    throw new Error('Not authorized');
  }
  await deleteDoc(ref);
}

/**
 * Toggle RSVP for currentUser on event docId. Uses a transaction to avoid races.
 * currentUser should contain `uid` and `username`.
 */
export async function toggleRSVP(docId: string, currentUser: { uid: string; username: string }) {
  const ref = doc(db, EVENTS_COLLECTION, docId);
  await runTransaction(db, async (tx) => {
    const docSnap = await tx.get(ref);
    if (!docSnap.exists()) throw new Error('Event not found');
    const data = docSnap.data() as any;
    const attendees: Attendee[] = Array.isArray(data.attendees) ? data.attendees : [];
    const exists = attendees.some((a) => a.id === currentUser.uid);
    let updated: Attendee[];
    if (exists) {
      updated = attendees.filter((a) => a.id !== currentUser.uid);
    } else {
      updated = [...attendees, { id: currentUser.uid, username: currentUser.username }];
    }
    tx.update(ref, { attendees: updated });
  });
}

export default {
  createEvent,
  subscribeEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleRSVP,
};
