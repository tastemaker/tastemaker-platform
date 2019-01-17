
import winston from 'winston';

const errorStackTracerFormat = winston.format(info => {
    
    if (info.meta && info.meta instanceof Error) {
        info.message = `${info.message} ${info.meta.stack}`;
    }

    return info;
});

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.splat(),
                errorStackTracerFormat(),
                winston.format.timestamp(),
                winston.format.colorize({ all: true }),
                winston.format.align(),
                winston.format.printf((info) => {
                    const { timestamp, level, message } = info;
                    return `${timestamp} ${level}: ${message}`;
                }),
              ),
        })
    ]
});

export default logger;