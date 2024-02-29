import mongoose from "mongoose";

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
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
})

const Activity = mongoose.model('Activity', activitySchema)

export default Activity;