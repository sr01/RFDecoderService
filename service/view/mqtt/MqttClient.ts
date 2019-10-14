import * as mqtt from 'mqtt';
import * as ObjectUtils from '../../utils/ObjectUtils';

export interface MqttClientSettings {
    protocol: string,
    host: string,
    port: number,
    username: string,
    password: string
}

export class MqttClient {

    private settings: MqttClientSettings;

    constructor(settings: MqttClientSettings) {
        this.settings = ObjectUtils.copy(settings);
    }

    getTimeArray(topic: string, callback: (err?: Error, times? : Array<number>) => void){
        
        this.getFirstMessage(topic, (err, message)=>{
            if(err){
                callback(err);
            }else{
                let times = JSON.parse(message!).times
                callback(undefined, times);
            }
        })
    }

    getFirstMessage(topic: string, callback: (err?: Error, message? : string) => void) {

        console.log('mqtt connecting...')

        let client = mqtt.connect(this.settings);
        let isMessageReceived = false;
        
        client.on('connect', () => {
            console.log(`mqtt connect complete`)

            console.log(`mqtt subscribe to topic '${topic}'`)

            client.subscribe(topic, (err) => {
                if (err) {
                    console.log(`mqtt failed to subscribe: ${err.message}`);
                    client.end();
                    callback(err);
                }else{
                    console.log(`mqtt subscribe successfully`)
                }
            })

            client.on('message', (topic, buffer) => {
                let message = buffer.toString();
                console.log(`mqtt received - topic: ${topic}, message: ${message}`);
                isMessageReceived = true;
                client.end();

                callback(undefined, message);
            })

            client.on('offline', () => {
                console.log(`mqtt offline`)
                if(!isMessageReceived){
                    callback(Error("mqtt client offline"));
                }
            });

            client.on('disconnect', () => {
                console.log(`mqtt disconnect`)
                if(!isMessageReceived){
                    callback(Error("mqtt client disconnect"));
                }
            });

            client.on('close', () => {
                console.log(`mqtt close`)
                if(!isMessageReceived){
                    callback(Error("mqtt client closed"));
                }
            });
        })

    }
}