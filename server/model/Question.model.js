import mongoose from "mongoose";

export const QuestionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true],
        unique: false
    },
    type: {
        type: String,
        required: [true],
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
    date: {
        type: String,
        required: [true],
        unique: false
    },
    question1: {
        type: String,
        required: [false],
        unique: false
    },
    question2: {
        type: String,
        required: [false],
        unique: false
    },
    question3: {
        type: String,
        required: [false],
        unique: false
    },
    thisclass: {
        type: String,
        required: [false],
        unique: false
    },
    nextclass: {
        type: String,
        required: [false],
        unique: false
    },
    isAnonymous: {
        type: String,
        required: [false],
        unique: false
    },
    section: {
        type: Number,
        required: [true],
        unique: false
    },
    semester: {
        type: String,
        required: [true],
        unique: false
    },
    year: {
        type: String,
        required: [true],
        unique: false
    },
});

export default mongoose.model.Questions || mongoose.model('Question', QuestionSchema);