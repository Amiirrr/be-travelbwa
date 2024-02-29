import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bookingStartDate: {
        type: Date,
        required: true
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
    proofPayment: {
        type: String,
        required: true
    },
    bankFrom: {
        type: String,
        required: true
    },
    accountHolder: {
        type: Boolean,
        required: true
    },
    itemID: [{
        _id: {
            type: ObjectId,
            ref: 'Item',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        night: {
            type: Number,
            required: true
        },
    }],
    memberId: [{
        type: ObjectId,
        ref: 'Member'
    }],
    bankId: [{
        type: ObjectId,
        ref: 'Bank'
    }],
    status: {
        type: String,
        required: true
    },
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking;