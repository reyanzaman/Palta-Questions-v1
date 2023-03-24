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
    Answer: {
        type: String,
        required: [false],
        unique: false
    },
    paltaQuestion: {
        type: String,
        required: [false],
        unique: false
    }
});

export default mongoose.model.Answers || mongoose.model('Answer', AnswerSchema);