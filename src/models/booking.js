import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

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
    invoice: {
        type: String,
        required: true
    },
    itemId: {
        _id: {
            type: ObjectId,
            ref: 'Item',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
    },
    total: {
        type: Number,
        required: true
    },
    memberId: {
        type: ObjectId,
        ref: 'Member'
    },
    bankId: {
        type: ObjectId,
        ref: 'Bank'
    },
    payments: {
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
        status: {
            type: String,
            required: true
        },
    },
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking;