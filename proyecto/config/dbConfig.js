const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); // Detener la aplicación si hay un error en la conexión a la base de datos
  }
};

module.exports = connectDB;
