import Category from '../models/category.js'
import Bank from '../models/Bank.js'
import Item from '../models/item.js'
import Image from '../models/image.js'
import fs from 'fs-extra'
import path from 'path'
import { create } from 'domain'

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
const viewItem = async (req, res) => {
    try {
        const item = await Item.find()
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name' });
        console.log(item)
        const category = await Category.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/item/view_item', {
            title: "Staycation | Item",
            category,
            alert,
            item,
            action: 'view'
        });
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
    }
}

const AddItem = async (req, res) => {
    const { categoryId, title, price, city, about, country } = req.body;

    try {
        if (req.files.length === 0) {
            throw new Error('No files uploaded');
        }

        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            throw new Error('Category not found');
        }

        const payload = {
            categoryId,
            title,
            country,
            description: about,
            price,
            city
        }
        //menambahkan item
        const item = await Item.create(payload);
        //Menghubungkan items ke category
        category.itemId.push({ _id: item._id });
        await category.save();

        //Menambahkan image ke collection image
        for (let i = 0; i < req.files.length; i++) {
            const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
            //Menghubungkan image dengan item
            item.imageId.push({ _id: imageSave._id });
            await item.save();
        }
        req.flash('alertMessage', 'Success Add Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
    }
}

const ShowImageItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' })
        console.log(item.imageId[0].imageUrl)
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/item/view_item', {
            title: "Staycation | Image Item",
            alert,
            item,
            action: 'show image'
        });

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
    }
}
const ShowEditItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findOne({ _id: id })
            .populate({ path: 'categoryId', select: 'id name' })
            .populate({ path: 'imageId', select: 'id imageUrl' });
        const category = await Category.find();
        console.log(item)
        // console.log(category)
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/item/view_item', {
            title: "Staycation | Edit Item",
            alert,
            category,
            item,
            action: 'edit'
        });

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
    }
}
const EditItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, title, price, city, about, country } = req.body;
        const payload = {
            categoryId,
            title,
            country,
            description: about,
            price,
            city
        };

        const item = await Item.findOne({ _id: id }).populate({ path: 'imageId', select: '_id' });

        if (req.files.length > 0) {
            // Hapus semua gambar yang terkait dengan item
            for (const image of item.imageId) {
                await fs.unlink(path.join('public', image.imageUrl));
            }

            // Buat ulang imageId untuk item
            const newImages = [];
            for (const file of req.files) {
                const image = await Image.create({ imageUrl: `images/${file.filename}` });
                newImages.push(image._id);
            }
            payload.imageId = newImages;
        }

        // Update item dengan payload baru
        await Item.updateOne({ _id: id }, payload);

        req.flash('alertMessage', 'Success Update Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
    }
};
const DeleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findOne({ _id: id });

        for (let i = 0; i < item.imageId.length; i++) {
            const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
            if (fs.existsSync(path.join(`public/${imageUpdate.imageUrl}`))) {
                await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
            }
        }

        await Item.deleteOne({ _id: id });
        req.flash('alertMessage', 'Success Delete Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
    }
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
    AddItem,
    ShowImageItem,
    ShowEditItem,
    EditItem,
    DeleteItem,

    viewBank,
    AddBank,
    UpdateBank,
    DeleteBank,

    viewBooking
}

export default adminController;
