import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/admin.model";

export async function POST(req: Request) {
    try {
        const body = await req.json();        

        await connectDB();

        // Find the admin by email in the database here email: body.email means that the email is the one that the user typed in the login form
        const admin = await Admin.findOne({ email: body.email });
        
        if (!admin) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Compare the password that the user typed in the login form with the hashed password in the database
        const isValidPassword = await admin.comparePassword(body.password);
        
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create the response
        const response = NextResponse.json(
            { 
                message: "Login successful", 
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                }
            },
            { status: 200 }
        );

        // Set cookie in the response to store the adminId here adminId is the _id of the admin that the user is logged in as so that we can use it in the check-auth route to get the admin data
        response.cookies.set('adminId', admin._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 