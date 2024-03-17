import Category from '../models/category.js'
import Bank from '../models/Bank.js'
import Booking from '../models/booking.js'
import Item from '../models/item.js'
import Image from '../models/image.js'
import fs from 'fs-extra'
import path from 'path'
import Feature from '../models/feature.js'
import Activity from '../models/activity.js'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import Member from '../models/member.js'

// Dashboard
const viewSignIn = (req, res) => {
    try {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }

        console.log(req.cookies)

        if (req.cookies.user === null || req.cookies.user === undefined) {
            res.render('index', {
                title: "Staycation | Login",
                alert
            });
        } else {
            res.redirect('/admin/dashboard')
        }
    } catch (error) {
        res.redirect('/admin/signin')
    }
}
// Dashboard
const ActionSignIn = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username: username })

        if (!user) {
            req.flash('alertMessage', 'Username Salah');
            req.flash('alertStatus', 'danger');
            return res.redirect('/admin/signin')
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            req.flash('alertMessage', 'Password Salah');
            req.flash('alertStatus', 'danger');
            return res.redirect('/admin/signin')
        }

        res.cookie("user", user, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.redirect('/admin/dashboard')

    } catch (error) {
        res.redirect('/admin/signin')
    }
}

const ActionLogout = async (req, res) => {
    try {
        // req.session.destroy();
        res.clearCookie('user'); // Menghapus cookie 'user'
        res.redirect('/admin/singin')

    } catch (error) {
        res.redirect('/admin/dashboard')
    }
}

const viewDashboard = async (req, res) => {

    try {
        const member = await Member.find()
        const booking = await Booking.find();
        const item = await Item.find()

        console.log(req.cookies.user.username)
        res.render('admin/dashboard/view_dashboard', {
            title: "Staycation | Dashboard",
            user: req.cookies.user,
            member,
            booking,
            item

        });
    } catch (error) {

    }
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
            title: "Staycation | Category",
            user: req.cookies.username || { username: "amir" },

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
        const user = {
            username: "amir",
            password: "123456"
        }


        await User.create(user);
        const category = await Category.create(payload);
        req.flash('alertMessage', 'Success Add Category');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/category');
        // res.status(201).json({ message: "Success category", category });

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/category');
        // res.status(500).json({ message: "Internal server error" });

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
            action: 'view',
            user: req.cookies.username || { username: "amir" },


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
        console.log(categoryId)

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
            action: 'show image',
            user: req.cookies.username || { username: "amir" },


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
            .populate({ path: 'categoryId', select: 'name' })
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
            action: 'edit',
            user: req.cookies.username || { username: "amir" },


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

        const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: '_id imageUrl' });
        // const item = await Item.findOne({ _id: id }).populate('imageId'); // Corrected the populate call
        console.log(item)

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
        //delete item dicategory
        const category = await Category.findOne({ _id: item.categoryId._id });
        category.itemId.pull({ _id: item._id });
        await category.save();

        await Feature.deleteMany({ itemId: item._id });
        await Activity.deleteMany({ itemId: item._id });

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

const ViewDetailItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        const feature = await Feature.find({ itemId: itemId });
        const activity = await Activity.find({ itemId: itemId })
        res.render('admin/item/detail_item/view_detail_item', {
            title: "Staycation | Detail Item",
            alert,
            itemId,
            feature,
            activity,
            user: req.cookies.username || { username: "amir" },


        })

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
}
const AddFeature = async (req, res) => {
    const { name, qty, itemId } = req.body;
    console.log(itemId)
    try {
        if (!req.file) {
            req.flash('alertMessage', 'Tidak ada file');
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
        const payload = {
            name,
            qty,
            itemId,
            imageUrl: `images/${req.file.filename}`,
        }
        const feature = await Feature.create(payload);

        const item = await Item.findOne({ _id: itemId });

        item.featureId.push({ _id: feature._id });
        await item.save();

        req.flash('alertMessage', 'Success Add Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
}

const UpdateFeature = async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
        const feature = await Feature.findOne({ _id: id });
        const imageUrl = req.file ? `images/${req.file.filename}` : feature.imageUrl;

        const payload = {
            name,
            qty,
            imageUrl
        }
        if (fs.existsSync(path.join('public', feature.imageUrl)) && req.file) {
            await fs.unlink(path.join('public', feature.imageUrl));
        }

        await Feature.updateOne({ _id: id }, payload)

        req.flash('alertMessage', 'Success Update Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
};
const DeleteFeature = async (req, res) => {
    const { id, itemId } = req.params;

    try {
        const feature = await Feature.findOne({ _id: id });
        const item = await Item.findOne({ _id: itemId });

        for (let i = 0; i < item.featureId.length; i++) {
            if (item.featureId[i]._id.toString() === feature._id.toString()) {
                item.featureId.pull({ _id: feature._id });
                await item.save();
            }
        }
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        await Feature.deleteOne({ _id: id });
        req.flash('alertMessage', 'Success Delete Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
}

// endpoint Activity
const AddActivity = async (req, res) => {
    const { name, type, itemId } = req.body;
    console.log(itemId)
    try {
        if (!req.file) {
            req.flash('alertMessage', 'Tidak ada file');
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
        const payload = {
            name,
            type,
            itemId,
            imageUrl: `images/${req.file.filename}`,
        }
        const activity = await Activity.create(payload);

        const item = await Item.findOne({ _id: itemId });

        item.activityId.push({ _id: activity._id });
        await item.save();

        req.flash('alertMessage', 'Success Add Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
}

const UpdateActivity = async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
        const activity = await Activity.findOne({ _id: id });
        const imageUrl = req.file ? `images/${req.file.filename}` : activity.imageUrl;

        const payload = {
            name,
            type,
            imageUrl
        }
        if (fs.existsSync(path.join('public', activity.imageUrl)) && req.file) {
            await fs.unlink(path.join('public', activity.imageUrl));
        }

        await Activity.updateOne({ _id: id }, payload)

        req.flash('alertMessage', 'Success Update Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);

    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
};
const DeleteActivity = async (req, res) => {
    const { id, itemId } = req.params;

    try {
        const activity = await Activity.findOne({ _id: id });
        const item = await Item.findOne({ _id: itemId });

        for (let i = 0; i < item.activityId.length; i++) {
            if (item.activityId[i]._id.toString() === activity._id.toString()) {
                item.activityId.pull({ _id: activity._id });
                await item.save();
            }
        }
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        await Activity.deleteOne({ _id: id });

        req.flash('alertMessage', 'Success Delete Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
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
            title: "Staycation | Bank",
            user: req.cookies.username || { username: "amir" },


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
const viewBooking = async (req, res) => {
    try {
        const booking = await Booking.find()
            .populate('bankId')
            .populate('memberId');
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/booking/view_booking', {
            title: "Staycation | Booking",
            user: req.cookies.username || { username: "amir" },

            booking,
            alert
        });
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/booking')
    }

}

const ShowDetailBooking = async (req, res) => {
    const { id } = req.params
    try {
        const booking = await Booking.findOne({ _id: id })
            .populate('bankId')
            .populate('memberId');
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus }
        res.render('admin/booking/show_detail_booking', {
            title: "Staycation | Detail-Booking",
            user: req.cookies.username || { username: "amir" },

            booking,
            alert
        });
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/booking')
    }
}

const BookingConfirmation = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findOne({ _id: id });
        booking.payments.status = 'Accept';
        await booking.save();
        req.flash('alertMessage', 'Success Confirmation Pembayaran');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/booking/${id}`);
    } catch (error) {
        res.redirect(`/admin/booking/${id}`);
    }
}
const BookingRejection = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findOne({ _id: id });
        booking.payments.status = 'Reject';
        await booking.save();
        req.flash('alertMessage', 'Success Reject Pembayaran');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/booking/${id}`);
    } catch (error) {
        res.redirect(`/admin/booking/${id}`);
    }
}


const adminController = {
    viewSignIn,
    ActionSignIn,
    ActionLogout,

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
    ViewDetailItem,

    AddFeature,
    UpdateFeature,
    DeleteFeature,

    AddActivity,
    UpdateActivity,
    DeleteActivity,

    viewBank,
    AddBank,
    UpdateBank,
    DeleteBank,

    viewBooking,
    ShowDetailBooking,
    BookingConfirmation,
    BookingRejection
}

export default adminController;
