export interface LearnRequestData {
    buttonName: string,
    description: string,
    receiverTopic: string,
    buttonTopic: string
}

export class LearnRequest {
    buttonName: string;
    description?: string;
    receiverTopic: string;
    buttonTopic: string;

    constructor(buttonName: string, receiverTopic: string, buttonTopic: string, description?: string) {
        this.buttonName = buttonName;
        this.receiverTopic = receiverTopic;
        this.description = description;
        this.buttonTopic = buttonTopic;
    }

    static fromData(data: LearnRequestData): LearnRequest {
        return new LearnRequest(data.buttonName, data.receiverTopic, data.buttonTopic, data.description);
    }
}

export let LearnRequestSchema =
{
    "properties": {
        "buttonName": {
            "type": "string",
            "minLength": 3,
            "maxLength": 250
        },
        "receiverTopic": {
            "type": "string",
            "minLength": 1,
            "maxLength": 250
        },
        "buttonTopic": {
            "type": "string",
            "minLength": 1,
            "maxLength": 250
        },
        "description": {
            "type": "string",
            "minLength": 1,
            "maxLength": 250
        }
    },
    "required": ["buttonName", "receiverTopic", "buttonTopic"]
};