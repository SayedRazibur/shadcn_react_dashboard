const ACCESS_TOKEN_KEY = 'accessToken';

const TokenService = {
  // Save access token temporarily
  setAccessToken(token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  // Get current access token
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Update access token after refresh
  updateAccessToken(newToken) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, newToken);
  },

  // Remove on logout or session end
  removeAccessToken() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

export default TokenService;
