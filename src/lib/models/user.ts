import { model, models, Schema } from "mongoose";
import { minify } from "next/dist/build/swc";

const userSchema = new Schema({
    email: {
        type: String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },

    passwordHash: {
        type: String,
        required : true,
        minLength: 8
    }
}, {
    timestamps: true
});

const User = models.User || model("User", userSchema);

export default User;