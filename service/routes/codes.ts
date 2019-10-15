import express from 'express';
import HttpStatus from 'http-status-codes';
import { AddCodeRequest, AddCodeRequestSchema } from '../model/code/AddCodeRequest';
import { GetCodesRequest, GetCodesRequestSchema } from '../model/code/GetCodesRequest';
import Ajv from 'ajv';
import { LearnRequestSchema, LearnRequest } from '../model/code/LearnRequest';
import { CodesReceiveManager } from '../model/code/CodesReceiveManager';
import { validateRequestBody } from '../utils/RequestValidation';

var router = express.Router();
let ajv = new Ajv({ allErrors: true });
let codesReceiveManager = new CodesReceiveManager();

router.post('/GetCodesRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, GetCodesRequestSchema)) {
        const getCodesRequest = GetCodesRequest.fromData(req.body);
        console.debug(`getCodesRequest: ${JSON.stringify(getCodesRequest)}`);

        codesReceiveManager.getCode(getCodesRequest.buttonName, (err, codes) => {
            if (err) {
                next(err);
            } else {
                res.send(codes);
            }
        })
    }
});

router.post('/AddCodeRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, AddCodeRequestSchema)) {
        const addCodeRequest = AddCodeRequest.fromData(req.body);
        console.debug(`addCodeRequest: ${JSON.stringify(addCodeRequest)}`);

        codesReceiveManager.addCode(addCodeRequest.code, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.send(`success`);
            }
        })
    }
});

router.post('/LearnRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, LearnRequestSchema)) {
        const learnRequest = LearnRequest.fromData(req.body);
        console.debug(`learnRequest: ${JSON.stringify(learnRequest)}`);

        codesReceiveManager.stop();
        
        codesReceiveManager.learnCode(learnRequest.buttonName, learnRequest.receiverTopic, learnRequest.buttonTopic, (err, code) => {
            if (err) {
                next(err);
            } else {
                res.send(code);
            }
            codesReceiveManager.start();
        })
    }
});

codesReceiveManager.start();

export default router;
