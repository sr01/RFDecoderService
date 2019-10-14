import { Code } from "./Code";

export interface AddCodeRequestData {
    name: String,
    values: Array<number>
}

export class AddCodeRequest {
    code: Code;

    constructor(code: Code) {
        this.code = code;
    }

    static fromData(data: AddCodeRequestData): AddCodeRequest {
        return new AddCodeRequest(new Code(data.name, data.values));
    }
}

export let AddCodeRequestSchema =
{
    "properties": {
        "name": {
            "type": "string",
            "minLength" : 3,
            "maxLength" : 250
        },
        "values": { 
            "type": "array",
            "items": [
                {
                    "type": "integer"
                }
            ],
            "minItems" : 1
        }
    },
    "required": ["name", "values"]
};