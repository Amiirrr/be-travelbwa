import mongoose from "mongoose";

const BankSchema = mongoose.Schema({
    BankName: {
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
    }
})

module.exports = mongoose.model('Bank', BankSchema)