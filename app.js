const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const theaterRouter = require('./routes/theaterRoutes');
const screenRouter = require('./routes/screenRoutes');
const movieRouter = require('./routes/movieRoutes');
const showtimeRouter = require('./routes/showtimeRoutes');
const seatRouter = require('./routes/seatRoutes');
const userRouter = require('./routes/userRoutes');
const ticketRouter = require('./routes/ticketRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

app.use(express.json());

// ROUTES
app.use('/api/v1/theater', theaterRouter);
app.use('/api/v1/screen', screenRouter);
app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/showtime', showtimeRouter);
app.use('/api/v1/seat', seatRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/ticket', ticketRouter);

// app.get('/api/v1/video', (req, res) => {
//   const dirPath = path.join(__dirname, 'public');
//   const files = fs.readdirSync(dirPath);

//   let html = '<h1>Videos disponibles</h1><ul>';
//   files.forEach((f) => {
//     html += `<li><a href="/api/v1/video/${f}" target="_blank">${f}</a></li>`;
//   });
//   html += '</ul>';

//   res.send(html);
// });

// app.get('/api/v1/video/:name', (req, res, next) => {
//   const videoPath = path.join(__dirname, 'public', req.params.name);

//   if (!fs.existsSync(videoPath)) {
//     return next(new AppError(`Video ${req.params.name} not found`, 404));
//   }

//   const stat = fs.statSync(videoPath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   if (range) {
//     // Ejemplo: "bytes=0-"
//     const parts = range.replace(/bytes=/, '').split('-');
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

//     if (start >= fileSize) {
//       res.status(416).send('Requested range not satisfiable');
//       return;
//     }

//     const chunksize = end - start + 1;
//     const file = fs.createReadStream(videoPath, { start, end });
//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': 'video/mp4',
//     };

//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       'Content-Length': fileSize,
//       'Content-Type': 'video/mp4',
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(videoPath).pipe(res);
//   }
// });

// app.get('/api/v1/video/:name', (req, res, next) => {
//   const videoPath = path.join(__dirname, 'public', req.params.name);

//   // Verificamos si el archivo existe
//   if (!fs.existsSync(videoPath)) {
//     return next(new AppError(`Video ${req.params.name} not found`, 404));
//   }

//   res.type('video/mp4').sendFile(videoPath);
// });

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
