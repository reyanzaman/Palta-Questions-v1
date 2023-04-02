import mongoose from "mongoose";

export const TypeSchema = new mongoose.Schema({
    knowledge: {
        type: Number,
        required: [false],
        unique: false
    },
    comprehensive: {
        type: Number,
        required: [false],
        unique: false
    },
    application: {
        type: Number,
        required: [false],
        unique: false
    },
    application: {
        type: Number,
        required: [false],
        unique: false
    },
    analytical: {
        type: Number,
        required: [false],
        unique: false
    },
    synthetic: {
        type: Number,
        required: [false],
        unique: false
    },
    evaluative: {
        type: Number,
        required: [false],
        unique: false
    }
});

export default mongoose.model.Types || mongoose.model('Type', TypeSchema);