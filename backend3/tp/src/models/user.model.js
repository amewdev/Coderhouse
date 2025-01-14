import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
    },
    pets: {
        type: [String],
        required: true,
    }
});

export const UserModel = model("users", userSchema);