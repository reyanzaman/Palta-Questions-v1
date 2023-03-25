import mongoose from "mongoose";

export const AnswerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true],
        unique: false
    },
    date: {
        type: String,
        required: [true],
        unique: false
    },
    answer: {
        type: String,
        required: [true, "You must write an answer"],
        unique: false
    },
    question: {
        type: String,
        required: [true],
        unique: false
    },
    paltaQuestion: {
        type: String,
        required: [true, "Writing another Question is mandatory!"],
        unique: false
    },
    course: {
        type: String,
        required: [true],
        unique: false
    },
    topic: {
        type: String,
        required: [true],
        unique: false
    }
});

export default mongoose.model.Answers || mongoose.model('Answer', AnswerSchema);