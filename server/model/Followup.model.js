import mongoose from "mongoose";

export const FollowupSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true],
        unique: false
    },
    usernames: {
        type: [String],
        required: [true],
        unique: false
    },
    date: {
        type: [String],
        required: [true],
        unique: false
    },
    question: {
        type: String,
        required: [true],
        unique: false
    },
    qScore: {
        type: String,
        required: [true],
        unique: false
    },
    comments: {
        type: [String],
        required: [true],
        unique: false
    },
    cScore: {
        type: [Number],
        required: [false],
        unique: false
    },
    course: {
        type: String,
        required: [true],
        unique: false
    },
    topic: {
        type: String,
        required: [false],
        unique: false
    },
    isAnonymous: {
        type: [String],
        required: [true],
        unique: false
    },
    section: {
        type: Number,
        required: [false],
        unique: false
    },
    semester: {
        type: String,
        required: [false],
        unique: false
    },
    month: {
        type: String,
        required: [false],
        unique: false
    },
    year: {
        type: String,
        required: [false],
        unique: false
    },
});

export default mongoose.model.Followups || mongoose.model('Followup', FollowupSchema);