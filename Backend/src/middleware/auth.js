import jwt from 'jsonwebtoken';
import { getAuth, clerkClient } from '@clerk/express';
import Collector from '../models/collector.js';

// Collector authentication middleware
const protectCollector = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Check if it's a collector token
      if (decoded.role !== 'collector') {
        return res.status(401).json({ message: 'Not authorized as collector' });
      }

      // Get collector from token (excluding password)
      req.collector = await Collector.findById(decoded.id).select('-password');

      if (!req.collector) {
        return res.status(401).json({ message: 'Collector not found' });
      }

      // Check if collector is active
      if (req.collector.status !== 'active') {
        return res.status(401).json({ message: 'Collector account is inactive' });
      }

      next();
    } catch (error) {
      console.error('Collector authentication error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Verify user authentication using Clerk
const verifyAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({ message: 'Not authorized, no session' });
    }

    // Get full user data from Clerk
    const user = await clerkClient.users.getUser(auth.userId);
    
    // Map Clerk user to expected format
    req.user = {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
      emailVerified: user.emailAddresses?.[0]?.verification?.status === 'verified',
      image: user.imageUrl,
      // Get custom metadata (phone, address, ward, role)
      phone: user.publicMetadata?.phone || user.unsafeMetadata?.phone || '',
      address: user.publicMetadata?.address || user.unsafeMetadata?.address || '',
      ward: user.publicMetadata?.ward || user.unsafeMetadata?.ward || '',
      role: user.publicMetadata?.role || 'user',
    };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

// Admin middleware using Clerk
const admin = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({ message: 'Not authorized, no session' });
    }

    // Get full user data from Clerk
    const user = await clerkClient.users.getUser(auth.userId);
    const role = user.publicMetadata?.role || 'user';

    if (role !== "admin") {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.user = {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
      role: role,
      phone: user.publicMetadata?.phone || user.unsafeMetadata?.phone || '',
      address: user.publicMetadata?.address || user.unsafeMetadata?.address || '',
      ward: user.publicMetadata?.ward || user.unsafeMetadata?.ward || '',
    };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

export { verifyAuth, admin, protectCollector };