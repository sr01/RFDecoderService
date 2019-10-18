import { Levels } from "../decode/Levels";

export class Code {
    buttonName: string;
    buttonTopic: string;
    startLevel: Levels;
    threshold: number;
    signal: Array<number>;
    
    constructor(buttonName: string, buttonTopic: string, startLevel: Levels, threshold: number, signal: Array<number>) {
        this.buttonName = buttonName;
        this.buttonTopic = buttonTopic;
        this.startLevel = startLevel;
        this.threshold = threshold;
        this.signal = signal;
    }
}
