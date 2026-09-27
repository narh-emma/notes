import User from "@/src/lib/models/user";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/src/lib/db";
import { getUserIdFromCookies } from "@/src/lib/auth";

export async function GET(_request: Request) {

    try {
         const userId = await getUserIdFromCookies()
           if (!userId) {
            return Response.json({ message: "Not authenticated" }, { status: 401 })
            }
         await connectToDatabase();

        const user = await User.findById(userId).select("-passwordHash");

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 401 });
        }

        return Response.json({ user:{
            _id: user._id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt
        } });        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        return Response.json({ message: "Invalid or expired token" }, { status: 401 })
        }
        console.error(error)
        return Response.json({ error: "An error occurred" }, { status: 500 })
        
    }

}