import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";
import { connectDB } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        return NextResponse.json({
            message: "User registered.",
            userId: user._id
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ error: "Error registering user" }, { status: 500 });
    }
}