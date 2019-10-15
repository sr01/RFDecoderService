import { Code } from "./Code";

export interface AddCodeRequestData {
    buttonName: string,
    buttonTopic: string,
    signal: Array<number>
}

export class AddCodeRequest {
    code: Code;

    constructor(code: Code) {
        this.code = code;
    }

    static fromData(data: AddCodeRequestData): AddCodeRequest {
        return new AddCodeRequest(new Code(data.buttonName, data.buttonTopic, data.signal));
    }
}

export let AddCodeRequestSchema =
{
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
    "required": ["buttonName", "buttonTopic", "signal"]
};