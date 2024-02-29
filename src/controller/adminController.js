import Category from '../models/category.js'
import Bank from '../models/Bank.js'
import fs from 'fs-extra'
import path from 'path'

// Dashboard
const viewDashboard = (req, res) => {
    res.render('admin/dashboard/view_dashboard', {
        title: "Staycation | Dashboard"
    });
}

// Category
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
    const { id } = req.params;

    try {
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

// Item
const viewItem = (req, res) => {
    res.render('admin/item/view_item', {
        title: "Staycation | Item"
    });
}

// Bank
const viewBank = async (req, res) => {
    try {
        const bank = await Bank.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/bank/view_bank', {
            bank,
            alert,
            title: "Staycation | Bank"
        });
    } catch (error) {
        res.redirect('/admin/bank')
    }
}
const AddBank = async (req, res) => {
    const body = req.body;

    try {
        const payload = {
            bankName: body.bankName,
            nomorRekening: body.nomorRekening,
            name: body.name,
            imageUrl: `images/${req.file.filename}`,
        }
        console.log(payload)
        await Bank.create(payload);
        req.flash('alertMessage', 'Success Add Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/bank');
    }
}
const UpdateBank = async (req, res) => {
    const body = req.body;
    const id = body.id;

    try {
        if (req.file == undefined) {
            const payload = {
                bankName: body.bankName,
                nomorRekening: body.nomorRekening,
                name: body.name
            }
            console.log(payload)
            await Bank.updateOne({ _id: id }, payload)
        } else {
            const bank = await Bank.findOne({ _id: id });
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            const payload = {
                bankName: body.bankName,
                nomorRekening: body.nomorRekening,
                name: body.name,
                imageUrl: `images/${req.file.filename}`
            }
            console.log(payload)
            await Bank.updateOne({ _id: id }, payload)
        }
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank')

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/bank')
    }
};

const DeleteBank = async (req, res) => {
    const { id } = req.params;

    try {
        const bank = await Bank.findOne({ _id: id });
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        await Bank.deleteOne({ _id: id });
        req.flash('alertMessage', 'Success Delete Category');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank')
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/bank')
    }
}

//Booking
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
    AddBank,
    UpdateBank,
    DeleteBank,

    viewBooking
}

export default adminController;
