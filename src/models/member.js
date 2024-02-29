import mongoose from "mongoose";

const memberSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    }
})

const Member = mongoose.model('Member', memberSchema);
export default Member;
