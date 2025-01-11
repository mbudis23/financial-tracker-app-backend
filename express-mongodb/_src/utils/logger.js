const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Log ke konsol
    new winston.transports.File({ filename: "_logs/combined.log" }), // Semua log ke file
    new winston.transports.File({
      filename: "_logs/error.log",
      level: "error",
    }), // Log error ke file
  ],
});

module.exports = logger;
