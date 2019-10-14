import { Levels } from "./Levels";

export interface DecodeRequestData {
    times: Array<number>,
    startLevel: Levels, 
    threshold: number,
    saveToDB: boolean,
    name? : string
}

export class DecodeRequest {
    times: Array<number>;
    startLevel: Levels;
    threshold: number;
    saveToDB: boolean;
    name? : string;
    
    constructor(times: Array<number>, startLevel: Levels = Levels.Low, threshold: number = 50, saveToDB: boolean = false, name? : string) {
        this.times = times;
        this.startLevel = startLevel;
        this.threshold = threshold;
        this.saveToDB = saveToDB;
        this.name = name;
    }

    static fromData(data : DecodeRequestData) : DecodeRequest {
        return new DecodeRequest(data.times, data.startLevel, data.threshold, data.saveToDB, data.name)
    }
}

export let DecodeRequestSchema =
{
    "properties": {
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
        "times": { 
            "type": "array",
            "items": [
                {
                    "type": "integer"
                }
            ],
            "minItems" : 1
        },
        "saveToDB" : {
            "type" : "boolean"
        },
        "name": {
            "type": "string",
            "minLength" : 3,
            "maxLength" : 250
        }
    },
    "required": ["times"],
    "if": {
        "properties": {
          "saveToDB": { "const": true }
        },
        "required": ["saveToDB"]
      },
      "then": { "required": ["name"] }
};