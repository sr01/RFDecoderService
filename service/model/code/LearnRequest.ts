import { Levels } from "../decode/Levels";

export interface LearnRequestData {
    buttonName: string,
    description: string,
    receiverTopic: string,
    buttonTopic: string,
    startLevel: Levels,
    threshold: number;
}

export class LearnRequest {
    buttonName: string;
    description?: string;
    receiverTopic: string;
    buttonTopic: string;
    startLevel: Levels;
    threshold: number;

    constructor(buttonName: string, receiverTopic: string, buttonTopic: string, startLevel: Levels, threshold: number, description?: string) {
        this.buttonName = buttonName;
        this.receiverTopic = receiverTopic;
        this.description = description;
        this.buttonTopic = buttonTopic;
        this.startLevel = startLevel;
        this.threshold = threshold;
    }

    static fromData(data: LearnRequestData): LearnRequest {
        return new LearnRequest(data.buttonName, data.receiverTopic, data.buttonTopic, data.startLevel, data.threshold, data.description);
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
        "startLevel": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1
        },
        "threshold": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
        },
        "description": {
            "type": "string",
            "minLength": 1,
            "maxLength": 250
        }
    },
    "required": ["buttonName", "receiverTopic", "buttonTopic", "startLevel", "threshold"]
};