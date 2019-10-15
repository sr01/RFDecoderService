import * as mqtt from 'mqtt';
import * as ObjectUtils from '../../utils/ObjectUtils';
import { Code } from '../../model/code/Code';

export interface MqttClientSettings {
    protocol: string,
    host: string,
    port: number,
    username: string,
    password: string
}

export class SignalMqttClient {

    private settings: MqttClientSettings;
    private isReceivingSignals: boolean = false;
    private receivingSignalsClient: mqtt.MqttClient | null = null;

    constructor(settings: MqttClientSettings) {
        this.settings = ObjectUtils.copy(settings);
    }

    beginReceiveSignals(topic: string, onSignalCallback: (err?: Error, signal?: Array<number>) => void) {
        if (!this.isReceivingSignals) {
            this.isReceivingSignals = true;

            console.debug('[SignalMqttClient] mqtt connecting...')

            let client = mqtt.connect(this.settings);

            client.on('connect', () => {
                console.debug(`[SignalMqttClient] mqtt connect complete`)

                console.debug(`[SignalMqttClient] mqtt subscribe to topic '${topic}'`)

                client.subscribe(topic, (err) => {
                    if (err) {
                        console.error(`[SignalMqttClient] mqtt failed to subscribe: ${err.message}`);
                        client.end();
                        onSignalCallback(err);
                        this.isReceivingSignals = false;
                    } else {
                        console.debug(`[SignalMqttClient] mqtt subscribe successfully`)
                    }
                })

                client.on('message', (topic, buffer) => {
                    try {
                        let message = buffer.toString();
                        console.debug(`[SignalMqttClient] mqtt received - topic: ${topic}, message: ${message}`);

                        let signal = JSON.parse(message!).times
                        if (signal !== undefined && signal instanceof Array && signal.every(e => typeof e === "number")) {
                            onSignalCallback(undefined, signal);
                        }
                    } catch (e) { 
                        console.error(e)
                    }
                })

                client.on('offline', () => {
                    this.isReceivingSignals = false;
                    console.debug(`[SignalMqttClient] mqtt offline`)
                });

                client.on('disconnect', () => {
                    this.isReceivingSignals = false;
                    console.debug(`[SignalMqttClient] mqtt disconnect`)
                });

                client.on('close', () => {
                    this.isReceivingSignals = false;
                    console.debug(`[SignalMqttClient] mqtt close`)
                });
            })

            this.receivingSignalsClient = client;
        }
    }

    endReceiveSignals() {
        if (this.isReceivingSignals) {
            this.isReceivingSignals = false;

            this.receivingSignalsClient!.end();
            this.receivingSignalsClient = null;
        }
    }

    getSignalOnce(topic: string, signalCallback: (err?: Error, signal?: Array<number>) => void) {

        this.getMessageOnce(topic, (err, message) => {
            if (err) {
                signalCallback(err);
            } else {
                let signal = JSON.parse(message!).times as Array<number>
                if (signal === undefined || signal.length == 0) {
                    signalCallback(new Error(""));
                } else {
                    signalCallback(undefined, signal);
                }

            }
        })
    }

    getMessageOnce(topic: string, callback: (err?: Error, message?: string) => void) {

        console.debug(`[SignalMqttClient] mqtt connecting...`)

        let client = mqtt.connect(this.settings);
        let isMessageReceived = false;

        client.on('connect', () => {
            console.debug(`[SignalMqttClient] mqtt connect complete`)

            console.debug(`[SignalMqttClient] mqtt subscribe to topic '${topic}'`)

            client.subscribe(topic, (err) => {
                if (err) {
                    console.error(`[SignalMqttClient] mqtt failed to subscribe: ${err.message}`);
                    client.end();
                    callback(err);
                } else {
                    console.debug(`[SignalMqttClient] mqtt subscribe successfully`)
                }
            })

            client.on('message', (topic, buffer) => {
                let message = buffer.toString();
                console.debug(`[SignalMqttClient] mqtt received - topic: ${topic}, message: ${message}`);
                isMessageReceived = true;
                client.end();

                callback(undefined, message);
            })

            client.on('offline', () => {
                console.debug(`[SignalMqttClient] mqtt offline`)
                if (!isMessageReceived) {
                    callback(Error("mqtt client offline"));
                }
            });

            client.on('disconnect', () => {
                console.debug(`[SignalMqttClient] mqtt disconnect`)
                if (!isMessageReceived) {
                    callback(Error("mqtt client disconnect"));
                }
            });

            client.on('close', () => {
                console.debug(`[SignalMqttClient] mqtt close`)
                if (!isMessageReceived) {
                    callback(Error("mqtt client closed"));
                }
            });
        })

    }
}