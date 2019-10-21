import express from 'express';
import Ajv from 'ajv';
import { mainLogger, mqttPublisher } from '../app'
import { validateRequestBody } from '../utils/RequestValidation';
import { MqttPublishRequest, MqttPublishRequestSchema } from '../model/mqtt/MqttPublishRequest';

let logger = mainLogger.child({ label: "routes/codes" })
let router = express.Router();
let ajv = new Ajv({ allErrors: true });

router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.send("hello arduino!");
});

router.post('/publish', function (req: express.Request, res: express.Response, next: express.NextFunction) {

    logger.debug(`/mqtt/public req: ${req.body}`);
    
    if (validateRequestBody(req, res, ajv, MqttPublishRequestSchema, logger)) {
        const mqttPublishRequest = MqttPublishRequest.fromData(req.body);
        logger.debug(`mqttPublishRequest: ${JSON.stringify(mqttPublishRequest)}`);

        mqttPublisher.publish(mqttPublishRequest.topic, mqttPublishRequest.message, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.send(result);
            }
        });
    }
});

export default router;
