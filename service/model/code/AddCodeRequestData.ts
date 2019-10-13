import { Code } from "./Code";

export interface AddCodeRequestData {
    code: Code;
}

export class AddCodeRequest {
    code: Code;

    constructor(code: Code) {
        this.code = code;
    }

    static fromData(data: AddCodeRequestData): AddCodeRequest {
        return new AddCodeRequest(data.code);
    }
}