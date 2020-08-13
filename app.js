var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoDB = require('./connection/conMongoDb')
const passport = require('./config/passport');
const session = require('express-session');

//CONTROLADORES
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const bicicletaRouter = require('./routes/bicicletas');
const UsuarioRouter = require('./routes/usuarios');
const TokenRouter = require('./routes/tokens');
const AccesoRouter = require('./routes/acceso');
const middleware = require('./middleware/verifyAcceso');
const authAcceso = require('./middleware/authAccess');

//API
const bicicletaAPIRouter = require('./routes/api/bicicletas');
const usuarioAPIRouter = require('./routes/api/usuario');
const authAPIRouter = require('./routes/api/auth');

const store = new session.MemoryStore;

//REALIZAR CONEXION A MONGO
mongoDB.dev();

var app = express();

// uso de cookie y session
app.use(session({
    cookie: {
      maxAge: 240*60*60*1000
    },
    store: store,
    saveUninitialized: true,
    resave: 'true',
    secret: '!"#%%'//codigo para generar la encriptacion el identifacor de la cookie
  }));

app.set('secretKey','jwt_pwd_123!#$');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//app.all('/bicicletas', middleware.loggedIn);
//app.all('/bicicletas/*', middleware.loggedIn);

app.use('/', indexRouter);
//todo lo de acceso esta en esta parte[login, logout, restore]
app.use(AccesoRouter);
app.use('/bicicletas',  middleware.loggedIn, bicicletaRouter);
app.use('/usuarios', UsuarioRouter);
app.use('/token', TokenRouter);
app.use('/api/bicicletas', authAcceso.validarUsuario, bicicletaAPIRouter);
app.use('/api/usuarios', usuarioAPIRouter);
app.use("/api/auth", authAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
