export class Code {
    buttonName: string;
    buttonTopic: string;
    signal: Array<number>;
    
    constructor(buttonName: string, buttonTopic: string, signal: Array<number>) {
        this.buttonName = buttonName;
        this.buttonTopic = buttonTopic;
        this.signal = signal;
    }
}
