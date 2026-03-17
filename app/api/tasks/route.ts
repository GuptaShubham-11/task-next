import { NextResponse } from "next/server";
import { Task } from "@/models/task";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/middleware/auth";

export async function GET(req: Request) {
    try {
        await connectDB();

        const user: any = await getUserFromToken();

        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status");

        const query: any = {
            userId: user.userId
        };

        if (status) query.status = status;

        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }

        const tasks = await Task.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Task.countDocuments(query);

        return NextResponse.json({
            tasks,
            total,
            page
        });
    } catch (error) {
        console.error("fetch tasks error:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}