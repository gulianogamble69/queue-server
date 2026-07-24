# Queue Server

Queue Server is a Flutter Android app for managing digital queues at banks, clinics, restaurants, government offices, and service centers. It includes Firebase Authentication, Cloud Firestore live updates, Firebase Cloud Messaging, QR ticket generation, role-based dashboards, queue history, and a dark mode.

## Included features

- Email/password registration and login
- Customer and admin roles
- Admin queue creation and queue control
- Customer queue discovery and joining
- Live ticket position and estimated waiting time
- QR ticket generation
- Push notification token registration
- Foreground notifications and an included Cloud Function for "almost your turn" notifications
- Queue history
- Material 3 blue-and-white theme with dark mode
- Firestore security rules and indexes

## Firebase setup

1. Install Flutter and the Firebase CLI.
2. Create a Firebase project at <https://console.firebase.google.com>.
3. Enable **Authentication > Sign-in method > Email/Password**.
4. Create a Cloud Firestore database.
5. Enable Cloud Messaging.
6. From this directory, install FlutterFire CLI and configure the app:

   ```bash
   dart pub global activate flutterfire_cli
   flutterfire configure
   ```

   Choose your Firebase project and Android package `com.queueserver.app`. This replaces the placeholder `lib/firebase_options.dart` and adds `android/app/google-services.json` with real project values.

7. Deploy the Firestore rules and indexes:

   ```bash
   firebase login
   firebase use YOUR_FIREBASE_PROJECT_ID
   firebase deploy --only firestore
   ```

8. Deploy the optional notification function:

   ```bash
   cd functions
   npm install
   npm run build
   firebase deploy --only functions
   ```

9. Install dependencies and run on an Android device/emulator:

   ```bash
   cd ..
   flutter pub get
   flutter run
   ```

## Admin accounts

The registration screen includes an admin role for demos and prototypes. For production, remove the admin choice from registration and grant admin access through a trusted backend or Firebase custom claims. The Firestore rules are intentionally readable and commented so that policy can be tightened for a real deployment.

## Firestore collections

- `users/{uid}` — profile, display name, role, FCM tokens
- `queues/{queueId}` — queue metadata and counters
- `tickets/{ticketId}` — ticket number, status, user, and timestamps

Ticket IDs use `{queueId}_{ticketNumber}` so the admin dashboard can advance a queue without a race-prone client-side query.