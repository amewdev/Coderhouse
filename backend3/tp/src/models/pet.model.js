import { Schema, model } from "mongoose";

const petSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    adopted: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    }
});

export const PetModel = model("pets", petSchema);