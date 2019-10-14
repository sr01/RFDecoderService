import createError from 'http-errors';
import express from 'express';
import { Request, Response } from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import indexRouter from './routes/index';
import decoderRouter from './routes/decoder';
import codesRouter from './routes/codes';
import appRoot from './approot'
import Settings from './model/settings/Settings';

console.log(fs.readFileSync(path.join(appRoot, 'title.txt')).toString());
console.log(`
appRoot: ${appRoot}
Settings: ${Settings.getInstance().toString()}
`);

var app = express();

app.use(logger('dev'));
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

export default app;