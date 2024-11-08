export interface Admin {
  _id: string;
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  isPublished: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
}