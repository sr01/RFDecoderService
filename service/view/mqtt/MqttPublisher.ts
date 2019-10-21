import * as mqtt from 'mqtt';
import * as ObjectUtils from '../../utils/ObjectUtils';
import { Packet } from 'mqtt';
import {mainLogger} from '../../app'
import { MqttClientSettings } from './MqttClientSettings';
import { Callback } from '../../utils/Callback';

let logger = mainLogger.child({ label: "MqttPublisher" });

export class MqttPublisher {

    private settings: MqttClientSettings;

    constructor(settings: MqttClientSettings) {
        this.settings = ObjectUtils.copy(settings);
    }

    publish(topic: string, message: string, callback : Callback<string>) {
        
        let client = mqtt.connect(this.settings);
        
        client.on('connect', () => {
            logger.debug(`mqtt connected.`)
            logger.debug(`publish to topic: ${topic}, message: ${message.substring(0, Math.min(50, message.length))}...`)
            
            client.publish(topic, message, (error?: Error, packet?: Packet)=>{
                if(error){
                    logger.error("publish error: " + error.message);
                    callback(error);
                }else{
                    logger.debug(`publish complete, packet: ${packet}`);
                    callback(undefined, "published successfully");
                }
                client.end();
            });

            client.on('offline', () => {
                logger.debug(`mqtt offline`)
            });

            client.on('disconnect', () => {
                logger.debug(`mqtt disconnect`)
            });

            client.on('close', () => {
                logger.debug(`mqtt close`)
            });
        })
    }
}