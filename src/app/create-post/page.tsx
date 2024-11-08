"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { categories, ERROR_MESSAGES, IMAGE_CONFIG } from "@/constants/constant";
import type { Post } from "@/types";

interface FormData {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  isPublished: boolean;
}

interface FormErrors {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const { admin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    thumbnail: "",
    tags: [],
    isPublished: false,
  });

  // Protect route
  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type as typeof IMAGE_CONFIG.ALLOWED_TYPES[number])) {
      setFormErrors(prev => ({
        ...prev,
        thumbnail: 'Please upload a valid image file (JPG, PNG, or WebP)'
      }));
      return;
    }

    // Validate file size
    if (file.size > IMAGE_CONFIG.MAX_SIZE) {
      setFormErrors(prev => ({
        ...prev,
        thumbnail: `Image size should be less than ${IMAGE_CONFIG.MAX_SIZE / (1024 * 1024)}MB`
      }));
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setForm(prev => ({
        ...prev,
        thumbnail: imageUrl
      }));
    } catch (error) {
      setFormErrors(prev => ({
        ...prev,
        thumbnail: ERROR_MESSAGES.UPLOAD_IMAGE
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    // Validate form
    if (!form.title.trim()) {
      setFormErrors(prev => ({ ...prev, title: 'Title is required' }));
      setIsLoading(false);
      return;
    }

    if (!form.content.trim()) {
      setFormErrors(prev => ({ ...prev, content: 'Content is required' }));
      setIsLoading(false);
      return;
    }

    if (!form.thumbnail) {
      setFormErrors(prev => ({ ...prev, thumbnail: 'Thumbnail is required' }));
      setIsLoading(false);
      return;
    }

    if (form.tags.length === 0) {
      setFormErrors(prev => ({ ...prev, tags: 'At least one tag is required' }));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || ERROR_MESSAGES.CREATE_POST);
      }

      router.push(`/post/${data.post._id}`);
    } catch (error) {
      console.error(ERROR_MESSAGES.CREATE_POST, error);
      setFormErrors(prev => ({
        ...prev,
        title: ERROR_MESSAGES.CREATE_POST
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium leading-none">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter post title"
          />
          {formErrors.title && (
            <p className="text-sm text-destructive">{formErrors.title}</p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label htmlFor="thumbnail" className="text-sm font-medium leading-none">
            Thumbnail Image
          </label>
          <div className="flex items-center gap-4">
            <div>
              <input
                type="file"
                id="thumbnail"
                accept={IMAGE_CONFIG.ALLOWED_TYPES.join(',')}
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="thumbnail"
                className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </label>
            </div>
            {form.thumbnail && (
              <div className="relative w-40 h-40">
                <img
                  src={form.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, thumbnail: "" }))}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {formErrors.thumbnail && (
            <p className="text-sm text-destructive">{formErrors.thumbnail}</p>
          )}
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Tags (select at least one)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(tag => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  form.tags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/10 hover:bg-secondary/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {formErrors.tags && (
            <p className="text-sm text-destructive">{formErrors.tags}</p>
          )}
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-2 p-2">
          <Switch
            id="isPublished"
            checked={form.isPublished}
            onCheckedChange={(checked: boolean) => 
              setForm(prev => ({ ...prev, isPublished: checked }))
            }
          />
          <label htmlFor="isPublished" className="text-sm font-medium leading-none">
            Publish immediately
          </label>
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium leading-none">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={10}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Write your post content here..."
          />
          {formErrors.content && (
            <p className="text-sm text-destructive">{formErrors.content}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
}