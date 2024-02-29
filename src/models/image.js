import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    }
})

const Image = mongoose.model('Image', imageSchema)

export default Image;