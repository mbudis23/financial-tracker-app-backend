// const winston = require("winston");

const logger = {
  log: (level, message) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    console.log(formattedMessage);
  },
  info: (message) => logger.log("info", message),
  error: (message) => logger.log("error", message),
  warn: (message) => logger.log("warn", message),
  debug: (message) => logger.log("debug", message),
};

module.exports = logger;

// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(
//       ({ timestamp, level, message }) =>
//         `[${timestamp}] ${level.toUpperCase()}: ${message}`
//     )
//   ),
//   transports: [
//     new winston.transports.Console(), // Log ke konsol
//     new winston.transports.File({ filename: "_logs/combined.log" }), // Semua log ke file
//     new winston.transports.File({
//       filename: "_logs/error.log",
//       level: "error",
//     }), // Log error ke file
//   ],
// });

// module.exports = logger;
