const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const handle = require('express-handlebars');
const app = express();

const MONGODBURI = 'mongodb+srv://davetech:0JcSyzCDJFTrtqWl@cluster0-aq6mn.mongodb.net/test';
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session)
    // const mongoConnect = require('./utils/database').mongoConnect;
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));


const errorController = require('./controllers/error')
const User = require('./models/user')

const store = new mongoDbStore({
    uri: MONGODBURI,
    collection: 'sessions'
});

const csrfProtection = csrf({ cookie: false });

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)

app.use(csrfProtection);
app.use(flash());

app.engine('hbs', handle({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main-layout',
    extname: 'hbs'
}));

const userId = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        })
}

app.use(userId);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.loggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
        console.log('hello')
    },
    filename: function (req, file, cb){
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/JPG' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, false)
    }else{
        cb(null, true)
    }
}

var upload = multer({ storage: fileStorage, fileFilter: fileFilter })

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use('/admin', upload.single('image'), adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    //res.status(error.httpStatusCode).render(error.httpStatusCode);
    //res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.loggedIn
    });
})

// mongoConnect(() => {
//     app.listen(8000);
//     console.log('and Listening');
// })

mongoose.connect(MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(8000)
        console.log('Listening');
    })
    .catch(err => console.log(err));