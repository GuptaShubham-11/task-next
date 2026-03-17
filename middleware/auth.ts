import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export const getUserFromToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    const decoded = verifyToken(token);

    return decoded;
};