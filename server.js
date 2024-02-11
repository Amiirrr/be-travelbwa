import express from 'express'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;

app.use(cookieParser()); //allow to access cookie
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json

//enable cors 
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000']
}))

app.get('/', (req, res) => {
    res.send("hellow World")
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
