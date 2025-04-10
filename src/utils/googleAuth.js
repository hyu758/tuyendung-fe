/**
 * Utility functions for Google Authentication
 */

/**
 * Opens a popup window for Google authentication
 * @returns {Window} The popup window object
 */
export const openGoogleAuthPopup = () => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  // Redirect to our callback page after Google auth
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth-callback.html`);
  const googleAuthUrl = `http://localhost:8000/api/auth/google/login/?redirect_uri=${redirectUri}`;
  
  return window.open(
    googleAuthUrl,
    'Google Login',
    `width=${width},height=${height},left=${left},top=${top}`
  );
};

/**
 * Sets up an event listener for messages from the popup window
 * @param {Function} callback Function to call with auth data when received
 * @returns {Function} Function to remove the event listener
 */
export const listenForAuthMessage = (callback) => {
  const handleMessage = (event) => {
    // Verify the origin for security
    if (event.origin !== window.location.origin) return;
    
    const { access_token, refresh_token, role, email } = event.data;
    
    if (access_token && refresh_token) {
      callback({
        accessToken: access_token,
        refreshToken: refresh_token,
        role,
        email
      });
    }
  };
  
  window.addEventListener('message', handleMessage, false);
  
  // Return a function to remove the listener
  return () => {
    window.removeEventListener('message', handleMessage, false);
  };
};
