import { initializeApp } from 'firebase/app';
import { getApps } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
	firebaseConfig.apiKey &&
	firebaseConfig.projectId &&
	firebaseConfig.appId
);

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb: Database | null =
	isFirebaseConfigured && firebaseConfig.databaseURL ? getDatabase(app) : null;