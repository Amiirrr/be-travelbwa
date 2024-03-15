import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

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
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        default: "night"
    },
    sumBooking: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },
    imageId: [{
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

const Item = mongoose.model('Item', itemSchema)

export default Item;