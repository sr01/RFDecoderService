import Settings from "../settings/Settings";
import { SignalMqttClient } from "../../view/mqtt/SignalMqttClient";
import { Code } from "./Code";
import { CodeRepository } from "./CodeRepository";
import { Callback } from "../../utils/Callback";

export let DETECT_TOPIC = "rds/detect";

export class CodesReceiveManager {

    private settings = Settings.getInstance();
    private mqttClient = new SignalMqttClient(this.settings.mqttClientSettings);
    private codeRepository = new CodeRepository();

    start() {
        this.mqttClient.beginReceiveSignals(DETECT_TOPIC, (err, signal) => {
            if (err) {
                console.error(`[CodesReceiveManager] receive error: ${err.message}`);
            } else {
                console.log(`[CodesReceiveManager] received signal: ${signal}`);
            }
        });
    }

    stop() {
        this.mqttClient.endReceiveSignals();
    }

    learnCode(topic: string, callback: Callback<Code>) {

        this.mqttClient.getSignalOnce(topic, (err, signal) => {
            if (err) {
                callback(err);
            }
            else {

                let code = new Code(name, signal!);
                //2. save code to db
                this.codeRepository.put(code, (err, code) => {
                    if (err) {
                        callback(err);
                    } else {
                        //3. return result
                        callback(undefined, code);
                    }
                });
            }
        })
    }

    addCode(code: Code, callback: Callback<Code>) {
        this.codeRepository.put(code, (err, code) => {
            if (err) {
                callback(err);
            } else {
                callback(undefined, code);
            }
        });
    }

    getCode(name: string, callback: Callback<Array<Code>>) {
        this.codeRepository.get(name, function (err: Error, codes: Array<Code>) {
            if (err) {
                callback(err);
            } else {
                callback(undefined, codes);
            }
        })
    }
}