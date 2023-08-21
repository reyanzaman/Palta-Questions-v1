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
    feature: {
        type: String,
        required: [false],
        unique: false
    },
    study_method: {
        type: String,
        required: [false],
        unique: false
    },
    course_motivation: {
        type: String,
        required: [false],
        unique: false
    },
    app_motivation: {
        type: String,
        required: [false],
        unique: false
    },
    further_courses: {
        type: String,
        required: [false],
        unique: false
    },
    questioning_learn: {
        type: String,
        required: [false],
        unique: false
    },
    recommend: {
        type: String,
        required: [false],
        unique: false
    }
});

export default mongoose.model.Questionnaires || mongoose.model('Questionnaire', QuestionnaireSchema);