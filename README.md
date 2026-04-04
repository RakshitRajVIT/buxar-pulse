# Buxar Pulse

This project is a Vite + React app for local services in Buxar.

This README explains how to set up Firebase so you can store services, photos, location data, ratings, and reviews in the cloud without changing the website UI every time you add a new service.

## Recommended Firebase Setup

Use these Firebase products:

- Firestore for service data
- Storage for service photos
- Authentication only if you want an admin login later

Firestore is the best fit here because your data is structured and queryable. Storage handles image uploads cleanly. You do not need Firebase Hosting unless you decide to host the app on Firebase later.

## Data Model

Store one service per Firestore document.

Suggested collection name:

- `services`

Suggested fields:

- `name` - service or place name
- `category` - example: `tourism`, `plumber`, `electrician`, `doctor`, `food`, `hotel`
- `address` - plain text address
- `lat` - latitude
- `lng` - longitude
- `googleMapsUrl` - Google Maps link
- `phone` - contact number
- `photoUrl` - public URL from Firebase Storage
- `rating` - number like `4.6`
- `reviewsCount` - total review count
- `isOpen` - `true` or `false`
- `description` - short summary
- `createdAt` - timestamp
- `updatedAt` - timestamp

If you want individual review text later, create a second collection called `reviews` instead of putting every review into the main service document.

## Step By Step Setup

### 1. Create a Firebase project

1. Go to the Firebase Console.
2. Click Create project.
3. Enter a project name, for example `buxar-pulse`.
4. Disable Google Analytics if you do not need it.
5. Finish project creation.

### 2. Register the web app

1. In the Firebase project dashboard, click the web app icon.
2. Register an app name, for example `buxar-pulse-web`.
3. Copy the Firebase config values.
4. Keep them for your local environment file.

### 3. Enable Firestore

1. Open Firestore Database in Firebase Console.
2. Click Create database.
3. Start in production mode if this will be public, or test mode only while prototyping.
4. Pick the nearest region to your users.
5. Create the database.

### 3A. If Firestore asks for billing (free alternatives)

If you see an error like "This API method requires billing to be enabled", use one of these options:

#### Option A (recommended free path): Firebase Realtime Database

This keeps you fully inside Firebase and usually works on Spark (free tier) without enabling billing.

1. Open Realtime Database in Firebase Console.
2. Click Create Database.
3. Select a region.
4. Start in locked mode.
5. Store all services under one top-level path such as `services`.

Suggested Realtime Database shape:

```json
{
	"services": {
		"service_1": {
			"name": "Brahmeshwar Nath Temple",
			"category": "tourism",
			"address": "Near Ganges, Buxar",
			"lat": 25.5645,
			"lng": 83.9777,
			"googleMapsUrl": "https://maps.google.com/?q=25.5645,83.9777",
			"phone": "+91 9876543210",
			"photoUrl": "https://firebasestorage.googleapis.com/...",
			"rating": 4.7,
			"reviewsCount": 312,
			"isOpen": true
		}
	}
}
```

You can keep using Firebase Storage for photos.

#### Option B (fully free, no cloud DB): Local JSON data file

If you want zero billing and zero backend setup, keep data in a local file and update it directly.

1. Create `src/data/services.json`.
2. Move your service records there.
3. Load it in the app and render as before.

This option is fastest but requires a deploy when data changes.

#### Which option to choose

- Choose Realtime Database if you want to add services from Firebase Console without UI code changes.
- Choose local JSON if you want completely free setup and can redeploy for each update.

### 3B. If Firebase Storage asks for plan upgrade

If you see "To use Storage, upgrade your project's pricing plan", do this to stay free:

1. Keep service data in Firebase Realtime Database.
2. Upload photos to a free external image host (for example Cloudinary free plan, ImageKit free plan, or GitHub raw image links).
3. Save the public image URL in your service record as `photoUrl`.
4. Render `photoUrl` directly in the UI.

This gives you no-billing content updates for data and images.

Example service record with external image URL:

```json
{
	"name": "Buxar Biryani House",
	"category": "food",
	"address": "Main Bazar, Buxar",
	"lat": 25.5665,
	"lng": 83.977,
	"googleMapsUrl": "https://maps.google.com/?q=25.5665,83.977",
	"phone": "+91 9876543221",
	"photoUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1/services/biryani.jpg",
	"rating": 4.5,
	"reviewsCount": 234,
	"isOpen": true
}
```

If you want all media inside Firebase Storage, you must switch to the Blaze plan and set budget alerts in Google Cloud.

### 4. Enable Storage

1. Open Storage in Firebase Console.
2. Click Get started.
3. Create the default bucket.
4. Use a folder like `service-photos/` for uploads.

### 5. Install Firebase in the app

