/**
 * auth.js — Official Google Sign-In via GAPI
 */

let auth2;

async function initGoogleAuth() {
  try {
    const configRes = await fetch('/api/config/firebase');
    const config = await configRes.json();
    const clientId = config.googleClientId;

    if (!clientId || clientId.includes('your_')) {
      console.warn('ElectionIQ: GOOGLE_CLIENT_ID missing in .env. Official Login will not work.');
      showSetupGuide();
      return;
    }

    gapi.load('auth2', () => {
      auth2 = gapi.auth2.init({
        client_id: clientId,
        scope: 'profile email'
      });

      // Handle sign-in state changes
      auth2.isSignedIn.listen(signinChanged);
      auth2.currentUser.listen(userChanged);

      // Render the official button
      gapi.signin2.render('g-signin-btn', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn,
        'onfailure': onSignInFailure
      });
    });
  } catch (e) {
    console.error('Google Auth Initialization Failed:', e);
  }
}

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const idToken = googleUser.getAuthResponse().id_token;
  sessionStorage.setItem('googleIdToken', idToken);
  showSignedIn(profile.getName(), profile.getImageUrl());
}

function onSignInFailure(error) {
  console.error('Google Sign-In Error:', error);
  if (error.error === 'idpiframe_initialization_failed' || error.error === 'invalid_client') {
    showSetupGuide();
  }
}

function showSetupGuide() {
  const signInWrapper = document.getElementById('g-signin-btn');
  if (signInWrapper) {
    signInWrapper.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 99px; backdrop-filter: blur(8px);">
        <span style="font-size: 12px; color: #cbd5e1; font-weight: 500; white-space: nowrap;">Login Config Needed</span>
        <button onclick="window.open('https://console.cloud.google.com/apis/credentials', '_blank')" 
                style="background: #2563eb; color: #fff; border: none; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.2s; white-space: nowrap;">
          SETUP
        </button>
      </div>
    `;
  }
}

function signinChanged(val) {
  if (!val) showSignedOut();
}

function userChanged(user) {
  if (user && user.isSignedIn()) {
    onSignIn(user);
  }
}

window.signOut = function() {
  if (auth2) {
    auth2.signOut().then(() => {
      sessionStorage.removeItem('googleIdToken');
      showSignedOut();
    });
  }
};

function showSignedIn(name, photo) {
  const signInWrapper = document.getElementById('g-signin-btn');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userDisplay = document.getElementById('user-display');
  
  const firstName = name.split(' ')[0];
  const avatarHtml = photo 
    ? `<img src="${photo}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">`
    : `<div style="width:32px;height:32px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${name[0]}</div>`;

  if (signInWrapper) signInWrapper.style.display = 'none';
  if (signOutBtn) signOutBtn.style.display = 'inline-flex';
  if (userDisplay) {
    userDisplay.style.display = 'flex';
    userDisplay.innerHTML = `<div class="user-chip">${avatarHtml}<span class="user-name-text">${firstName}</span></div>`;
  }
}

function showSignedOut() {
  const signInWrapper = document.getElementById('g-signin-btn');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userDisplay = document.getElementById('user-display');

  if (signInWrapper) signInWrapper.style.display = 'block';
  if (signOutBtn) signOutBtn.style.display = 'none';
  if (userDisplay) userDisplay.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.signOut();
    });
  }

  // Load GAPI and initialize
  if (typeof gapi !== 'undefined') {
    initGoogleAuth();
  } else {
    window.addEventListener('load', initGoogleAuth);
  }
});
