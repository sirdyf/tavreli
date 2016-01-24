var winston = require('winston');

winston.loggers.add('my-logger', {
    console: {
        level: 'debug',
        colorize: true,
        timestamp: true,
        handleExceptions: true
    },
    file: {
        level: 'info',
        colorize: false,
        timestamp: true,
        filename: 'file.log',
        handleExceptions: true
    }
});

var logger = winston.loggers.get('my-logger');

exports.exitAfterFlush = function(code) {
    logger.transports.file.on('flush', function() {
        process.exit(code);
    });
};

exports.info = function() {
    logger.info.apply(this, arguments);
};

exports.warn = function() {
    logger.info.apply(this, arguments);
};

exports.error = function() {
    logger.info.apply(this, arguments);
};


