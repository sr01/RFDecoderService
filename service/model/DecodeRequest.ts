import { Levels } from "./Levels";

export interface DecodeRequestData {
    times: Array<number>,
    startLevel: Levels, 
    threshold: number,
}

export class DecodeRequest {
    times: Array<number>;
    startLevel: Levels;
    threshold: number;

    constructor(times: Array<number>, startLevel: Levels = Levels.Low, threshold: number = 50) {
        this.times = times;
        this.startLevel = startLevel;
        this.threshold = threshold;
    }

    static fromData(data : DecodeRequestData) : DecodeRequest {
        return new DecodeRequest(data.times, data.startLevel, data.threshold)
    }
}
