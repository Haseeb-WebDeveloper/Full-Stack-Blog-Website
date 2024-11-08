// Add input validation functions
export const validatePost = (post: any) => {
  const errors: Record<string, string> = {};
  
  if (!post.title || post.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  
  if (!post.content || post.content.length < 10) {
    errors.content = 'Content must be at least 10 characters long';
  }

  if (!post.thumbnail) {
    errors.thumbnail = 'Thumbnail image is required';
  }

  if (!post.tags || post.tags.length === 0) {
    errors.tags = 'At least one tag is required';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateAdminSignup = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const errors: Record<string, string> = {};
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
