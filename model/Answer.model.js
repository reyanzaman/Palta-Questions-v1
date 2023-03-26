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
        required: [false],
        unique: false
    },
    question: {
        type: String,
        required: [true],
        unique: false
    },
    paltaQuestion: {
        type: String,
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
        required: [true],
        unique: false
    },
    isAnonymous: {
        type: String,
        required: [false],
        unique: false
    }
});

export default mongoose.model.Answers || mongoose.model('Answer', AnswerSchema);