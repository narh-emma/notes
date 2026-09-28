import connectToDatabase from "@/src/lib/db";
import Note from "@/src/lib/models/note";
import { error } from "console";
import { getUserIdFromCookies } from "@/src/lib/auth";
import { updateNoteSchema } from "@/src/lib/validators/note";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {

    try {
            const userId = await getUserIdFromCookies()
            if(!userId){
                return(Response.json({error: "Not authenticated"},{status: 401}))
            }

        await connectToDatabase()
        const id = (await params).id

        const note = await Note.findOne({_id : id, userId})

        if(!note){
            return Response.json({error:"Note not found"}, {status: 404})
        }

        return Response.json(note, {status: 200})        
    } catch (error) {
        console.log(error)
        return Response.json({error: "An error has occured"}, {status: 500})
    }

}

export async function PUT(request: Request,
	{ params }: { params: Promise<{ id: string }> },) {
    
    try {
        const userId = await getUserIdFromCookies()
            if(!userId){
                return(Response.json({error : "Not authenticated"},{status: 401}))
            }
        
        await connectToDatabase()
        const id = (await params).id
        const body = await request.json()
       

        const result = updateNoteSchema.safeParse(body)
        if(!result.success){
            return(Response.json({error : "Invalid Input"}, {status: 400}))
        }
         const note  = result.data

        const modNote = await Note.findOneAndUpdate({_id: id,userId },note,{ new: true, runValidators: true })

        if (!modNote) {
            return Response.json({ error: "Note not found" }, { status: 404 })
        }

        return Response.json(modNote, { status: 200 })        
    } catch (error) {
        console.error(error)
        return Response.json({error: "An error has occured"}, {status: 500})       
    }    

}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
    try {
                const userId = await getUserIdFromCookies()
            if(!userId){
                return(Response.json({error : "Not authenticated"},{status: 401}))
            }
        
        await connectToDatabase()
        const id = (await params).id
        const note = await Note.findOneAndDelete({_id: id, userId})

        if (!note) {
            return Response.json({ error: "Note not found" }, { status: 404 })
        }

        return Response.json({ message : "Note deleted" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return Response.json({ error: "An error has occured" }, { status: 500 })
    }
}