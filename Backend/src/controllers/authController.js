// // const jwt = require('jsonwebtoken');
// // const User = require('../models/user');
// import jwt from 'jsonwebtoken';
// import User from '../models/user.js';

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // @desc    Register new user
// // @route   POST /api/auth/register
// // @access  Public
// const register = async (req, res) => {
//   try {
//     const { fullName, email, phone, address, ward, password } = req.body;
//     // Check if user exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create user
//     const user = await User.create({
//       fullName,
//       email,
//       phone,
//       address,
//       ward,
//       password,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         ward: user.ward,
//         role: user.role,
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    



//     // Check for user email
//     const user = await User.findOne({ email }).select('+password');
//     console.log(user)

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         ward: user.ward,
//         role: user.role,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get user profile
// // @route   GET /api/auth/profile
// // @access  Private
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       res.json({
//         _id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         ward: user.ward,
//         role: user.role,
//       });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export {
//   register,
//   login,
//   getProfile,
// };