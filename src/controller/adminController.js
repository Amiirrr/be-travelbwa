const viewDashboard = (req, res) => {
    res.render('admin/dashboard/view_dashboard');
}

const adminController = {
    viewDashboard,
}

export default adminController;
