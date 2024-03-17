import express from 'express'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors'
import router from './src/routes/index.js';
import connectDB from './src/config/db.js';
import methodOverride from 'method-override';
import session from 'express-session';
import flash from 'connect-flash'

const app = express();
const port = 3000;

const __dirname = path.resolve();

// Middleware untuk konten statis dan view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')))
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));

// Middleware session dan flash
app.use(cookieParser()); //allow to access cookie
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash());

// Middleware untuk mengatur router
app.use(methodOverride('_method'))
app.use(router);

// Middleware untuk CORS
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000']
}))

// Penanganan rute untuk rute '/'
app.get('/', (req, res) => {
    res.render('index');
});

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Menghubungkan ke database
connectDB('mongodb://127.0.0.1/db-travelbwa');

// Mulai server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app



// app.use('/admin', admin);

// app.get('/', (req, res) => {
//     res.send(__dirname)
// })

// app.get('/', (req, res) => {
//     res.status(200).json({
//         code: 200,
//         status: 'OK',
//         data: {
//             message: 'server running'
//         }
//     })
// })

// app.get('*', (req, res) => {
//     res.status(404).json({
//         code: 404,
//         status: 'NOT_FOUND',
//         errors: [{ path: 'invalid path' }]
//     })
// })

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });