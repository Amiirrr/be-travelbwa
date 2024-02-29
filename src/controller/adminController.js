import Category from '../models/category.js'

const viewDashboard = (req, res) => {
    res.render('admin/dashboard/view_dashboard', {
        title: "Staycation | Dashboard"
    });
}
const viewCategory = async (req, res) => {
    try {
        const category = await Category.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/category/view_category', {
            category,
            alert,
            title: "Staycation | Category"
        });

    } catch (error) {
        res.redirect('/admin/category')
    }
    // console.log(category)
}
const AddCategory = async (req, res) => {
    const body = req.body;

    try {
        const payload = {
            name: body.name
        }
        console.log(payload)
        await Category.create(payload);
        req.flash('alertMessage', 'Success Add Category');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/category');
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/category');
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
        req.flash('alertMessage', 'Success Update Category');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/category')

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/category')
    }
};

const DeleteCategory = async (req, res) => {

    try {
        const { id } = req.params;
        const category = await Category.deleteOne({ _id: id });
        req.flash('alertMessage', 'Success Delete Category');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/category')
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/category')
    }
}


const viewItem = (req, res) => {
    res.render('admin/item/view_item', {
        title: "Staycation | Item"
    });
}
const viewBank = (req, res) => {
    res.render('admin/bank/view_bank', {
        title: "Staycation | Bank"
    });
}
const viewBooking = (req, res) => {
    res.render('admin/booking/view_booking', {
        title: "Staycation | Booking"
    });
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
