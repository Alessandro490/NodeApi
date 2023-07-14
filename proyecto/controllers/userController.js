const User = require('../models/userModel');
const { registerValidation, loginValidation } = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }


    const { firstName, lastName, username, email, phoneNumber, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });


    const savedUser = await newUser.save();
    res.json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
const loginUser = async (req, res) => {
    try {
      const { error } = loginValidation(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
  
      const { email, password } = req.body;
  
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  
  
  const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  
  const getUserByID = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };

  const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, username, email, phoneNumber, password, confirmPassword } = req.body;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Actualizar los campos modificables
      user.firstName = firstName;
      user.lastName = lastName;
      user.username = username;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.password = password;
      user.confirmPassword = confirmPassword;
  
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  
  module.exports = {
    registerUser,
    loginUser,
    getUsers, 
    getUserByID,
    updateUser,
    deleteUser,
  };