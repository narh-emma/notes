import mongoose, { model, models, Schema } from "mongoose";

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 1
    },

    content: {
        type: String,
        required: true,
        minLength: 1
    },

    userId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, 
{
    timestamps: true
});

const Note = models.Note || model("Note", NoteSchema)

export default Note 