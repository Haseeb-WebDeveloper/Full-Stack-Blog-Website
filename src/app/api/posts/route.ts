import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { ERROR_MESSAGES } from "@/constants/constant";
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await connectDB();
        
        const posts = await Post.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ posts });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.FETCH_POSTS },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const cookie = await cookies();
        const adminId = cookie.get('adminId')?.value;

        if (!adminId) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED },
                { status: 401 }
            );
        }

        const body = await req.json();
        await connectDB();

        const post = await Post.create({
            ...body,
            author: adminId,
        });

        await post.populate('author', 'name');

        return NextResponse.json({ post }, { status: 201 });

    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.CREATE_POST },
            { status: 500 }
        );
    }
}
