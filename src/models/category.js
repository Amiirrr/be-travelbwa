import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    itemId: [{
        type: ObjectId,
        ref: 'item'
    }]
})

const Category = mongoose.model('Category', categorySchema);

export default Category;