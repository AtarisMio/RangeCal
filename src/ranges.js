const Range = require('./range');

const flat = (array) =>
    array.reduce((arr, cur) => cur instanceof Array ? arr.concat(cur) : arr.concat([cur]), []);

class Ranges {
    constructor(rangeOrRanges) {
        if (rangeOrRanges === undefined) {
            this._ranges = [];
            return;
        }
        if (rangeOrRanges instanceof Ranges) {
            this._ranges = [...rangeOrRanges.ranges];
            return;
        }
        if (rangeOrRanges instanceof Range) {
            this._ranges = [rangeOrRanges];
            return;
        }
        if (rangeOrRanges instanceof Array && rangeOrRanges.every(r => r instanceof Range)) {
            this._ranges = [...rangeOrRanges];
            this.connect();
            return;
        }
        throw new TypeError('argument should be an instance of Range or Array<Range>');
    }

    get ranges() {
        return [...this._ranges];
    }

    get length() {
        return this.ranges.reduce((pre, cur) => pre + cur.length, 0);
    }

    get piece() {
        return this._ranges.length;
    }

    sort(method = Range.compareWithRange) {
        return this._ranges.sort(method);
    }

    connect() {
        return (this._ranges = Ranges.connect(this._ranges));
    }

    add(...ranges) {
        if (!(ranges.every(r => r instanceof Range))) {
            throw new TypeError('ranges should be instances of Range')
        }
        this._ranges.push(...ranges);
        return this.connect();
    }

    sub(...ranges) {
        if (!(ranges.every(r => r instanceof Range))) {
            throw new TypeError('ranges should be instances of Range')
        }
        ranges = Ranges.connect(ranges);
        ranges.map(op_r => {
            this._ranges = flat(this.ranges.map(r => r.sub(op_r)));
        });
        return this.connect();
    }

    contain(point) {
        return this.ranges.some(r => r.contian(point));
    }

    toString() {
        return `[${this.ranges.reduce((pre, cur) => (typeof pre === 'string' ? pre : pre.toString()) + ', ' + cur.toString() )}]`
    }
}

Ranges.convertFromArray = (array) => {
    if (!(array instanceof Array)) {
        throw TypeError('argument should be looking like [[number, number]]');
    }
    return new Ranges(array.map(Range.convertFromArray));
}

Ranges.connect = (ranges) => {
    if (!(ranges instanceof Array) || (ranges.some(r => !(r instanceof Range)))) {
        throw TypeError('ranges should be an instance of Array<Range>');
    }
    return ranges.sort(Range.compare).reduce((pre, cur, index) => {
        if (index === 0) {
            return [cur];
        } else {
            return pre.concat(pre.splice(-1)[0].add(cur));
        }
    }, []);
}

module.exports = exports = Ranges;
