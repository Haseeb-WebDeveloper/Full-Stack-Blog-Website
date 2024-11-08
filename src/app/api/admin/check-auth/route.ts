import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/admin.model";
import { ERROR_MESSAGES } from "@/constants/constant";

export async function GET() {
    try {
        const cookie = await cookies();
        const adminId = cookie.get('adminId')?.value;

        if (!adminId) {
            return NextResponse.json({ admin: null }, { status: 401 });
        }

        await connectDB();
        const admin = await Admin.findById(adminId).select('-password');
        
        if (!admin) {
            return NextResponse.json({ admin: null }, { status: 401 });
        }

        return NextResponse.json({ admin }, { status: 200 });

    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_SERVER },
            { status: 500 }
        );
    }
} 