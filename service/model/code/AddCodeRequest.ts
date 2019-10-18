import { Code } from "./Code";

export interface AddCodeRequestData {
    code : Code
}

export class AddCodeRequest {
    code: Code;

    constructor(code: Code) {
        this.code = code;
    }
}

export let AddCodeRequestSchema =
{
    "properties": {
        "code" : {
            "type": "object",
            "properties": {
                "buttonName": {
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 250
                },
                "buttonTopic": {
                    "type": "string",
                    "minLength": 3,
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
                "signal": {
                    "type": "array",
                    "items": [
                        {
                            "type": "integer"
                        }
                    ],
                    "minItems": 1
                }
            },
            "required": ["buttonName", "buttonTopic","startLevel", "threshold", "signal"]
        },        
    },
    "required": ["code"]
};