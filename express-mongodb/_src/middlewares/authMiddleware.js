const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Pastikan logger diimpor dengan benar

exports.authenticate = (req, res, next) => {
    try {
        // Ambil token dari header atau cookie
        const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;

        if (!token) {
            logger.warn('Authentication failed: Token is missing');
            return res.status(401).json({
                message: 'Access denied! Token is required.',
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            logger.info(`User authenticated successfully: ${decoded.email || decoded.id}`);
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                logger.warn('Authentication failed: Token has expired');
                return res.status(401).json({
                    message: 'Token has expired. Please log in again.',
                });
            } else if (error.name === 'JsonWebTokenError') {
                logger.warn('Authentication failed: Invalid token');
                return res.status(400).json({
                    message: 'Invalid token. Please provide a valid token.',
                });
            } else {
                logger.error(`Unexpected error during token verification: ${error.message}`);
                return res.status(500).json({
                    message: 'An unexpected error occurred. Please try again later.',
                });
            }
        }
    } catch (error) {
        logger.error(`Unexpected error in authentication middleware: ${error.message}`, {
            stack: error.stack,
        });
        return res.status(500).json({
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
};
