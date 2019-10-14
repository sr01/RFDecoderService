import express from 'express';
import HttpStatus from 'http-status-codes';
import * as Decoder from "../model/decode/Decoder";
import { DecodeRequest, DecodeRequestSchema } from '../model/decode/DecodeRequest';
import { CodeRepository } from '../model/code/CodeRepository';
import { Code } from '../model/code/Code';
import Ajv from 'ajv';

var router = express.Router();
let ajv = new Ajv({ allErrors: true });
let codeRepository = new CodeRepository();

router.post('/DecodeRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    let valid = ajv.validate(DecodeRequestSchema, req.body);

    if (!valid) {
        console.log(ajv.errors);
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ajv.errors!.map(err => `${err.dataPath} ${err.message}`));

    } else {

        const decodeRequest = DecodeRequest.fromData(req.body);
        console.log(`decodeRequest: ${JSON.stringify(decodeRequest)}`);

        let decodeResult = Decoder.decode(decodeRequest.times, decodeRequest.startLevel, decodeRequest.threshold);

        if (decodeRequest.saveToDB && decodeRequest.name !== undefined) {
            let code = new Code(decodeRequest.name, decodeResult.values);
            codeRepository.put(code, (err, code) => {
                if (err) {
                    res.send(`error: ${err.message}`)
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