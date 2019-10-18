import Settings from "../settings/Settings";
import { SignalMqttClient } from "../../view/mqtt/SignalMqttClient";
import { Code } from "./Code";
import { CodeRepository } from "./CodeRepository";
import { Callback } from "../../utils/Callback";
import * as Decoder from "../decode/Decoder";
import { Levels } from "../decode/Levels";
export let DETECT_TOPIC = "rds/detect";

export class CodesReceiveManager {

    private settings = Settings.getInstance();
    private mqttClient = new SignalMqttClient(this.settings.mqttClientSettings);
    private codeRepository = new CodeRepository();

    start() {
        console.log(`[CodesReceiveManager] start`);

        this.mqttClient.beginReceiveSignals(DETECT_TOPIC, (err, signal) => {
            if (err) {
                console.error(`[CodesReceiveManager] receive error: ${err.message}`);
            } else {
                console.log(`[CodesReceiveManager] received signal: ${signal}`);

                this.codeRepository.findBySignal(signal!, (err, code) => {
                    if (err) {
                        console.error(`[CodesReceiveManager] failed to find code. Error: ${err}`);
                    } else {
                        if (code) {
                            console.log(`[CodesReceiveManager] found code: ${code.buttonName}`);
                            this.mqttClient.publish(code.buttonTopic, "ON")
                        }
                    }
                });
            }
        });
    }

    stop() {
        console.log(`[CodesReceiveManager] stop`);
        this.mqttClient.endReceiveSignals();
    }

    learnCode(buttonName: string, receiverTopic: string, buttonTopic: string, startLevel: Levels, threshold: number, callback: Callback<Code>) {

        this.mqttClient.getSignalOnce(receiverTopic, (err, signal) => {
            if (err) {
                callback(err);
            }
            else {

                //2. decode
                let decodeResult = Decoder.decode(signal!, startLevel, threshold);
                let code = new Code(buttonName, buttonTopic, startLevel, threshold, decodeResult.values!);
                
                //3. save code to db
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

    getCode(buttonName: string, callback: Callback<Array<Code>>) {
        this.codeRepository.get(buttonName, function (err: Error, codes: Array<Code>) {
            if (err) {
                callback(err);
            } else {
                callback(undefined, codes);
            }
        })
    }
}