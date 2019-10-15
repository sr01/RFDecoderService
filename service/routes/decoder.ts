import express from 'express';
import HttpStatus from 'http-status-codes';
import * as Decoder from "../model/decode/Decoder";
import { DecodeRequest, DecodeRequestSchema } from '../model/decode/DecodeRequest';
import Ajv from 'ajv';
import { validateRequestBody } from '../utils/RequestValidation';

var router = express.Router();
let ajv = new Ajv({ allErrors: true });

router.post('/DecodeRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, DecodeRequestSchema)) {
        const decodeRequest = DecodeRequest.fromData(req.body);
        console.debug(`decodeRequest: ${JSON.stringify(decodeRequest)}`);

        let decodeResult = Decoder.decode(decodeRequest.times, decodeRequest.startLevel, decodeRequest.threshold);

        if (decodeRequest.saveToDB && decodeRequest.name !== undefined) {
            res.send(decodeResult); 
        } else {
            res.send(decodeResult); 
        }
    }
});

export default router;