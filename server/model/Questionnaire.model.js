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
    attitude: {
        type: String,
        required: [false],
        unique: false
    },
    confidence: {
        type: String,
        required: [false],
        unique: false
    },
    topic_motivation: {
        type: String,
        required: [false],
        unique: false
    },
    teaching_method: {
        type: String,
        required: [false],
        unique: false
    },
    learning_motivation: {
        type: String,
        required: [false],
        unique: false
    },
    justification: {
        type: String,
        required: [false],
        unique: false
    },
    whyChooseCourse: {
        type: String,
        required: [false],
        unique: false
    },
    questionsAskedYoung: {
        type: String,
        required: [false],
        unique: false
    },
    questionsAskDaily: {
        type: String,
        required: [false],
        unique: false
    },
    questionsHelpLearn: {
        type: String,
        required: [false],
        unique: false
    },
});

export default mongoose.model.Questionnaires || mongoose.model('Questionnaire', QuestionnaireSchema);