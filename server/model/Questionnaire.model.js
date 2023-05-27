import mongoose from "mongoose";

export const QuestionnaireSchema = new mongoose.Schema({
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
    section: {
        type: String,
        required: [true],
        unique: false
    },
    date: {
        type: String,
        required: [true],
        unique: false
    },
    semester: {
        type: String,
        required: [true],
        unique: false
    },
    likeProgramming: {
        type: String,
        required: [true],
        unique: false
    },
    scaredCourse: {
        type: String,
        required: [true],
        unique: false
    },
    whyScared: {
        type: String,
        required: [false],
        unique: false
    },
    confidence: {
        type: String,
        required: [false],
        unique: false
    },
    expectation: {
        type: String,
        required: [true],
        unique: false
    }
});

export default mongoose.model.Questionnaires || mongoose.model('Questionnaire', QuestionnaireSchema);