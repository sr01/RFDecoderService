import express from 'express';
import HttpStatus from 'http-status-codes';
import ajv from 'ajv';
import { Logger } from 'winston';

export function validateRequestBody(req: express.Request, res: express.Response, ajv: ajv.Ajv, schema: object, logger: Logger): boolean {

    let valid = ajv.validate(schema, req.body);

    if (!valid) {
        logger.error(req.path + " validation errors: " + JSON.stringify(ajv.errors, null, 2));
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ajv.errors!.map(err => `${err.dataPath} ${err.message}`));

        return false;

    } else {

        return true;
    }
}
