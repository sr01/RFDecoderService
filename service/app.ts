import { createLogger, format, transports, Logger, } from 'winston';
const { combine, timestamp, label, printf } = format;
const formatter = printf(({ level, message, label, timestamp }) => `${timestamp} ${level} [${label}] ${message}`);
const mainLogger = createLogger({
    level: 'debug',
    format: combine(
        timestamp({ "format": "DD-MM-YYYY HH:mm:ss.SSS" }),
        formatter
    ),
    transports: [new transports.Console()]
});

import createError from 'http-errors';
import express from 'express';
import { Request, Response } from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import fs from 'fs';
import indexRouter from './routes/index';
import decoderRouter from './routes/decoder';
import codesRouter from './routes/codes';
import appRoot from './approot'
import Settings from './model/settings/Settings';
import { CodesReceiveManager } from './model/code/CodesReceiveManager';

mainLogger.info(fs.readFileSync(path.join(appRoot, 'title.txt')).toString());
mainLogger.info(`
appRoot: ${appRoot}
Settings: ${Settings.getInstance().toString()}
`);

let codesReceiveManager = new CodesReceiveManager();
var app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/decoder', decoderRouter);
app.use('/codes', codesRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: any) {
    res.status(404);
    res.json({ 'status': false });
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ 'status': false, 'message': res.locals.error.message });
});

codesReceiveManager.start();

export  {app, mainLogger, codesReceiveManager};