Run:

```bash
npm install firebase
```

### 6. Add environment variables

Create or update your `.env` file with Firebase values:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Do not commit real secrets if you later add admin-only keys or service account files.

### 7. Create a Firebase client file

Add a small client wrapper such as `src/lib/firebase.ts` and initialize Firebase there.

Example:

```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 8. Seed your first services

Add one Firestore document per service with the fields above.

Example document:

```json
{
	"name": "Brahmeshwar Nath Temple",
	"category": "tourism",
	"address": "Near Ganges, Buxar",
	"lat": 25.5645,
	"lng": 83.9777,
	"googleMapsUrl": "https://maps.google.com/?q=25.5645,83.9777",
	"phone": "+91 9876543210",
	"photoUrl": "https://firebasestorage.googleapis.com/...",
	"rating": 4.7,
	"reviewsCount": 312,
	"isOpen": true,
	"description": "Popular pilgrimage and heritage site in Buxar"
}
```

### 9. Upload photos to Storage

1. Upload the image in Firebase Storage.
2. Copy the public download URL.
3. Paste that URL into the service document under `photoUrl`.

### 10. Set Firestore rules

For a public read-only website, allow everyone to read services but only allow writes from admins.

Example rules:

```js
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /services/{serviceId} {
			allow read: if true;
			allow write: if request.auth != null && request.auth.token.admin == true;
		}

		match /reviews/{reviewId} {
			allow read: if true;
			allow create: if request.auth != null;
			allow update, delete: if request.auth != null && request.auth.token.admin == true;
		}
	}
}
```

If you are only testing locally, you can relax rules temporarily, but do not leave test rules open in production.

### 11. Set Storage rules

Example rules for service photos:

```js
rules_version = '2';
service firebase.storage {
	match /b/{bucket}/o {
		match /service-photos/{allPaths=**} {
			allow read: if true;
			allow write: if request.auth != null && request.auth.token.admin == true;
		}
	}
}
```

## How To Add More Services Later

Once the app is connected to Firestore, adding a new service does not require any UI change or code commit.

Use this workflow:

1. Open Firebase Console.
2. Go to Firestore.
3. Open the `services` collection.
4. Click Add document.
5. Fill in the fields.
6. Upload the image to Storage and paste the download URL.
7. Refresh the website.

That is the main benefit of moving data out of the UI and into Firebase.

## Suggested Next App Change

After the Firebase setup is done, replace the current hardcoded services list with a Firestore fetch so the app reads live data from the `services` collection.

## Admin System

The app includes a Google-based admin system for managing services directly from the Profile page.

### Features

- Google sign-in for all users.
- Admin panel for authorized users only.
- Add services, edit data, and upload images without code changes.
- Changes appear live on the Services page after refresh.

### How to Set Admin Emails

Edit [src/lib/auth.ts](src/lib/auth.ts) and update the `ADMIN_EMAILS` set:

```typescript
const ADMIN_EMAILS = new Set([
  'your-email@gmail.com',
  'admin@buxar-pulse.com',
  // Add more admin emails here
]);
```

Any email in this set will unlock the admin panel after Google sign-in.

### Google Sign-In Setup (Already Configured)

Your Firebase project is already configured for Google sign-in:

1. Go to Firebase Console > Authentication > Sign-in method.
2. Ensure Google is enabled (usually automatic).
3. Users click "Sign in with Google" on the Profile page.

### Realtime Database Rules (REQUIRED for Admin Panel)

Without these rules, you will get "access denied" when trying to add services. Follow these steps:

1. Open Firebase Console.
2. Go to Realtime Database.
3. Click the "Rules" tab.
4. Replace all rules with this:

```json
{
  "rules": {
    "services": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

5. Click "Publish".
6. Wait 30 seconds for rules to apply.
7. Try adding a service again from the admin panel.

These rules allow:
- Anyone to read the services list (public).
- Only signed-in users to add/update services.
- No field validation - all fields are optional.

**Security note:** For production, consider using Cloud Functions to validate admin status instead of trusting the client. For now, this allows any signed-in user to add services.

### Admin Workflow

1. User signs in with Google.
2. If their email is in `ADMIN_EMAILS`, the admin panel appears.
3. Admin clicks "+ Add Service" to open the form.
4. Admin fills in any fields needed (all fields are optional).
5. Click "✓ Add Service" to save to Firebase.
6. Service appears on the Services page after a refresh.
7. Missing fields will show default values or be empty when rendering.

### Notes

- Keep the service schema consistent so filters and cards stay simple.
- Store images in Storage, not in Firestore.
- Keep review text in a separate collection if you plan to support real user reviews.
- Use one source of truth for the services list so you do not have to edit the UI for content changes.
