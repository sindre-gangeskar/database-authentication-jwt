require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var addRouter = require('./routes/add');
var subtractRouter = require('./routes/subtract');
var divideRouter = require('./routes/divide');
var multiplyRouter = require('./routes/multiply');
var previousRouter = require('./routes/previous');

const db = require('./models');
db.sequelize.sync({ force: false });
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/add', addRouter);
app.use('/subtract', subtractRouter);
app.use('/divide', divideRouter);
app.use('/multiply', multiplyRouter);
app.use('/previous', previousRouter);
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

//#region Error Handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
//#endregion
module.exports = app;
