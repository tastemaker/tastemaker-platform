
import log from 'winston';

const logger = log.createLogger({
    level: 'info',
    transports: [
        new log.transports.Console({
            format: log.format.combine(
                log.format.timestamp(),
                log.format.colorize({ all: true }),
                log.format.align(),
                log.format.printf((info) => {
                    const { timestamp, level, message } = info;
                    return `${timestamp} ${level}: ${message}`;
                }),
              ),
        })
    ]
});

export default logger;