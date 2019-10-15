import express from 'express';
import HttpStatus from 'http-status-codes';
import ajv from 'ajv';

export function validateRequestBody(req: express.Request, res: express.Response, ajv: ajv.Ajv, schema: object): boolean {

    let valid = ajv.validate(schema, req.body);

    if (!valid) {
        console.error(ajv.errors);
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ajv.errors!.map(err => `${err.dataPath} ${err.message}`));

        return false;

    } else {

        return true;
    }
}
