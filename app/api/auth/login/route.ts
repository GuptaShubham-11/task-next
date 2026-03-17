import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        const token = generateToken(user._id.toString());

        const response = NextResponse.json({
            message: "Login successful"
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}