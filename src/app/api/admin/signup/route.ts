import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/admin.model";
import { validateAdminSignup } from "@/utils/validators";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validate input
        const { errors, isValid } = validateAdminSignup(body);
        if (!isValid) {
            return NextResponse.json(
                { error: "Validation failed", errors },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email: body.email });
        if (existingAdmin) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Create new admin
        const admin = await Admin.create({
            name: body.name,
            email: body.email,
            password: body.password,
        });

        //☝️ admin contains the hashed password, name and email in the form of an object like this: { _id: '666666666666666666666666', name: 'John Doe', email: 'john@example.com', password: 'hashedPassword' }

        // Create the response object which contains the message and the admin object without the password here: { message: "Admin created successfully", admin: { _id: '666666666666666666666666', name: 'John Doe', email: 'john@example.com' } } WHERE NEXTRESPONSE.JSON IS A FUNCTION THAT TAKES TWO ARGUMENTS: THE RESPONSE BODY AND THE STATUS CODE WHICH COME FROM NEXT SERVER
        const response = NextResponse.json(
            { 
                message: "Admin created successfully", 
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                }
            },
            { status: 201 }
        );

        return response;

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 