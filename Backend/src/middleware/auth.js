
import jwt from 'jsonwebtoken';
import { auth } from '../libs/auth.js';

const verifyAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session && !session.user) {
      return res.status(401).json({ message: 'Not authorized, no session' });
    }

    req.user = session.user;
    next();

  } catch (error) {
    console.error("Authentication error:", error);
  }
}


// // Protect routes - verify JWT token
// const protect = async (req, res, next) => {
//   let token;

//   console.log(req.headers.authorization);
//   if (

//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       // Get token from header
      
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from token
//       req.user = await User.findById(decoded.id).select('-password');

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// Admin middleware
const admin = async (req, res, next) => {

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session && !session.user) {
      return res.status(401).json({ message: 'Not authorized, no session' });
    }

    if (session.user.role !== "admin") {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.user = session.user;
    next();

  } catch (error) {
    console.error("Authentication error:", error);
  }
};

export{ verifyAuth, admin };