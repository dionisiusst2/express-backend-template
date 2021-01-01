const express = require('express');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const connectDB = require('./utils/db');
const fileUpload = require('express-fileupload');
const path = require('path');

const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const hpp = require('hpp');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const slowDown = require('express-slow-down');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');

const app = express();

// set PORT for server, default 5000
const port = process.env.PORT || 5000;

// mount Global Middleware
// parse JSON
app.use(express.json());

// parse cookie header
app.use(cookieParser());

// Set static folder
app.use(fileUpload());

// Set static folder for uploading photo
app.use(express.static(path.join(__dirname, 'public')));

// prevent NoSQL Injection on MongoDB
app.use(mongoSanitize());

// pet various HTTP headers
app.use(helmet());

// prevent XSS attack
app.use(xss());

// prevent HTTP pollution
app.use(hpp());

// limit speed when request exceeds 100 within 10 minutes
const speedLimiter = slowDown({
  windowMs: 10 * 60 * 1000, // 10 minutes
  delayAfter: 100, // allow 100 requests per 10 minutes, then...
  delayMs: 1000, //
});

app.use(speedLimiter);

// logger for incoming request, only active in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// init router
const productRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

// mount router
app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// use custom error handler
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
  );
});

connectDB();
