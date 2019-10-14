export interface LearnRequestData {
    buttonName: string,
    description: string,
    topic: string,
}

export class LearnRequest {
    buttonName: string;
    description?: string;
    topic: string;

    constructor(buttonName: string, topic: string, description?: string) {
        this.buttonName = buttonName;
        this.topic = topic;
        this.description = description;
    }

    static fromData(data: LearnRequestData): LearnRequest {
        return new LearnRequest(data.buttonName, data.topic, data.description);
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
        "topic": {
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
    "required": ["buttonName", "topic"]
};