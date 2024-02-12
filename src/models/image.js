import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    imagegURL: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Image', imageSchema)