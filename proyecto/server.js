const express = require('express');
const connectDB = require('./config/dbConfig');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
require('dotenv').config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de nuestro proyecto!');
});

app.use('/products', productRoute);
app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
