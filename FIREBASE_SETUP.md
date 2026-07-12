# Firebase Setup Guide for ASDB

You need to do this **once** to turn on accounts, logins, and the "Claim Your Profile" system. Should take about **10 minutes**. No coding required — you're just clicking through Google's dashboard.

If anything is unclear, just message me and I'll walk you through it.

---

## Step 1 — Create the Firebase project (2 min)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with any Google account you own (recommend a business one, not personal)
3. Click **"Create a project"**
4. **Project name**: `action-sports-database` (or whatever you prefer)
5. **Google Analytics**: Turn OFF (we don't need it for now — you can add later)
6. Click **Create project** → wait ~30 seconds → click **Continue**

---

## Step 2 — Add a Web App (1 min)

1. On the project overview page, look for the icons under "Get started by adding Firebase to your app"
2. Click the **`</>`** icon (means "web app")
3. **App nickname**: `ASDB Web`
4. Do NOT check "Also set up Firebase Hosting" — we're using GitHub Pages
5. Click **Register app**
6. **YOU WILL SEE A CODE BLOCK.** It looks like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyABC123...",
     authDomain: "action-sports-database.firebaseapp.com",
     projectId: "action-sports-database",
     storageBucket: "action-sports-database.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```

7. **Copy the values inside those quotes** — you'll paste them into `firebase-config.js` in Step 6.
8. Click **Continue to console**

---

## Step 3 — Turn on Authentication (2 min)

1. In the left sidebar, click **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable these providers:
   - **Email/Password** → toggle Enable → Save
   - **Google** → toggle Enable → Fill in project support email (your email) → Save
   - **Email link (passwordless sign-in)** → toggle Enable → Save

---

## Step 4 — Turn on Firestore Database (1 min)

1. In the left sidebar, click **Build → Firestore Database**
2. Click **Create database**
3. **Location**: `nam5 (United States)` (default is fine)
4. **Start in production mode** (not test mode)
5. Click **Enable** — wait ~30 seconds

---

## Step 5 — Turn on Storage (for ID uploads) (1 min)

1. In the left sidebar, click **Build → Storage**
2. Click **Get started**
3. **Start in production mode**
4. Location: same as Firestore (nam5)
5. Click **Done**

---

## Step 6 — Paste your config into the site (1 min)

1. Open the file `firebase-config.js` in the ASDB repo
2. Replace each `"REPLACE_ME_..."` value with the matching value from the code block you copied in Step 2
3. Add your email + Jaime's email to `ASDB_ADMIN_EMAILS`
4. Change `ASDB_AUTH_ENABLED` from `false` to `true`
5. Save the file, commit, push to GitHub

Example of the finished file:

```js
window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSyABC123XyzExample",
  authDomain:        "action-sports-database.firebaseapp.com",
  projectId:         "action-sports-database",
  storageBucket:     "action-sports-database.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234567890:web:abc123",
};

window.ASDB_ADMIN_EMAILS = [
  "adam@seed2source.com",
  "jaime@example.com",
];

window.ASDB_AUTH_ENABLED = true;
```

---

## Step 7 — Authorize your domain (1 min)

Firebase blocks all domains by default for security. You need to authorize the sites where auth will work:

1. Back in Firebase Console → **Authentication → Settings** tab
2. Click **Authorized domains**
3. Add these one at a time:
   - `actionsportsdatabase.github.io`
   - `actionsportsdatabase.com` (your custom domain, once live)
   - `localhost` (already there by default)

---

## Step 8 — Paste the security rules (2 min)

These rules control who can read/write what. **Copy each block below into the matching place in Firebase Console.**

### Firestore rules

Firebase Console → **Firestore Database → Rules** tab → replace everything with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can read approved claims (used to show "verified" badges)
    match /claims/{claimId} {
      allow read: if resource.data.status == 'approved';
      // Signed-in users can create their own claim
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.status == 'pending';
      // Only admins can approve/deny/edit
      allow update, delete: if request.auth != null
                            && request.auth.token.email in [
                              'adam@seed2source.com',
                              'jaime@example.com'
                            ];
    }

    // Users can read/write only their own user doc
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

⚠️ **Replace the two admin emails above with your real emails.** (Same ones you added to `ASDB_ADMIN_EMAILS`.)

Click **Publish**.

### Storage rules

Firebase Console → **Storage → Rules** tab → replace everything with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Verification docs: only the uploader can read their own; admins can read all
    match /claims/{userId}/{filename} {
      allow read: if request.auth != null
                  && (request.auth.uid == userId
                      || request.auth.token.email in [
                        'adam@seed2source.com',
                        'jaime@example.com'
                      ]);
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024  // 10 MB max
                   && request.resource.contentType.matches('image/.*|application/pdf');
    }
  }
}
```

⚠️ Same email replacement here. Click **Publish**.

---

## Step 9 — You're live (30 seconds)

1. Refresh actionsportsdatabase.github.io with Cmd+Shift+R
2. You should now see **Sign in** in the top-right header
3. Click Sign in → create your first account (use one of the admin emails)
4. Once logged in, click the "Claim this profile" button on any profile — the modal should open

**Testing your admin access:** Once logged in, visit `actionsportsdatabase.github.io/#admin`. You should see the pending claims queue. If you don't, double-check that your email is in `ASDB_ADMIN_EMAILS` AND in both sets of security rules.

---

## What happens next

- When someone claims a profile, they upload proof (driver's license, sponsor contract, verified social handle)
- You + Jaime see the claim in the admin queue
- One click approves it → the profile gets a ✓ Verified Owner badge and the claimed-owner perks unlock
- One click denies it → the claim disappears

---

## Common problems

**"Sign in" button doesn't show up** → `ASDB_AUTH_ENABLED` is still `false`, or the config values are still `REPLACE_ME_...`

**Google sign-in popup blocked** → normal browser behavior, tell the user to allow popups from actionsportsdatabase.github.io

**"Missing or insufficient permissions" error** → check that your Firestore + Storage rules were published, and your email matches exactly

**Locked out of admin** → the email must match EXACTLY (case-sensitive) in both `ASDB_ADMIN_EMAILS` in firebase-config.js AND in the security rules

---

Any issues, just ping me. Once you drop your config values into `firebase-config.js` and push to GitHub, it all works.
