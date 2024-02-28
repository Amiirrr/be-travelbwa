import Category from '../models/category.js'

const viewDashboard = (req, res) => {
    res.render('admin/dashboard/view_dashboard');
}
const viewCategory = async (req, res) => {
    const category = await Category.find();
    // console.log(category)
    res.render('admin/category/view_category', { category });
}
const AddCategory = async (req, res) => {
    const body = req.body

    try {
        const payload = {
            name: body.name
        }
        console.log(payload)
        await Category.create(payload);
        res.redirect('/admin/category')

    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 404,
            message: 'failed',
            info: 'Server failed'
        })
    }
}
const UpdateCategory = async (req, res) => {
    const { id, name } = req.body;
    // const category = await Category.findOne({ _id: id })
    // category.name = name;
    // await category.save();
    // console.log(category)  

    try {
        const payload = {
            name: name
        }
        await Category.updateOne({ _id: id }, payload)
        res.redirect('/admin/category')

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
};

const DeleteCategory = async (req, res) => {

    try {
        const { id } = req.params;
        const category = await Category.deleteOne({ _id: id });
        res.redirect('/admin/category')

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
}


const viewItem = (req, res) => {
    res.render('admin/item/view_item');
}
const viewBank = (req, res) => {
    res.render('admin/bank/view_bank');
}
const viewBooking = (req, res) => {
    res.render('admin/booking/view_booking');
}

const adminController = {
    viewDashboard,
    viewCategory,
    AddCategory,
    UpdateCategory,
    DeleteCategory,
    viewItem,
    viewBank,
    viewBooking
}

export default adminController;
