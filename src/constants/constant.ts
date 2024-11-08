export const categories = ["Business", "Gaming", "Technology", "Health", "News"];

export const ERROR_MESSAGES = {
  FETCH_POSTS: 'Failed to fetch posts',
  CREATE_POST: 'Failed to create post',
  UPLOAD_IMAGE: 'Failed to upload image',
  LOGIN_FAILED: 'Failed to login',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_SERVER: 'Internal server error',
} as const;

export const VALIDATION_RULES = {
  POST: {
    TITLE_MIN_LENGTH: 3,
    CONTENT_MIN_LENGTH: 10,
  },
  ADMIN: {
    NAME_MIN_LENGTH: 2,
    PASSWORD_MIN_LENGTH: 6,
  },
} as const;

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;