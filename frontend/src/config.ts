export default {
  api_BaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  api_timeout: 30000,
  auth: {
    tokenKey: 'vita_note_auth_token',
    refreshTokenKey: 'vita_note_refresh_token',
    userInfoKey: 'vita_note_user_info',
  },
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  llm: {
    enabled: true,
    model: 'gpt-4o',
  },
}
