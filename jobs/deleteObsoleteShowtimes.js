const Seat = require('../models/seatModel');
const Showtime = require('../models/showtimeModel');

const deleteObsoleteShowtimes = async () => {
  // Se ejecuta todos los días a medianoche
  const now = new Date();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const expiredShowtimes = await Showtime.find({
    endTime: { $lte: oneMonthAgo },
  });

  for (const showtime of expiredShowtimes) {
    await Seat.deleteMany({ showtime: showtime._id });

    await showtime.deleteOne();
  }

  console.log(`${expiredShowtimes.length} expired showtimes removed at ${now}`);
};

module.exports = { deleteObsoleteShowtimes };
