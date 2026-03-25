const Showtime = require('../models/showtimeModel');

const updateExpiredShowtimes = async () => {
  const now = new Date();

  // Buscar showtimes activos ya expirados
  const expiredShowtimes = await Showtime.find({
    endTime: { $lte: now },
    status: 'active',
  });

  for (const showtime of expiredShowtimes) {
    // Cambiar estado a 'expired'
    showtime.status = 'expired';
    await showtime.save();
  }

  console.log(
    `⏰ Showtime statuses updated automatically / CRON in ${now} / ${expiredShowtimes.length} documents updated`,
  );
};

module.exports = { updateExpiredShowtimes };
