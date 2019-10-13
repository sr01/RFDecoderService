import express from 'express';
import * as Decoder from "../model/decoder";
import { DecodeRequest } from '../model/DecodeRequest';

var router = express.Router();

export default router.get('/', function(req: express.Request, res: express.Response, next : express.NextFunction) {
    res.send(`Welocme to decoder !
    Decode request:
    POST / 
    body: { times : Array<number> } 
    `);
});

router.post('/', function(req: express.Request, res: express.Response, next : express.NextFunction) {
    const decodeRequest = DecodeRequest.fromData(req.body);
    console.log(decodeRequest);
    let decodeResult = Decoder.decode(decodeRequest.times, decodeRequest.startLevel, decodeRequest.threshold);
    res.send(decodeResult);
});
