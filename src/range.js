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

    get length() {
        return this.tail - this.head;
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
        return Range.compare(this, pointOrRange);
    }

    contian(point) {
        return this.compareWithPoint(point) === PandR.IN;
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

    add(range) {
        switch(this.compareWithRange(range)) {
            case RandR.TOTAL_BEFORE:
                return this.canAdjacent(range) ? [new Range(this.head, range.tail)] : [this, range];
            case RandR.HEAD_BEFORE:
                return [new Range(this.head, range.tail)];
            case RandR.CONTAIN:
                return [this];
            case RandR.INNER:
                return [range];
            case RandR.TAIL_AFTER:
                return [new Range(range.head, this.tail)];
            case RandR.TOTAL_AFTER:
                return this.canAdjacent(range) ? [new Range(range.head, this.tail)] : [range, this];
        }
    }

    sub(range) {
        switch(this.compareWithRange(range)) {
            case RandR.TOTAL_BEFORE:
                return [this];
            case RandR.HEAD_BEFORE:
                return [new Range(this.head, range.head -1)];
            case RandR.CONTAIN:
                return [new Range(this.head, range.head - 1), new Range(range.tail + 1, this.tail)];
            case RandR.INNER:
                return [];
            case RandR.TAIL_AFTER:
                return [new Range(range.tail + 1, this.tail)];
            case RandR.TOTAL_AFTER:
                return [this];
        }
    }

    toString() {
        return `[${this.head}, ${this.tail}]`;
    }
}

Range.convertFromArray = (array) => {
    if (!(array instanceof Array) || Number.isNaN(Number(array[0])) || Number.isNaN(Number(array[1])) ) {
        throw new TypeError('unsatisfied arguments, arguments should be looking like [number, number]');
    }
    return new Range(array[0], array[1]);
}

Range.compare = (range, pointOrRange) => {
    if (!(range instanceof Range)) {
        throw new TypeError('range should be a instance of Range');
    }
    if (pointOrRange instanceof Range) {
        return Range.compareWithRange(range, pointOrRange);            
    } else if (typeof pointOrRange === 'number') {
        return Range.compareWithPoint(range, pointOrRange);
    }
    throw new TypeError('second argument not a instance of Range or a number');
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
    return RandR_map[range2.compareWithPoint(range1.head)][range2.compareWithPoint(range1.tail)];
};

exports = module.exports = Range;