const winston = require('winston');
const chalk = require('chalk');
const applicationConfig = require('../config/app-config');

const SILVER_GRAY = '#C0C0C0';
const MAX_SIZE_IN_BYTES = 10000 * 1000; // ~10MB
const logLevels = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

class LoggerService {
    logger;

    constructor(logger) {
        this.logger = logger;
    }

    static getLogger(name) {
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: applicationConfig.loggingConsoleLevel,
                    handleExceptions: true,
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: 'HH:mm:ss'
                        }),
                        winston.format.printf(info => `${info.timestamp}|${LoggerService.colorizeLevel(info.level)}|${chalk.bold(name)}: ${chalk.hex(SILVER_GRAY)(info.message)}`)
                    )
                }),
                new winston.transports.File({
                    level: 'debug',
                    handleExceptions: true,
                    filename: `./logs/app.log`,
                    maxsize: MAX_SIZE_IN_BYTES,
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: 'YY-MM-DD HH:mm:ss'
                        }),
                        winston.format.printf(info => `${info.timestamp}|${info.level}|${name}: ${info.message}`)
                    ),
                })
            ]
        });

        return new LoggerService(logger);
    }

    static colorizeLevel(level) {
        switch (level) {
            case logLevels.DEBUG: return chalk.bold.blue(level);
            case logLevels.INFO: return chalk.bold.green(level);
            case logLevels.WARN: return chalk.bold.hex('#FFA500')(level); // FFA500 = orange color
            case logLevels.ERROR: return chalk.bold.red(level);
        }
    }

    warn(message) {
        this.log(message, logLevels.WARN);
    }

    error(message) {
        this.log(message, logLevels.ERROR);
    }

    info(message) {
        this.log(message);
    }

    debug(message) {
        this.log(message, logLevels.DEBUG);
    }

    log(message, level = 'info') {
        this.logger.log(level, message);
    }
}

module.exports = LoggerService;
