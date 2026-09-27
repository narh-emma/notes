import connectToDatabase from "@/src/lib/db"
import User from "@/src/lib/models/user"
import bcrypt from "bcryptjs"
import { error } from "console"


export async function POST(request: Request) {
    try {
    await connectToDatabase()
    const { email, password } = await request.json()

    if (!email || !password) {
        return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
        return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    
    const lookUpEmail = await User.findOne({ email })
    if(lookUpEmail){
        return( Response.json({error : "Email already exist"}, {status: 409}))
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash: hashedPassword })

    return Response.json({_id: user._id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt} ,{status: 201})        
    } catch (error) {
        console.log(error)

        return Response.json({error: "An error occured"}, {status: 500})

    }



}