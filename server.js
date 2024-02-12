import express from 'express'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import cors from 'cors'
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;

// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();
// const __dirname = path.dirname(__filename);
// const relativePath = path.relative(process.cwd(), __dirname).replace(/\\/g, '/');

// const __dirname = process.cwd(); // Mengambil direktori kerja saat ini dari Node.js
// const __dirname = import.meta.url; // Mengambil direktori kerja saat ini dari Node.js

app.use(cookieParser()); //allow to access cookie
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json

//enable cors 
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000']
}))

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

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
    console.log(__dirname)
})

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
//middleware
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));

// Penanganan rute untuk rute '/'
app.get('/', (req, res) => {
    // Render tampilan 'index.ejs'
    res.render('index');
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
