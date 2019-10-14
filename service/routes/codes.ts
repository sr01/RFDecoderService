import express from 'express';
import HttpStatus from 'http-status-codes';
import { CodeRepository } from '../model/code/CodeRepository';
import { Code } from '../model/code/Code';
import { AddCodeRequest, AddCodeRequestSchema } from '../model/code/AddCodeRequestData';
import { GetCodesRequest, GetCodesRequestSchema } from '../model/code/GetCodesRequest';
import Ajv from 'ajv';

var router = express.Router();
let codeRepository = new CodeRepository();
let ajv = new Ajv({ allErrors: true });

router.post('/GetCodesRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    let valid = ajv.validate(GetCodesRequestSchema, req.body);

    if (!valid) {
        console.log(ajv.errors);
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ajv.errors!.map(err => `${err.dataPath} ${err.message}`));

    } else {
        const getCodesRequest = GetCodesRequest.fromData(req.body);
        console.log(`getCodesRequest: ${JSON.stringify(getCodesRequest)}`);

        codeRepository.get(getCodesRequest.name, function (err: Error, codes: Array<Code>) {
            if (err) {
                next(err);
            } else {
                res.send(codes);
            }
        })
    }
});

router.post('/AddCodeRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    let valid = ajv.validate(AddCodeRequestSchema, req.body);

    if (!valid) {
        console.log(ajv.errors);
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ajv.errors!.map(err => `${err.dataPath} ${err.message}`));

    } else {
        const addCodeRequest = AddCodeRequest.fromData(req.body);
        console.log(`addCodeRequest: ${JSON.stringify(addCodeRequest)}`);

        codeRepository.put(addCodeRequest.code, (err, code) => {
            if (err) {
                next(err);
            } else {
                res.send(`success`);
            }
        });
    }
});

export default router;