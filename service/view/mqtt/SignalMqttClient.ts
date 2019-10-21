import * as mqtt from 'mqtt';
import * as ObjectUtils from '../../utils/ObjectUtils';
import { Packet } from 'mqtt';
import {mainLogger} from '../../app'
import { MqttClientSettings } from './MqttClientSettings';

let logger = mainLogger.child({ label: "SignalMqttClient" });

export class SignalMqttClient { 

    private settings: MqttClientSettings;
    private isReceivingSignals: boolean = false;
    private receivingSignalsClient: mqtt.MqttClient | null = null;
    private DEFAULT_TIMEOUT_MILLIS = 10000;

    constructor(settings: MqttClientSettings) {
        this.settings = ObjectUtils.copy(settings);
    }

    publish(topic: string, message: string) {
        if (this.receivingSignalsClient != null) {
            this.receivingSignalsClient.publish(topic, message, (error?: Error, packet?: Packet) => {
                if (error) {
                    logger.error(`failed to publish, topic: ${topic}, message: ${message}`);
                }
            })
        }
    }

    beginReceiveSignals(topic: string, onSignalCallback: (err?: Error, signal?: Array<number>) => void) {

        if (!this.isReceivingSignals) {
            this.isReceivingSignals = true;

            logger.debug('mqtt connecting...')

            let client = mqtt.connect(this.settings);

            client.on('connect', () => {
                logger.debug(`mqtt connected.`)
                logger.debug(`mqtt subscribe to topic '${topic}'`)

                client.subscribe(topic, (err) => {
                    if (err) {
                        logger.error(`mqtt failed to subscribe: ${err.message}`);
                        client.end();
                        onSignalCallback(err);
                        this.isReceivingSignals = false;
                    } else {
                        logger.debug(`mqtt subscribe successfully`)
                    }
                })

                client.on('message', (topic, buffer) => {
                    try {
                        let message = buffer.toString();
                        logger.debug(`mqtt received - topic: ${topic}, message: ${message.substring(0, Math.min(50, message.length))}...`);

                        let signal = JSON.parse(message!).times
                        if (signal !== undefined && signal instanceof Array && signal.every(e => typeof e === "number")) {
                            onSignalCallback(undefined, signal);
                        }
                    } catch (e) {
                        logger.error(e)
                    }
                })

                client.on('offline', () => {
                    this.isReceivingSignals = false;
                    logger.debug(`mqtt offline`)
                });

                client.on('disconnect', () => {
                    this.isReceivingSignals = false;
                    logger.debug(`mqtt disconnect`)
                });

                client.on('close', () => {
                    this.isReceivingSignals = false;
                    logger.debug(`mqtt close`)
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

    getMessageOnce(topic: string, callback: (err?: Error, message?: string) => void, timeoutMilliseconds: number = this.DEFAULT_TIMEOUT_MILLIS) {

        logger.debug(`mqtt connecting...`)

        let client = mqtt.connect(this.settings);
        let isWaitingForMessage = true;
        let timer: NodeJS.Timeout | null = null;

        client.on('connect', () => {
            logger.debug(`mqtt connect complete`)
            logger.debug(`mqtt subscribe to topic '${topic}'`)

            client.subscribe(topic, (err) => {
                if (err) {
                    logger.error(`mqtt failed to subscribe: ${err.message}`);
                    client.end();
                    callback(err);
                } else {
                    logger.debug(`mqtt subscribe successfully`)

                    logger.debug(`timer set.`)

                    timer = setTimeout(function () {
                        logger.debug(`timeout!`)
                        isWaitingForMessage = false;
                        client.end();
                        callback(new Error("mqtt receive timeout"));
                    }, timeoutMilliseconds);
                }
            })

            client.on('message', (topic, buffer) => {
                try {
                    let message = buffer.toString();
                    logger.debug(`mqtt received - topic: ${topic}, message: ${message.substring(0, Math.min(50, message.length))}`);
                    isWaitingForMessage = false;
                    client.end();

                    if (timer) {
                        clearTimeout(timer);
                        logger.debug(`timer cleared.`)
                    }
                    callback(undefined, message);
                } catch (e) {
                    logger.error(e)
                    callback(e);
                }
            })

            client.on('offline', () => {
                logger.debug(`mqtt offline`)
                if (isWaitingForMessage) {
                    callback(Error("mqtt client offline"));
                }
            });

            client.on('disconnect', () => {
                logger.debug(`mqtt disconnect`)
                if (isWaitingForMessage) {
                    callback(Error("mqtt client disconnect"));
                }
            });

            client.on('close', () => {
                logger.debug(`mqtt close`)
                if (isWaitingForMessage) {
                    callback(Error("mqtt client closed"));
                }
            });
        })

    }
}