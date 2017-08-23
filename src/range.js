const { PandR, RandR, RandR_map } = require('./relations');

class Range {
    constructor(headOrInstance, tail) {
        if (headOrInstance instanceof Range) {
            this.head = headOrInstance.head;
            this.tail = headOrInstance.tail;
            return;
        } else if (typeof headOrInstance === 'number' && typeof tail === 'number') {
            this.head = headOrInstance;
            this.tail = tail;
            return;
        }
        throw new TypeError('arguments has wrong types');
    }

    get head() {
        return this._head;
    }

    set head(val) {
        if (!this.tail || this.tail >= Number(val)) {
            this._head = Number(val);
        } else {
            throw new RangeError('Head cannot greater then tail');
        }
    }

    get tail() {
        return this._tail;
    }

    set tail(val) {
        if (this.head <= Number(val)) {
            this._tail = Number(val);
        } else {
            throw new RangeError('Head cannot greater then tail');
        }
    }

    compareWithPoint(point) {
        if (typeof point === 'number') {
            return Range.compareWithPoint(this, point);
        }
        throw new TypeError('argument should be a number');
    }

    compareWithRange(range) {
        if (range instanceof Range) {
            return Range.compareWithRange(this, range);
        }            
        throw new TypeError('argument should be a instance of Range');
    }

    compare(pointOrRange) {
        if (pointOrRange instanceof Range) {
            return this.compareWithRange(pointOrRange);            
        } else if (typeof pointOrRange === 'number') {
            return this.compareWithPoint(pointOrRange);
        }
        throw new TypeError('argument not a instance of Range or a number');
    }

    canAdjacent(range) {
        if (range instanceof Range) {
            if ((range.head === this.tail + 1) && Number.isSafeInteger(range.head)) {
                return true;
            }
            if ((this.head === range.tail + 1) && Number.isSafeInteger(this.head)) {
                return true;
            }
            return false;
        }
        throw new TypeError('argument should be a instance of Range');
    }

    addRange(range) {
        switch(this.compareWithRange(range)) {
            case RandR.TOTAL_BEFORE:
                return this.canAdjacent(range)
                    ? [new Range(range.head, this.tail)]
                    : [range, this];
            case RandR.HEAD_BEFORE:
                return [new Range(range.head, this.tail)];
            case RandR.CONTAIN:
                return [range];
            case RandR.INNER:
                return [this];
            case RandR.TAIL_AFTER:
                return [new Range(this.head, range.tail)];
            case RandR.TOTAL_AFTER:
                return this.canAdjacent(range) ? [new Range(this.head, range.tail)] : [this, range];
        }
    }

    subRange(range) {
        switch(this.compare(range)) {
            case RandR.TOTAL_BEFORE:
                return [this];
            case RandR.HEAD_BEFORE:
                return [new Range(range.tail + 1, this.tail)];
            case RandR.CONTAIN:
                return [];
            case RandR.INNER: {
                const sameHead = this.head === range.head;
                const sameTail = this.tail === range.tail;
                if (sameHead && sameTail) {
                    return [];
                }
                if (sameHead) {
                    return [new Range(range.tail + 1, this.tail)];
                }
                if (sameTail) {
                    return [new Range(this.head, range.head - 1)];
                }
                return [new Range(this.head, range.head - 1), new Range(range.tail + 1, this.tail)];
            }
            case RandR.TAIL_AFTER:
                return [new Range(this.head, range.head -1)];
            case RandR.TOTAL_AFTER:
                return [this];
        }
    }

    toString() {
        return `[${this.head}, ${this.tail}]`;
    }
}

Range.compareWithPoint = (range, point) => {
    if (!(range instanceof Range)) {
        throw new TypeError('range should be a instance of Range');
    }
    if (!(typeof point === 'number')) {
        throw new TypeError('point should be a number');
    }
    if (point < range.head) {
        return PandR.BEFORE;
    }
    if (point > range.tail) {
        return PandR.AFTER;
    }
    return PandR.IN;
};

Range.compareWithRange = (range1, range2) => {
    if (!(range1 instanceof Range) || !(range2 instanceof Range)) {
        throw new TypeError('arguments should be instances of Range');
    }
    return RandR_map[range1.compareWithPoint(range2.head)][range1.compareWithPoint(range2.tail)];
};

exports = module.exports = Range;