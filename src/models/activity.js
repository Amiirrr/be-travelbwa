import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const activitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean,
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

const Activity = mongoose.model('Activity', activitySchema)

export default Activity;