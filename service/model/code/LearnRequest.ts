export interface LearnRequestData {
    name: string,
    description: string,
    topic: string,
}

export class LearnRequest {
    name: string;
    description?: string;
    topic: string;

    constructor(name: string, topic: string, description?: string) {
        this.name = name;
        this.topic = topic;
        this.description = description;
    }

    static fromData(data: LearnRequestData): LearnRequest {
        return new LearnRequest(data.name, data.topic, data.description);
    }
}

export let LearnRequestSchema =
{
    "properties": {
        "name": {
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
    "required": ["name", "topic"]
};