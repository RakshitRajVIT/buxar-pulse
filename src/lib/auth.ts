import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

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

export const auth = getAuth(app);

// Admin email list - anyone with these emails can manage services
const ADMIN_EMAILS = new Set([
	'rakshitraj2323@gmail.com',
	'prastut08@gmail.com',
    'aryanarya5507@gmail.com',
	// Add more admin emails here as needed
]);

export function isAdminEmail(email: string | null): boolean {
	if (!email) return false;
	return ADMIN_EMAILS.has(email.toLowerCase());
}

export async function signInWithGoogle(): Promise<User | null> {
	if (!isFirebaseConfigured) {
		console.error('Firebase not configured');
		return null;
	}

	try {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: 'select_account' });
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error) {
		console.error('Google sign-in error:', error);
		throw error;
	}
}

export async function logout(): Promise<void> {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Sign-out error:', error);
		throw error;
	}
}

export function observeAuthState(callback: (user: User | null) => void) {
	if (!isFirebaseConfigured) {
		callback(null);
		return () => {};
	}

	const unsubscribe = onAuthStateChanged(auth, (user) => {
		callback(user);
	});

	return unsubscribe;
}
