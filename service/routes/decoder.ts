import express from 'express';
import * as Decoder from "../model/decode/Decoder";
import { DecodeRequest } from '../model/decode/DecodeRequest';
import { CodeRepository } from '../model/code/CodeRepository';
import { Code } from '../model/code/Code';

var router = express.Router();
// let codeRepository = new CodeRepository(); 

export default router.get('/', function(req: express.Request, res: express.Response, next : express.NextFunction) {
    res.send(`Welocme to decoder !
    Decode request:
    POST / 
    body: { times : Array<number> } 
    `);
});

router.post('/', function(req: express.Request, res: express.Response, next : express.NextFunction) {
    const decodeRequest = DecodeRequest.fromData(req.body);
    console.log(`decodeRequest: ${decodeRequest}`);
    
    let decodeResult = Decoder.decode(decodeRequest.times, decodeRequest.startLevel, decodeRequest.threshold);
    res.send(decodeResult);

    let code = new Code("RF868-1", decodeResult.values);
    // codeRepository.put(code);
}); 