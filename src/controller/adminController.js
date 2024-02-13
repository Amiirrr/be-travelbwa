const viewDashboard = (req, res) => {
    res.render('admin/dashboard/view_dashboard');
}
const viewCategory = (req, res) => {
    res.render('admin/category/view_category');
}
const viewItem = (req, res) => {
    res.render('admin/item/view_item');
}
const viewBank = (req, res) => {
    res.render('admin/bank/view_bank');
}

const adminController = {
    viewDashboard,
    viewCategory,
    viewItem,
    viewBank
}

export default adminController;
