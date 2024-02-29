import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    imagegURL: {
        type: String,
        required: true
    }
})

const Image = mongoose.model('Image', imageSchema)

export default Image;