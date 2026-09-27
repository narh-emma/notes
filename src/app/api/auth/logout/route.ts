

import { error } from "console"
import { cookies } from "next/headers"

export async function POST(_request: Request) {
    const cookieStore = await cookies()
    cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    })
    
    return( Response.json({error : "User successfully logged out"}, {status: 200}))
}


