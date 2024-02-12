import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean
    },
    description: {
        type: string,
        required: true
    },
    imageID: [{
        type: ObjectId,
        ref: 'Image'
    }],
    featureId: [{
        type: ObjectId,
        ref: 'Feature'
    }],
    activityId: [{
        type: ObjectId,
        ref: 'Activity'
    }]


})

module.exports = mongoose.model('Items', itemSchema)