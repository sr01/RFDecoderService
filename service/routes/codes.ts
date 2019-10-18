import express from 'express';
import { AddCodeRequest, AddCodeRequestSchema } from '../model/code/AddCodeRequest';
import { GetCodesRequest, GetCodesRequestSchema } from '../model/code/GetCodesRequest';
import Ajv from 'ajv';
import { LearnRequestSchema, LearnRequest } from '../model/code/LearnRequest';
import { validateRequestBody } from '../utils/RequestValidation';
import { mainLogger, codesReceiveManager } from '../app'

let logger = mainLogger.child({ label: "routes/codes" })
let router = express.Router();
let ajv = new Ajv({ allErrors: true });

router.post('/GetCodesRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, GetCodesRequestSchema, logger)) {
        const getCodesRequest = GetCodesRequest.fromData(req.body);
        logger.debug(`getCodesRequest: ${JSON.stringify(getCodesRequest)}`);

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

    if (validateRequestBody(req, res, ajv, AddCodeRequestSchema, logger)) {
        const addCodeRequest = new AddCodeRequest(req.body);
        logger.debug(`addCodeRequest: ${JSON.stringify(addCodeRequest)}`);

        codesReceiveManager.addCode(addCodeRequest.code, (err, code) => {
            if (err) {
                next(err);
            } else {
                res.send(code);
            }
        })
    }
});

router.post('/LearnRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, LearnRequestSchema, logger)) {
        const learnRequest = LearnRequest.fromData(req.body);
        logger.debug(`learnRequest: ${JSON.stringify(learnRequest)}`);

        codesReceiveManager.stop();

        const { buttonName, receiverTopic, buttonTopic, startLevel, threshold } = learnRequest;

        codesReceiveManager.learnCode(buttonName, receiverTopic, buttonTopic, startLevel, threshold, (err, code) => {
            if (err) {
                next(err);
            } else {
                res.send(code);
            }
            codesReceiveManager.start();
        })
    }
});

export default router;
