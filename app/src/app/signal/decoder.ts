export enum Levels {
    Low = 0,
    High = 1
}

export class DecodeResult {
    buckets: Array<number>;
    values: Array<number>;

    constructor(buckets: Array<number>, values: Array<number>) {
        this.buckets = buckets;
        this.values = values;
    }
}

export function decode(times: Array<number>, startLevel: Levels, threshold: number): DecodeResult {

    let buckets = createBuckets(times, threshold);
    let decoded = new Array<number>();

    times.forEach(time => {

        let bucketIndex = findBucket(buckets, time);
        decoded.push(bucketIndex);
    })

    return new DecodeResult(buckets, decoded);
}

function createBuckets(times: Array<number>, threshold: number): Array<number> {
    let uniqueTimes = new Set<number>(times)
    let sortedTimes = Array.from(uniqueTimes).sort(function (a, b) { return a - b })

    let groups = new Array<number>()
    groups.push(sortedTimes[0])
    let groupIndex = 0

    for (var i = 1; i < sortedTimes.length; i++) {
        let a = sortedTimes[i]
        let b = groups[groupIndex]
        let dt = Math.abs(a - b)

        if (dt < threshold) {
            let avg = Math.round((a + b) / 2)
            groups[groupIndex] = avg
        } else {
            groupIndex++
            groups[groupIndex] = a
        }
    }

    return groups
}

function findBucket(buckets: Array<number>, time: number): number {
    let ds = buckets.map(function (bucket, index) {
        return {
            index: index,
            value: Math.abs(bucket - time)
        }
    })

    ds = ds.sort(function (a, b) { return a.value - b.value })
    let bucketIndex = ds[0].index
    return bucketIndex
}
