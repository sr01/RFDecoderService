import * as Decoder from './decoder';
import { Levels } from "./Levels";

export class DecodeResult {
    buckets: Array<number>;
    values: Array<number>;
    startLevel: Levels;
    threshold: number;

    constructor(buckets: Array<number>, values: Array<number>, startLevel: Levels, threshold: number) {
        this.buckets = buckets;
        this.values = values;
        this.startLevel = startLevel;
        this.threshold = threshold;
    }
}
