const isLogin = (req, res, next) => {

    const { user } = req.cookies;

    if (!user) {
        console.log("!isLogin")
        req.flash('alertMessage', 'Session telah habis silahkan signin kembali!!');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
    } else {
        console.log("isLogin")
        next();
    }
    // if (req.session.user == null || req.session.user == undefined) {
    //     console.log("!isLogin")
    //     req.flash('alertMessage', 'Session telah habis silahkan signin kembali!!');
    //     req.flash('alertStatus', 'danger');
    //     res.redirect('/admin/signin');
    // } else {
    //     console.log("isLogin")
    //     next();
    // }
}

export default isLogin 