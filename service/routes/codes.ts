import express from 'express';
import HttpStatus from 'http-status-codes';
import { CodeRepository } from '../model/code/CodeRepository';
import { Code } from '../model/code/Code';
import { AddCodeRequest, AddCodeRequestSchema } from '../model/code/AddCodeRequest';
import { GetCodesRequest, GetCodesRequestSchema } from '../model/code/GetCodesRequest';
import Ajv from 'ajv';
import { LearnRequestSchema, LearnRequest } from '../model/code/LearnRequest';
import { MqttClient } from '../view/mqtt/MqttClient';
import Settings from '../model/settings/Settings';
import * as mqtt from 'mqtt';

var router = express.Router();
let codeRepository = new CodeRepository();
let ajv = new Ajv({ allErrors: true });
let settings = Settings.getInstance();
let mqttClient = new MqttClient(settings.mqttClientSettings);

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


router.post('/LearnRequest', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    let valid = ajv.validate(LearnRequestSchema, req.body);

    if (!valid) {
        console.log(ajv.errors);
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ajv.errors!.map(err => `${err.dataPath} ${err.message}`));

    } else {
        const learnRequest = LearnRequest.fromData(req.body);
        console.log(`learnRequest: ${JSON.stringify(learnRequest)}`);

        //TODO: 
        //1. subscribe to mqtt
        // mqttClient.subscribe(learnRequest.topic)
        //2. wait for code publish 

        mqttClient.getTimeArray(learnRequest.topic, (err, times) => {
            if (err) {
                next(err);
            }
            else {
                //3. save it to db

                //4. return result
                res.send(times);
            }
        })
    }
});

export default router;