var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('express-flash');
require('dotenv').config()

// Routes
var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
var loginRouter = require('./routes/login');
var productsRouter = require('./routes/products');
var errorRouter = require('./routes/error');
var cartRouter = require('./routes/cart');
var blogRouter = require('./routes/blog');
var detailRouter = require('./routes/detail');
var checkoutRouter = require('./routes/checkout');
var searchRouter = require('./routes/search');
var paymentRouter = require('./routes/payment');
var paymentDetailRouter = require('./routes/payment-detail');

// Admin
var dashboardAdminRouter = require('./routes/admin/dashboard');
var userAdminRouter = require('./routes/admin/user');
var tableAdminRouter = require('./routes/admin/table');
var loginAdminRouter = require('./routes/admin/login');

// Api
var useApiRouter = require('./routes/api/users')
var imageUploadApiRouter = require('./routes/api/image-upload')
var voucherApiRouter = require('./routes/api/vouchers')
var cartApiRouter = require('./routes/api/carts')
var shipperApiRouter = require('./routes/api/shipper')
var buyApiRouter = require('./routes/api/buys')
var reviewApiRouter = require('./routes/api/review')

// Middleware
var {getDataLeftSidebar, getDataShipper, getDataRecommend, getDataBanner, getDataTab, getDataFooter} = require('./middleware/variable')

var app = express();

// DATABASE
var mongoose = require('mongoose')

// SESSION
const session = require('express-session')

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	  	cookie:{maxAge: 3600000}
	})
)

// PASSPORT
const passport = require('passport');
// PASSPORT CONFIG
require('./config/passport')(passport)
// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(flash());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false , limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware

app.use(getDataLeftSidebar);
app.use(getDataShipper);
app.use(getDataRecommend);
app.use(getDataBanner);
app.use(getDataTab);
app.use(getDataFooter);

// routes main

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/products', productsRouter);
app.use('/error', errorRouter);
app.use('/cart', cartRouter);
app.use('/blog', blogRouter);
app.use('/detail', detailRouter);
app.use('/checkout',checkoutRouter);
app.use('/search',searchRouter);
app.use('/payment', paymentRouter);
app.use('/payment-detail', paymentDetailRouter);

// routes admin
app.use('/admin/dashboard', dashboardAdminRouter);
app.use('/admin/user', userAdminRouter);
app.use('/admin/table', tableAdminRouter);
app.use('/22012000/login',loginAdminRouter);

// api routes
app.use('/api/users',useApiRouter);
app.use('/api/image-upload',imageUploadApiRouter);
app.use('/api/vouchers',voucherApiRouter);
app.use('/api/carts',cartApiRouter);
app.use('/api/shippers',shipperApiRouter);
app.use('/api/buys',buyApiRouter);
app.use('/api/reviews',reviewApiRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });


//CONNECT DATABASE: MONGO ATLAS
mongoose.connect(process.env.DB_CONNECTION,
	{
		useNewUrlParser:true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(err => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});
module.exports = app;