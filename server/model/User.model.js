import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username already exists"],
    },
    password: {
        type: String,
        required: [true, "Please provide Password"],
        unique: false,
    },
    id: {
        type: Number,
        required: [true, "Please provide your IUB ID"],
        unique: [true, "ID already exists"],
    },
    email:{
        type: String,
        required: [true, "Please provide an unique Email"],
        unique: [true, "Email already exists"],
    },
    profile: {
        type: String,
        required: [true, "Please provide an image"]
    }
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);