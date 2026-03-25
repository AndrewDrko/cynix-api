// import { createShowtimes } from './jobs/createShowtimes.js';
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');

const theaterRouter = require('./routes/theaterRoutes');
const screenRouter = require('./routes/screenRoutes');
const movieRouter = require('./routes/movieRoutes');
const showtimeRouter = require('./routes/showtimeRoutes');
const seatRouter = require('./routes/seatRoutes');
const userRouter = require('./routes/userRoutes');
const ticketRouter = require('./routes/ticketRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { updateExpiredShowtimes } = require('./jobs/updateExpiredShowtimes');
const { deleteObsoleteShowtimes } = require('./jobs/deleteObsoleteShowtimes');
const { createShowtimes } = require('./jobs/createShowtimes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'https://cynix-api.onrender.com',
    credentials: true,
  }),
);

app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));
// ROUTES
app.use('/api/v1/theater', theaterRouter);
app.use('/api/v1/screen', screenRouter);
app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/showtime', showtimeRouter);
app.use('/api/v1/seat', seatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/ticket', ticketRouter);

updateExpiredShowtimes();
deleteObsoleteShowtimes();
// createShowtimes();

// CRON FOR UPDATE SHOWTIME STATUS
// PENDING: Update the expired function without UTC format
cron.schedule('*/30 * * * *', updateExpiredShowtimes);

// CRON FOR DELETE OBSOLETE SHOWTIMES
cron.schedule('0 0 * * *', deleteObsoleteShowtimes);

// CRON FOR CREATING NEW SHOWTIMES
cron.schedule('0 0 * * *', createShowtimes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
