
export interface MqttPublishRequestData {
    topic: string,
    message: any
}

export class MqttPublishRequest {
    topic: string;
    message: any;
    constructor(topic: string, message: any) {
        this.topic = topic;
        this.message = message;
    }
    static fromData(data: MqttPublishRequestData): MqttPublishRequest {
        return new MqttPublishRequest(data.topic, data.message);
    }
}

export let MqttPublishRequestSchema =
{
    "properties": {
        "topic": {
            "type": "string",
            "minLength" : 3,
            "maxLength" : 250
        },
        "message" : {
            "type" : "object" 
        }
    },
    "required": ["topic", "message"]
};
