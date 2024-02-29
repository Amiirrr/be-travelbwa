import mongoose from "mongoose";

const featureSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
})

const Feature = mongoose.model('Feature', featureSchema)

export default Feature;