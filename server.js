const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// CONNECTING TO DB
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

// CREATE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server iniciado en el puerto: ${port}`);
});
