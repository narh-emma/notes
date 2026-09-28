import { title } from "process";
import z from "zod";

const CreateNoteSchema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1)
})

const updateNoteSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional()
})

export {CreateNoteSchema, updateNoteSchema}