// Utility functions for authentication

/**
 * Check if user has valid authentication
 * @param {Object} userInfo - User info from Redux store
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = (userInfo) => {
  return userInfo && userInfo._id;
};

/**
 * Check if token is expired based on userInfo timestamp
 * Note: This is a client-side check. Server-side validation is still required.
 * @param {Object} userInfo - User info from Redux store
 * @returns {boolean} - Whether token appears to be expired
 */
export const isTokenExpired = (userInfo) => {
  if (!userInfo) {
    return true;
  }

  // If no loginTime is present (legacy userInfo), assume it's still valid
  // This handles existing users who logged in before we added loginTime tracking
  if (!userInfo.loginTime) {
    return false;
  }

  // JWT tokens expire in 2 days (as set in generateToken.js)
  const tokenExpiryTime = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
  const currentTime = Date.now();
  const loginTime = new Date(userInfo.loginTime).getTime();

  return (currentTime - loginTime) > tokenExpiryTime;
};

/**
 * Validate authentication with server
 * @returns {Promise<boolean>} - Whether authentication is valid
 */
export const validateAuthWithServer = async () => {
  try {
    const response = await fetch('http://localhost:8000/users/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
};

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * Check if JWT cookie exists
 * @returns {boolean} - Whether JWT cookie exists
 */
export const hasJWTCookie = () => {
  return getCookie('jwt') !== null;
};
