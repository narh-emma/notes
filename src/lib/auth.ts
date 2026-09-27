import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromCookies() {

    try {
        const cookieStore = await cookies()
        const cookie = cookieStore.get("token")?.value
        const secret = process.env.JWT_SECRET;

        if (!cookie || !secret) {
            return undefined;
        }

        const userId = jwt.verify(cookie, secret) as { userId?: string };
        return userId.userId;        
    } catch{
        return undefined
    }

}