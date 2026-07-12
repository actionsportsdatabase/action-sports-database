// ASDB Firebase Configuration
// ═══════════════════════════════════════════════════════════════════
//
// ⚠️  BEFORE THE SITE WILL WORK, YOU MUST REPLACE THE PLACEHOLDER
//     VALUES BELOW WITH YOUR OWN FIREBASE PROJECT CREDENTIALS.
//
//     Full step-by-step instructions live in FIREBASE_SETUP.md
//     (in the same folder as this file, or in your GitHub repo).
//
// ═══════════════════════════════════════════════════════════════════

window.FIREBASE_CONFIG = {
  apiKey:            "REPLACE_ME_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_ME.firebaseapp.com",
  projectId:         "REPLACE_ME",
  storageBucket:     "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId:             "REPLACE_ME",
};

// Admin allowlist — only these email addresses can access /admin
// Add your and Jaime's emails here BEFORE deploying
window.ASDB_ADMIN_EMAILS = [
  // "you@example.com",
  // "jaime@example.com",
];

// Feature flag — set to true once your Firebase project is configured
// Setting this to false hides all sign-up/login UI (safe default before setup)
window.ASDB_AUTH_ENABLED = false;
