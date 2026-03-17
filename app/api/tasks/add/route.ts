import { NextResponse } from "next/server";
import { Task } from "@/models/task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/middleware/auth";
import { encrypt } from "@/lib/encrypt";

export async function POST(req: Request) {
    try {
        await connectDB();

        const user: any = await getUserFromToken();

        const body = await req.json();

        const encryptedDesc = encrypt(body.description);

        const task = await Task.create({
            title: body.title,
            description: encryptedDesc,
            status: body.status,
            userId: user.userId
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error("Add task error:", error);
        return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
    }
}