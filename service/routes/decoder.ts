import express from 'express';
import HttpStatus from 'http-status-codes';
import * as Decoder from "../model/decode/Decoder";
import { DecodeRequest, DecodeRequestSchema } from '../model/decode/DecodeRequest';
import { CodeRepository } from '../model/code/CodeRepository';
import { Code } from '../model/code/Code';
import Ajv from 'ajv';
import { validateRequestBody } from '../utils/RequestValidation';

var router = express.Router();
let ajv = new Ajv({ allErrors: true });
let codeRepository = new CodeRepository();

router.post('/DecodeRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    if (validateRequestBody(req, res, ajv, DecodeRequestSchema)) {
        const decodeRequest = DecodeRequest.fromData(req.body);
        console.debug(`decodeRequest: ${JSON.stringify(decodeRequest)}`);

        let decodeResult = Decoder.decode(decodeRequest.times, decodeRequest.startLevel, decodeRequest.threshold);

        if (decodeRequest.saveToDB && decodeRequest.name !== undefined) {
            let code = new Code(decodeRequest.name, decodeResult.values);
            codeRepository.put(code, (err, code) => {
                if (err) {
                    next(err);
                } else {
                    res.send(decodeResult); 
                }
            });
        } else {
            res.send(decodeResult); 
        }
    }
});

export default router;