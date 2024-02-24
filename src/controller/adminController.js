import Category from '../models/category.js'

const viewDashboard = (req, res) => {
    res.render('admin/dashboard/view_dashboard');
}
const viewCategory = (req, res) => {
    res.render('admin/category/view_category');
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

        // res.status(201).json({
        //     status: 201,
        //     message: 'Success',
        //     info: 'Category added successfully'
        // });

    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 404,
            message: 'failed',
            info: 'Server failed'
        })
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
    viewItem,
    viewBank,
    viewBooking
}

export default adminController;
