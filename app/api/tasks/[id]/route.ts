import { NextResponse } from "next/server";
import { Task } from "@/models/task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/middleware/auth";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const user: any = await getUserFromToken();

        const body = await req.json();

        const task = await Task.findOneAndUpdate(
            { _id: params.id, userId: user.userId },
            body,
            { new: true }
        );

        return NextResponse.json(task);
    } catch (error) {
        console.error("Update task error:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const user: any = await getUserFromToken();

        await Task.deleteOne({
            _id: params.id,
            userId: user.userId
        });

        return NextResponse.json({
            message: "Task deleted"
        });
    } catch (error) {
        console.error("Delete task error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}