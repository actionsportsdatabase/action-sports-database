// ═══════════════════════════════════════════════════════════════════
// ASDB — Firebase Authentication Module
// ═══════════════════════════════════════════════════════════════════
// Loaded AFTER firebase-config.js and the Firebase CDN scripts.
// Exposes: window.ASDBAuth.*
// ═══════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  const CFG = window.FIREBASE_CONFIG || {};
  const ENABLED = window.ASDB_AUTH_ENABLED === true;
  const ADMIN_EMAILS = (window.ASDB_ADMIN_EMAILS || []).map(e => e.toLowerCase());

  // Placeholder detection — if the config still has REPLACE_ME_*, treat as disabled
  const CONFIGURED = ENABLED &&
    CFG.apiKey && !CFG.apiKey.startsWith('REPLACE_ME') &&
    CFG.projectId && !CFG.projectId.startsWith('REPLACE_ME');

  let app = null, auth = null, db = null, storage = null;
  let currentUser = null;
  const listeners = [];

  function onAuthStateChanged(fn) {
    listeners.push(fn);
    fn(currentUser);
  }

  function notifyAll() {
    listeners.forEach(fn => { try { fn(currentUser); } catch(e) {} });
    updateHeaderUI();
  }

  function isAdmin(user) {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase());
  }

  function isConfigured() { return CONFIGURED; }

  function init() {
    if (!CONFIGURED) {
      console.info('[ASDBAuth] Firebase not configured — auth features hidden. See FIREBASE_SETUP.md');
      updateHeaderUI();
      return;
    }
    if (typeof firebase === 'undefined') {
      console.error('[ASDBAuth] Firebase SDK not loaded');
      return;
    }
    try {
      app = firebase.initializeApp(CFG);
      auth = firebase.auth();
      db = firebase.firestore();
      storage = firebase.storage();

      auth.onAuthStateChanged(user => {
        currentUser = user;
        notifyAll();
      });
      console.info('[ASDBAuth] Firebase initialized');
    } catch (e) {
      console.error('[ASDBAuth] Init failed:', e);
    }
  }

  // ── AUTH ACTIONS ─────────────────────────────────────────────

  async function signUpWithEmail(email, password, displayName) {
    if (!auth) throw new Error('Auth not initialized');
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    if (displayName) await cred.user.updateProfile({ displayName });
    await db.collection('users').doc(cred.user.uid).set({
      email, displayName: displayName || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return cred.user;
  }

  async function signInWithEmail(email, password) {
    if (!auth) throw new Error('Auth not initialized');
    const cred = await auth.signInWithEmailAndPassword(email, password);
    return cred.user;
  }

  async function signInWithGoogle() {
    if (!auth) throw new Error('Auth not initialized');
    const provider = new firebase.auth.GoogleAuthProvider();
    const cred = await auth.signInWithPopup(provider);
    // Ensure user doc exists
    await db.collection('users').doc(cred.user.uid).set({
      email: cred.user.email,
      displayName: cred.user.displayName || null,
      photoURL: cred.user.photoURL || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return cred.user;
  }

  async function sendMagicLink(email) {
    if (!auth) throw new Error('Auth not initialized');
    const actionCodeSettings = {
      url: window.location.origin + window.location.pathname + '#login-callback',
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    window.localStorage.setItem('asdbEmailForSignIn', email);
    return true;
  }

  async function completeMagicLinkSignIn() {
    if (!auth) return null;
    if (!auth.isSignInWithEmailLink(window.location.href)) return null;
    let email = window.localStorage.getItem('asdbEmailForSignIn');
    if (!email) email = window.prompt('Please provide your email for confirmation');
    if (!email) return null;
    const cred = await auth.signInWithEmailLink(email, window.location.href);
    window.localStorage.removeItem('asdbEmailForSignIn');
    // Remove the link params from URL
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + '#home');
    }
    return cred.user;
  }

  async function signOut() {
    if (!auth) return;
    await auth.signOut();
    currentUser = null;
  }

  async function sendPasswordReset(email) {
    if (!auth) throw new Error('Auth not initialized');
    await auth.sendPasswordResetEmail(email);
  }

  // ── CLAIMS ────────────────────────────────────────────────────

  async function submitClaim(profileId, data, verificationFile) {
    if (!auth || !currentUser) throw new Error('Must be signed in to submit a claim');
    const claimId = currentUser.uid + '__' + profileId;

    let fileURL = null;
    if (verificationFile) {
      const filename = Date.now() + '_' + verificationFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const ref = storage.ref('claims/' + currentUser.uid + '/' + filename);
      const snap = await ref.put(verificationFile);
      fileURL = await snap.ref.getDownloadURL();
    }

    const doc = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userDisplayName: currentUser.displayName || null,
      profileId,
      profileName: (window.ASDB && window.ASDB.nodes[profileId] && window.ASDB.nodes[profileId].name) || profileId,
      status: 'pending',
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      verificationFileURL: fileURL,
      claimantInfo: data || {},
    };
    await db.collection('claims').doc(claimId).set(doc, { merge: false });
    return claimId;
  }

  async function getPendingClaims() {
    if (!db) return [];
    if (!isAdmin(currentUser)) throw new Error('Admin only');
    const snap = await db.collection('claims').where('status','==','pending').orderBy('submittedAt','desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function reviewClaim(claimId, action, adminNote) {
    if (!db || !isAdmin(currentUser)) throw new Error('Admin only');
    const status = action === 'approve' ? 'approved' : 'denied';
    await db.collection('claims').doc(claimId).update({
      status,
      reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
      reviewedBy: currentUser.email,
      adminNote: adminNote || null,
    });
  }

  async function getClaimForProfile(profileId) {
    if (!db) return null;
    const snap = await db.collection('claims')
      .where('profileId', '==', profileId)
      .where('status', '==', 'approved')
      .limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  }

  // ── HEADER UI ─────────────────────────────────────────────────

  function updateHeaderUI() {
    const slot = document.getElementById('asdb-auth-slot');
    if (!slot) return;

    if (!CONFIGURED) {
      // Auth disabled — hide the slot completely so the site works read-only
      slot.style.display = 'none';
      return;
    }
    slot.style.display = '';

    if (currentUser) {
      const initials = (currentUser.displayName || currentUser.email || '?').slice(0,1).toUpperCase();
      const adminBadge = isAdmin(currentUser) ? ' <span style="font-size:0.65rem;background:var(--accent);color:#fff;padding:0.1rem 0.4rem;border-radius:6px;margin-left:0.35rem;font-weight:600">ADMIN</span>' : '';
      slot.innerHTML = `
        <div class="auth-userchip" onclick="ASDBAuth.showUserMenu(event)">
          <div class="auth-avatar">${initials}</div>
          <span class="auth-name">${currentUser.displayName || currentUser.email}${adminBadge}</span>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <button class="auth-signin-btn" onclick="ASDBAuth.showAuthModal()">Sign in</button>
      `;
    }
  }

  function showUserMenu(evt) {
    if (evt) evt.stopPropagation();
    const existing = document.getElementById('asdb-user-menu');
    if (existing) { existing.remove(); return; }
    const menu = document.createElement('div');
    menu.id = 'asdb-user-menu';
    menu.className = 'auth-user-menu';
    menu.innerHTML = `
      <div class="auth-menu-header">
        <div class="auth-menu-name">${currentUser.displayName || 'ASDB Member'}</div>
        <div class="auth-menu-email">${currentUser.email}</div>
      </div>
      ${isAdmin(currentUser) ? '<a href="#admin" onclick="document.getElementById(\'asdb-user-menu\').remove();">Admin: Claims Queue</a>' : ''}
      <a href="#my-claims" onclick="document.getElementById('asdb-user-menu').remove();">My Claims</a>
      <a href="#" onclick="ASDBAuth.signOut();document.getElementById('asdb-user-menu').remove();return false;">Sign out</a>
    `;
    document.body.appendChild(menu);
    setTimeout(() => {
      document.addEventListener('click', function closer() {
        const m = document.getElementById('asdb-user-menu');
        if (m) m.remove();
        document.removeEventListener('click', closer);
      });
    }, 0);
  }

  // ── AUTH MODAL ────────────────────────────────────────────────

  function showAuthModal(mode) {
    mode = mode || 'signin';
    closeAuthModal();
    const overlay = document.createElement('div');
    overlay.id = 'asdb-auth-modal';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal-close" onclick="ASDBAuth.closeAuthModal()" aria-label="Close">×</button>
        <h2 class="auth-modal-title">${mode === 'signup' ? 'Create an ASDB Account' : 'Sign in to ASDB'}</h2>
        <p class="auth-modal-sub">${mode === 'signup' ? 'Free account. Used for profile claims and updates.' : 'Welcome back.'}</p>

        <button class="auth-google-btn" onclick="ASDBAuth._doGoogle()">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.2c-.4.4 6.6-4.9 6.6-14.9 0-1.3-.1-2.4-.4-3.5z"/></svg>
          Continue with Google
        </button>

        <div class="auth-divider"><span>or</span></div>

        <form onsubmit="return ASDBAuth._doEmail(event, '${mode}')">
          ${mode === 'signup' ? '<input type="text" id="auth-name" placeholder="Your name" class="auth-input" required>' : ''}
          <input type="email" id="auth-email" placeholder="Email" class="auth-input" required autocomplete="email">
          <input type="password" id="auth-password" placeholder="Password (min 8 characters)" class="auth-input" required minlength="8" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}">
          <button type="submit" class="auth-submit-btn">${mode === 'signup' ? 'Create Account' : 'Sign In'}</button>
        </form>

        <div class="auth-alt-actions">
          <a href="#" onclick="ASDBAuth._sendMagic();return false;">Email me a magic link instead</a>
          ${mode === 'signin' ? '<a href="#" onclick="ASDBAuth.showAuthModal(\'signup\');return false;">Need an account? Sign up</a>' : '<a href="#" onclick="ASDBAuth.showAuthModal(\'signin\');return false;">Already have one? Sign in</a>'}
          ${mode === 'signin' ? '<a href="#" onclick="ASDBAuth._resetPassword();return false;">Forgot password?</a>' : ''}
        </div>

        <div id="auth-error" class="auth-error" style="display:none"></div>

        <div class="auth-legal-fine">
          By signing up you agree to our <a href="#legal/terms" onclick="ASDBAuth.closeAuthModal();navigateLegal('terms');return false;">Terms</a> and <a href="#legal/privacy" onclick="ASDBAuth.closeAuthModal();navigateLegal('privacy');return false;">Privacy Policy</a>.
        </div>
      </div>
    `;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeAuthModal(); });
    document.body.appendChild(overlay);
  }

  function closeAuthModal() {
    const m = document.getElementById('asdb-auth-modal');
    if (m) m.remove();
  }

  function _showErr(msg) {
    const el = document.getElementById('auth-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  async function _doEmail(e, mode) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name') ? document.getElementById('auth-name').value.trim() : null;
    try {
      if (mode === 'signup') await signUpWithEmail(email, password, name);
      else await signInWithEmail(email, password);
      closeAuthModal();
    } catch (err) {
      _showErr(err.message.replace('Firebase:',''));
    }
    return false;
  }

  async function _doGoogle() {
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err) {
      _showErr(err.message.replace('Firebase:',''));
    }
  }

  async function _sendMagic() {
    const email = document.getElementById('auth-email').value.trim();
    if (!email) { _showErr('Enter your email first, then click the magic link'); return; }
    try {
      await sendMagicLink(email);
      _showErr('Magic link sent — check your email');
    } catch (err) {
      _showErr(err.message.replace('Firebase:',''));
    }
  }

  async function _resetPassword() {
    const email = document.getElementById('auth-email').value.trim();
    if (!email) { _showErr('Enter your email first, then click Forgot password'); return; }
    try {
      await sendPasswordReset(email);
      _showErr('Password reset email sent — check your inbox');
    } catch (err) {
      _showErr(err.message.replace('Firebase:',''));
    }
  }

  // ── PUBLIC API ────────────────────────────────────────────────

  window.ASDBAuth = {
    init,
    isConfigured,
    onAuthStateChanged,
    get currentUser() { return currentUser; },
    isAdmin: () => isAdmin(currentUser),
    signUpWithEmail, signInWithEmail, signInWithGoogle,
    sendMagicLink, completeMagicLinkSignIn,
    signOut, sendPasswordReset,
    submitClaim, getPendingClaims, reviewClaim, getClaimForProfile,
    showAuthModal, closeAuthModal, showUserMenu,
    _doEmail, _doGoogle, _sendMagic, _resetPassword,
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
