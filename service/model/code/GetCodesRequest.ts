import { Code } from "./Code";

export interface GetCodesRequestData {
    name : string;
}

export class GetCodesRequest {
    name : string;

    constructor(name: string) {
        this.name = name;
    }

    static fromData(data: GetCodesRequestData): GetCodesRequest {
        return new GetCodesRequest(data.name);
    }
}

export let GetCodesRequestSchema =
{
    "properties": {
        "name": {
            "type": "string",
            "minLength" : 3,
            "maxLength" : 250
        }
    },
    "required": ["name"]
};