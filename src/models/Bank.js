import mongoose from "mongoose";

const BankSchema = mongoose.Schema({
    bankName: {
        type: String,
        required: true
    },
    nomorRekening: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        // required: true
    }
})

const Bank = mongoose.model('Bank', BankSchema)

export default Bank;