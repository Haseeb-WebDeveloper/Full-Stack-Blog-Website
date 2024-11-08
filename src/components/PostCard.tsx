import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  _id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  featured?: boolean;
}

function PostCard({ 
  _id,
  image, 
  title, 
  description, 
  date, 
  author, 
  tags, 
  featured = false 
}: PostCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg ${
      featured ? 'md:col-span-2 lg:col-span-3' : ''
    }`}>
      {/* Image Container */}
      <div className={`relative overflow-hidden object-cover ${featured ? 'aspect-[2.4/1]' : 'aspect-video'}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1 ${
          featured ? 'text-2xl mb-3' : 'text-xl mb-2'
        }`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {author[0].toUpperCase()}
            </div>
            <span>{author}</span>
          </div>
          <time dateTime={date}>{date}</time>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-background/0 opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Read More Link */}
        <Link 
          href={`/post/${_id}`}
          className="absolute inset-0"
        >
          <span className="sr-only">Read more about {title}</span>
        </Link>
      </div>
    </div>
  );
}

export default PostCard;