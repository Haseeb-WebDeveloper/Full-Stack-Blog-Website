import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        // Get the current post to find its tags
        const currentPost = await Post.findById(params.id);
        if (!currentPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Find posts with similar tags, excluding the current post
        const relatedPosts = await Post.find({
            _id: { $ne: params.id },
            tags: { $in: currentPost.tags },
            isPublished: true
        })
            .select('title thumbnail tags createdAt')
            .limit(5)
            .sort('-createdAt')
            .lean();

        return NextResponse.json({ posts: relatedPosts }, { status: 200 });

    } catch (error) {
        console.error("Error fetching related posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch related posts" },
            { status: 500 }
        );
    }
} 