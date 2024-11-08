"use client";

import { useEffect, useState } from 'react';
import PostCard from '../PostCard';
import { categories } from '@/constants/constant';

interface Post {
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

function PostSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts');
        }

        // Filter only published posts
        const publishedPosts = data.posts.filter((post: Post) => post.isPublished);
        setPosts(publishedPosts);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);
  console.log(posts)


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 flex flex-col gap-6 md:gap-8">
      <div className='border-b border-border pb-2'>
        <div className='flex items-center flex-wrap gap-2'>
          {categories.map((category, index) => (
            <h4 key={index} className='inline-flex items-center rounded-md bg-foreground/10 px-3.5 py-1.5 text-sm font-medium'>{category}</h4>
          ))}
        </div>
      </div>
      {/* Grid of all Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard
            _id={post._id}
            key={post._id}
            image={post.thumbnail}
            title={post.title}
            description={post.content.substring(0, 100) + '...'}
            date={new Date(post.createdAt).toLocaleDateString()}
            author={post.author.name}
            tags={post.tags}
          />
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">Check back later for new content!</p>
        </div>
      )}
    </section>
  );
}

export default PostSection;