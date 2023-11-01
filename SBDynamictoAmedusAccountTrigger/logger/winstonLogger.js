
const { createLogger, transports, format } = require('winston');
//const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//Debug mode check
const isDebugMode = process.env.NODE_ENV === 'development' && process.env.DEBUG_MODE === 'true';
const maxSize = 1024 * 256; // 250 MB
const generateCorrelationId = () => uuidv4();
const logDateFormat = new Date().toISOString().slice(0, 10);
const logFilePath = path.join(__dirname, 'logs', `${logDateFormat}-app.log`);

const errorWLoggerTransport = new transports.File(
    { filename: logFilePath },
    {
        format: format.combine(
            format.timestamp(),
            format.json(),
            format.printf((info) => {
                return `[${info.timestamp}] [Correlation ID: ${info.correlationId}] ${info.level}: ${info.message}`;
            })
        ),
        maxsize: maxSize,
        maxFiles: 3,
    });

const logger = createLogger({
    transports: [errorWLoggerTransport],
});

if (isDebugMode) {
    // logger.add(new transports.File(
    //     {
    //         level: 'debug',
    //         filename: logFilePath
    //     },{
    //         format: format.combine(
    //             format.timestamp(),
    //             format.json(),
    //             format.printf((info) => {
    //                 // Add correlation ID to the log message
    //                 return `[${info.timestamp}] [Correlation ID: ${info.correlationId}] ${info.level}: ${info.message}`;
    //             })
    //         ),
    //         maxsize: maxSize,
    //         maxFiles: 3, // Maximum number of files to keep (for rotation)
    //     }));
}

module.exports = { logger, generateCorrelationId };