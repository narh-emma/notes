import { getUserIdFromCookies } from "@/src/lib/auth";
import connectToDatabase from "@/src/lib/db";
import Note from "@/src/lib/models/note";
import { CreateNoteSchema } from "@/src/lib/validators/note";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";


export async function GET(request:NextRequest) {

    try {

        const userId = await getUserIdFromCookies()
        if(!userId){
            return(Response.json({message: "Not authenticated"},{status: 401}))
        }
        await connectToDatabase()
        const query = new URL(request.url).searchParams.get("query")?.toLowerCase();

        if(!query){
            return Response.json( await Note.find({userId}), {status: 200})
        }
        
        const notes = await Note.find({
            userId,
        $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
        ],
        })

        return Response.json(notes, {status: 200})        
    } catch (error) {
        console.log(error)
        return Response.json({error: "Failed to fetch notes"}, {status:500})
        
    }

}

export async function  POST(request: Request) {
    try {
        const userId = await getUserIdFromCookies()
        if(!userId){
            return(Response.json({error : "Not authenticated"},{status: 401}))
        }

        const body = await request.json()

        await connectToDatabase()
        const result = CreateNoteSchema.safeParse(body)
        if(!result.success){
            return(Response.json({error: "Invalid Input"}, {status: 400}))
        }
        
        const {title, content} = result.data
        return Response.json(await Note.create({title, content, userId}), {status: 201})        
    } catch (error) {
        console.log(error)
        return Response.json({error: "An error occured"}, {status: 500})
        
    }
    
}
    
