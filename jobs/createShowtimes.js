const Movie = require('../models/movieModel');
const Screen = require('../models/screenModel');
const Showtime = require('../models/showtimeModel');

const createShowtimes = async () => {
  try {
    const options = {
      showsPerWeek: 2,
      schedules: ['16:00', '20:00'],
      price: 80,
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const movies = await Movie.find();
    const screens = await Screen.find();

    let totalCreated = 0;

    for (const movie of movies) {
      for (let i = 0; i < options.showsPerWeek; i++) {
        // Día aleatorio dentro de la semana
        const dayOffset = Math.floor(Math.random() * 7);
        const baseDate = new Date(now);
        baseDate.setDate(baseDate.getDate() + dayOffset);

        // Horario aleatorio
        const schedule =
          options.schedules[
            Math.floor(Math.random() * options.schedules.length)
          ];

        const [hours, minutes] = schedule.split(':').map(Number);

        baseDate.setHours(hours, minutes, 0, 0);

        // Screen aleatoria
        const screen = screens[Math.floor(Math.random() * screens.length)];

        // Evitar duplicados
        const exists = await Showtime.findOne({
          movie: movie._id,
          screen: screen._id,
          dateTime: baseDate,
        });

        if (exists) continue;

        try {
          await Showtime.create({
            movie: movie._id,
            screen: screen._id,
            theater: screen.theater,
            dateTime: baseDate,
            price: options.price,
          });

          totalCreated++;
        } catch (err) {
          // puede fallar por traslape → ignorar
          console.log('Skipped:', err.message);
        }
      }
    }

    console.log(`Showtimes creados: ${totalCreated}`);
  } catch (err) {
    console.error('Error creando showtimes:', err);
  }
};

module.exports = { createShowtimes };
