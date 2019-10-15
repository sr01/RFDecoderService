import { Code } from "./Code";

export interface GetCodesRequestData {
    buttonName : string;
}

export class GetCodesRequest {
    buttonName : string;

    constructor(buttonName: string) {
        this.buttonName = buttonName;
    }

    static fromData(data: GetCodesRequestData): GetCodesRequest {
        return new GetCodesRequest(data.buttonName);
    }
}

export let GetCodesRequestSchema =
{
    "properties": {
        "buttonName": {
            "type": "string",
            "minLength" : 3,
            "maxLength" : 250
        }
    },
    "required": ["buttonName"]
};