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
    similarCourse: {
        type: String,
        required: [false],
        unique: false
    },
    teachingMethod: {
        type: String,
        required: [false],
        unique: false
    },
    programmingExcite: {
        type: String,
        required: [true],
        unique: false
    },
    lookForward: {
        type: String,
        required: [false],
        unique: false
    },
    pursueContents: {
        type: String,
        required: [false],
        unique: false
    },
    justification: {
        type: String,
        required: [true],
        unique: false
    },
    contents: {
        type: String,
        required: [false],
        unique: false
    },
    whatElseLearn: {
        type: String,
        required: [false],
        unique: false
    },
    expectations: {
        type: String,
        required: [false],
        unique: false
    },
    whyChooseCourse: {
        type: String,
        required: [false],
        unique: false
    },
    questionsAskedSmall: {
        type: String,
        required: [false],
        unique: false
    },
    questionsAskedDaily: {
        type: String,
        required: [true],
        unique: false
    },
    recommend: {
        type: String,
        required: [false],
        unique: false
    },
});

export default mongoose.model.Questionnaires || mongoose.model('Questionnaire', QuestionnaireSchema);