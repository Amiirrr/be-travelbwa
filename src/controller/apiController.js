import Item from '../models/item.js'
import Treasure from '../models/activity.js'
import Treveler from '../models/booking.js'
import Category from '../models/category.js'
import Bank from '../models/Bank.js'
import Booking from '../models/booking.js'
import Member from '../models/member.js'

const landingPage = async (req, res) => {
    try {
        const mostPicked = await Item.find()
            .select('_id title country city price unit imageId categoryId')
            .limit(5)
            .populate({ path: 'imageId', select: '_id imageUrl' })

        const category = await Category.find()
            .select('_id name')
            .limit(3)
            .populate({
                path: 'itemId',
                select: '_id title country city isPopular imageId',
                perDocumentLimit: 4,
                option: { sort: { sumBooking: -1 } },
                populate: {
                    path: 'imageId',
                    select: '_id imageUrl',
                    perDocumentLimit: 1
                }
            })

        console.log(category)

        const treveler = await Treveler.find();
        const treasure = await Treasure.find();
        const city = await Item.find();

        for (let i = 0; i < category.length; i++) {
            for (let x = 0; x < category[i].itemId.length; x++) {
                const item = await Item.findOne({ _id: category[i].itemId[x]._id });
                item.isPopular = false;
                await item.save();
                if (category[i].itemId[0] === category[i].itemId[x]) {
                    item.isPopular = true;
                    await item.save();
                }
            }
        }

        const testimonial = {
            _id: "asd1293uasdads1",
            imageUrl: "images/testimonial2.jpg",
            name: "Happy Family",
            rate: 4.55,
            content: "What a great trip with my family and I should try again next time soon ...",
            familyName: "Angga",
            familyOccupation: "Product Designer"
        }

        res.status(200).json({
            hero: {
                travelers: treveler.length,
                treasures: treasure.length,
                cities: city.length
            },
            category,
            testimonial,
            mostPicked
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const detailPage = async (req, res) => {
    try {
        // const { id } = req.params;
        const id = '65e5d961f9a0ad74fa69def2';
        const item = await Item.findOne({ _id: id })
            .populate({ path: 'featureId', select: '_id name qty imageUrl' })
            .populate({ path: 'activityId', select: '_id name type imageUrl' })
            .populate({ path: 'imageId', select: '_id imageUrl' });

        const bank = await Bank.find();

        const testimonial = {
            _id: "asd1293uasdads1",
            imageUrl: "images/testimonial1.jpg",
            name: "Happy Family",
            rate: 4.55,
            content: "What a great trip with my family and I should try again next time soon ...",
            familyName: "Angga",
            familyOccupation: "Product Designer"
        }

        res.status(200).json({
            ...item._doc,
            bank,
            testimonial
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const bookingPage = async (req, res) => {

    try {
        const {
            image,
            itemId,
            duration,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom,
            bankTo
        } = req.body;

        console.log(itemId)
        console.log(req.file)

        if (!req.file) {
            return res.status(404).json({ message: "Image not found" });
        }

        const data = {
            itemId,
            duration,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom,
            bankTo
        }

        if (
            itemId === undefined ||
            duration === undefined ||
            bookingStartDate === undefined ||
            bookingEndDate === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            email === undefined ||
            phoneNumber === undefined ||
            accountHolder === undefined ||
            bankFrom === undefined ||
            bankTo === undefined
        ) {
            return res.status(404).json({ message: "Lengkapi semua field" });
        }

        const item = await Item.findOne({ _id: itemId });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.sumBooking += 1;

        await item.save();

        let total = item.price * duration;
        let tax = total * 0.10;

        const invoice = Math.floor(1000000 + Math.random() * 9000000).toString();

        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber
        });

        const bank = await Bank.findOne({ bankName: bankTo })

        const newBooking = {
            invoice,
            bookingStartDate: new Date(bookingStartDate),
            bookingEndDate: new Date(bookingEndDate),
            total: total += tax,
            itemId: {
                id: item.id,
                title: item.title,
                price: item.price,
                duration: parseInt(duration)
            },
            bankId: bank.id,
            memberId: member.id,
            payments: {
                proofPayment: `images/${req.file.filename}`,
                bankFrom,
                accountHolder
            }
        }
        const booking = await Booking.create(newBooking);

        res.status(201).json({ message: "Success Booking", booking });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const apiController = {
    landingPage,
    detailPage,
    bookingPage
}

export default apiController