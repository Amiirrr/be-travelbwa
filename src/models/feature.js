import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

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
    },
    itemId: {
        type: ObjectId,
        ref: 'item'
    }
})

const Feature = mongoose.model('Feature', featureSchema)

export default Feature;