import express from 'express';
import { CodeRepository } from '../model/code/CodeRepository';
import { Code } from '../model/code/Code';
import { AddCodeRequest } from '../model/code/AddCodeRequestData';
import { GetCodesRequest } from '../model/code/GetCodesRequest';

var router = express.Router();
let codeRepository = new CodeRepository(); 

export default router.post('/GetCodesRequest', function(req: express.Request, res: express.Response, next : express.NextFunction) {
    const getCodesRequest = GetCodesRequest.fromData(req.body);
    
    codeRepository.get(getCodesRequest.name, function(err : Error, codes : Array<Code>){
        res.send(codes);
    })
});

router.post('/AddCodeRequest', function(req: express.Request, res: express.Response, next : express.NextFunction) {
    const addCodeRequest = AddCodeRequest.fromData(req.body);
    console.log(`addCodeRequest: ${addCodeRequest}`);

    codeRepository.put(addCodeRequest.code);
    res.send("success");
});