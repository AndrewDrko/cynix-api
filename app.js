const express = require('express');
const app = express();
const theaterRouter = require('./routes/theaterRoutes');
const AppError = require('./utils/appError');

app.use(express.json());

app.use('/api/v1/theater', theaterRouter);

module.exports = app;
