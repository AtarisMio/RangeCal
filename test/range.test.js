const Range = require('./../src/range');
const { PandR, RandR } = require('./../src/relations');
const assert = require('assert');

describe('Range', () => {
    describe('construction', () => {
        it('new Range(1, 2), should return a Range instance with head=1, tail=2', () => {
            const r = new Range(1, 2);
            assert(r instanceof Range);
            assert(r.head === 1);
            assert(r.tail === 2);
        });
        it('new Range(2, 1), should get a RangeError, head can\'t greater than tail', () => {
            assert.throws(() => new Range(2, 1), e => e instanceof RangeError);
        });
        it('new Range from a Range instance, should get a same Range', () => {
            const r = new Range(0, 1);
            const r1 = new Range(r);
            assert(r1.head === r.head);
            assert(r1.tail === r.tail);
        });
        it('new Range(), should get a TypeError', () => {
            assert.throws(() => new Range(), e => e instanceof TypeError);
        });
    });
    describe('convertFromArray', () => {
        it('[static convertFromArray] create Range instance from array [0, 3]', () => {
            const r = Range.convertFromArray([0, 3]);
            assert(r.head === 0);
            assert(r.tail === 3);
        });
        it('[static convertFromArray] create Range instance from array [{a: 1}, [111]], should get a TypeError', () => {
            assert.throws(() => Range.convertFromArray([{a: 1}, [111]]), e => e instanceof TypeError);
        });
        it('[static convertFromArray] create Range instance from array {a: 1}, should get a TypeError', () => {
            assert.throws(() => Range.convertFromArray({a: 1}), e => e instanceof TypeError);
        });
    })
    describe('getter setter', () => {
        it('set (head) = 1, in range [0, 2], should get a RangeError', () => {
            const r = new Range(0, 2);
            assert.doesNotThrow(() => r.head = 1);
            assert(r.head === 1);
        });
        it('set (tail) = 3, in range [0, 2], should success', () => {
            const r = new Range(0, 2);
            assert.doesNotThrow(() => r.tail = 3);
            assert(r.tail === 3);
        });
        it('set (tail) = 1, in range [0, 2], should success', () => {
            const r = new Range(0, 2);
            assert.doesNotThrow(() => r.tail = 1);
            assert(r.tail === 1);
        });
        it('set (tail) = 0, in range [0, 2], should success', () => {
            const r = new Range(0, 2);
            assert.doesNotThrow(() => r.tail = 0);
            assert(r.tail === 0);
        });
        it('set (head) = 3, in range [0, 2], should get a RangeError', () => {
            const r = new Range(0, 2);
            assert.throws(() => r.head = 3, e => e instanceof RangeError);
            assert(r.head !== 3);
            assert(r.head === 0);
        });
        it('set (tail) = -1, in range [0, 2], should get a RangeError', () => {
            const r = new Range(0, 2);
            assert.throws(() => r.tail = -1, e => e instanceof RangeError);
            assert(r.tail !== -1);
            assert(r.tail === 2);
        });
        it('get (length) of range [1, 3], should get 2', () => {
            const r = new Range(1, 3);
            assert(r.length === 2);
        });
    });
    describe('compare', () => {
        it('[static compareWithPoint] any with not a range, should get TypeError', () => {
            assert.throws(() => Range.compareWithPoint({a: 1}, {a: 1}), e => e instanceof TypeError);
            assert.throws(() => Range.compareWithPoint({a: 1}, 1), e => e instanceof TypeError);
        });
        it('[static compareWithPoint] NaN with range [0, 3], should get TypeError', () => {
            assert.throws(() => Range.compareWithPoint(new Range(0, 3), {a: 1}), e => e instanceof TypeError);
        });
        it('[static compareWithRange] not a range with not a range, should get TypeError', () => {
            assert.throws(() => Range.compareWithRange({a: 1}, {a: 1}), e => e instanceof TypeError);
            assert.throws(() => Range.compareWithRange({a: 1}, new Range(0, 1)), e => e instanceof TypeError);
            assert.throws(() => Range.compareWithRange(new Range(0, 1), {a: 1}), e => e instanceof TypeError);
        });
        it('[static compare] not a range with not a range, should get TypeError', () => {
            assert.throws(() => Range.compare({a: 1}, 11), e => e instanceof TypeError);
        });
        it('[compare] NaN with range [0, 3], should get TypeError', () => {
            assert.throws(() => new Range(0, 3).compare({a: 1}), e => e instanceof TypeError);
        });
        it('[compare] point 1 and range [0, 3], should get IN', () => {
            assert(new Range(0, 3).compare(1) === PandR.IN);
        });
        it('[compare] point 1 and range [1, 3], should get IN', () => {
            assert(new Range(1, 3).compare(1) === PandR.IN);
        });
        it('[compare] point 3 and range [1, 3], should get IN', () => {
            assert(new Range(1, 3).compare(3) === PandR.IN);
        });
        it('[compare] point -1 and range [1, 3], should get BEFORE', () => {
            assert(new Range(1, 3).compare(-1) === PandR.BEFORE);
        });
        it('[compare] point 5 and range [1, 3], should get AFTER', () => {
            assert(new Range(1, 3).compare(5) === PandR.AFTER);
        });
        it('[compare] range [0, 3] and range [4, 6], should get TOTAL_BEFORE', () => {
            assert(new Range(0, 3).compare(new Range(4, 6)) === RandR.TOTAL_BEFORE);
        });
        it('[compare] range [0, 3] and range [1, 4], should get HEAD_BEFORE', () => {
            assert(new Range(0, 3).compare(new Range(1, 4)) === RandR.HEAD_BEFORE);
        });
        it('[compare] range [0, 3] and range [-1, 4], should get INNER', () => {
            assert(new Range(0, 3).compare(new Range(-1, 4)) === RandR.INNER);
        });
        it('[compare] range [0, 3] and range [1, 2], should get CONTAIN', () => {
            assert(new Range(0, 3).compare(new Range(1, 2)) === RandR.CONTAIN);
        });
        it('[compare] range [0, 3] and range [-3, 1], should get TAIL_AFTER', () => {
            assert(new Range(0, 3).compare(new Range(-3, 1)) === RandR.TAIL_AFTER);
        });
        it('[compare] range [0, 3] and range [-3, -1], should get TOTAL_AFTER', () => {
            assert(new Range(0, 3).compare(new Range(-3, -1)) === RandR.TOTAL_AFTER);
        });
        it('[compareWithPoint] point 1 and range [0, 3], should get IN', () => {
            assert(new Range(0, 3).compareWithPoint(1) === PandR.IN);
        });
        it('[compareWithPoint] point 1 and range [1, 3], should get IN', () => {
            assert(new Range(1, 3).compareWithPoint(1) === PandR.IN);
        });
        it('[compareWithPoint] point 3 and range [1, 3], should get IN', () => {
            assert(new Range(1, 3).compareWithPoint(3) === PandR.IN);
        });
        it('[compareWithPoint] point -1 and range [1, 3], should get BEFORE', () => {
            assert(new Range(1, 3).compareWithPoint(-1) === PandR.BEFORE);
        });
        it('[compareWithPoint] point 5 and range [1, 3], should get AFTER', () => {
            assert(new Range(1, 3).compareWithPoint(5) === PandR.AFTER);
        });
        it('[compareWithPoint] point 5 and range [1, 3], should get AFTER', () => {
            assert.throws(() => new Range(1, 3).compareWithPoint('aaaa'), e => e instanceof TypeError);
        });
        it('[compareWithRange] range [0, 3] and range [4, 6], should get TOTAL_BEFORE', () => {
            assert(new Range(0, 3).compareWithRange(new Range(4, 6)) === RandR.TOTAL_BEFORE);
        });
        it('[compareWithRange] range [0, 3] and range [1, 4], should get HEAD_BEFORE', () => {
            assert(new Range(0, 3).compareWithRange(new Range(1, 4)) === RandR.HEAD_BEFORE);
        });
        it('[compareWithRange] range [0, 3] and range [-1, 4], should get INNER', () => {
            assert(new Range(0, 3).compareWithRange(new Range(-1, 4)) === RandR.INNER);
        });
        it('[compareWithRange] range [0, 3] and range [1, 2], should get CONTAIN', () => {
            assert(new Range(0, 3).compareWithRange(new Range(1, 2)) === RandR.CONTAIN);
        });
        it('[compareWithRange] range [0, 3] and range [-3, 1], should get TAIL_AFTER', () => {
            assert(new Range(0, 3).compareWithRange(new Range(-3, 1)) === RandR.TAIL_AFTER);
        });
        it('[compareWithRange] range [0, 3] and range [-3, -1], should get TOTAL_AFTER', () => {
            assert(new Range(0, 3).compareWithRange(new Range(-3, -1)) === RandR.TOTAL_AFTER);
        });
        it('[compareWithRange] range [0, 3] and {a: 1}, should get a TypeError', () => {
            assert.throws(() => new Range(0, 3).compareWithRange({a: 1}), e => e instanceof TypeError);
        });
    });
    describe('contian', () => {
        it('[contain] range [0, 2] and point 1, should return true', () => {
            assert(new Range(0, 2).contian(1));
        });
        it('[contain] range [0, 2] and point 3, should return false', () => {
            assert(new Range(0, 2).contian(3) === false);
        });
    })
    describe('canAdjacent', () => {
        it('[canAdjacent] range [0, 2] and range [3, 4]', () => {
            assert(new Range(0, 2).canAdjacent(new Range(3, 4)));
        });
        it('[canAdjacent] range [0, 2] and range [1, 4]', () => {
            assert(new Range(0, 2).canAdjacent(new Range(1, 4)) === false);
        });
        it('[canAdjacent] range [0, 2] and range [4, 5]', () => {
            assert(new Range(0, 2).canAdjacent(new Range(4, 5)) === false);
        });
        it('[canAdjacent] range [3, 4] and range [0, 2]', () => {
            assert(new Range(3, 4).canAdjacent(new Range(0, 2)));
        });
        it('[canAdjacent] range [0, 2] and not a range', () => {
            assert.throws(() => new Range(0, 2).canAdjacent({a: 1}), e => e instanceof TypeError);
        });
    });
    describe('add', () => {
        it('[add] range [0, 2] add range [4, 5], should get range [[0, 2], [4, 5]]', () => {
            const r = new Range(0, 2);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(4, 5)));
            assert(re[0].head === 0);
            assert(re[0].tail === 2);
            assert(re[1].head === 4);
            assert(re[1].tail === 5);
        });
        it('[add] range [0, 2] add range [3, 5], should get range [[0, 5]]', () => {
            const r = new Range(0, 2);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(3, 5)));
            assert(re[0].head === 0);
            assert(re[0].tail === 5);
        });
        it('[add] range [0, 2] add range [2, 5], should get range [[0, 5]]', () => {
            const r = new Range(0, 2);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(2, 5)));
            assert(re[0].head === 0);
            assert(re[0].tail === 5);
        });
        it('[add] range [0, 2] add range [1, 5], should get range [[0, 5]]', () => {
            const r = new Range(0, 2);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(1, 5)));
            assert(re[0].head === 0);
            assert(re[0].tail === 5);
        });
        it('[add] range [4, 5] add range [0, 2], should get range [[0, 2], [4, 5]]', () => {
            const r = new Range(4, 5);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(0, 2)));
            assert(re[0].head === 0);
            assert(re[0].tail === 2);
            assert(re[1].head === 4);
            assert(re[1].tail === 5);
        });
        it('[add] range [3, 5] add range [0, 2], should get range [[0, 5]]', () => {
            const r = new Range(3, 5);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(0, 2)));
            assert(re[0].head === 0);
            assert(re[0].tail === 5);
        });
        it('[add] range [4, 5] add range [0, 4], should get range [[0, 5]]', () => {
            const r = new Range(4, 5);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(0, 4)));
            assert(re[0].head === 0);
            assert(re[0].tail === 5);
        });
        it('[add] range [-1, 2] add range [0, 1], should get range [[-1, 2]]', () => {
            const r = new Range(-1, 2);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(0, 1)));
            assert(re[0].head === -1);
            assert(re[0].tail === 2);
        });
        it('[add] range [0, 1] add range [-1, 2], should get range [[-1, 2]]', () => {
            const r = new Range(0, 1);
            let re;
            assert.doesNotThrow(() => re = r.add(new Range(-1, 2)));
            assert(re[0].head === -1);
            assert(re[0].tail === 2);
        });
    });
    describe('sub', () => {
        it('[sub] range [0, 2] sub range [4, 5], should get range [[0, 2]]', () => {
            const r = new Range(0, 2);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(4, 5)));
            assert(re[0].head === 0);
            assert(re[0].tail === 2);
        });
        it('[sub] range [0, 2] sub range [-2, -1], should get range [[0, 2]]', () => {
            const r = new Range(0, 2);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(-2, -1)));
            assert(re[0].head === 0);
            assert(re[0].tail === 2);
        });
        it('[sub] range [0, 3] sub range [-2, 1], should get range [[2, 3]]', () => {
            const r = new Range(0, 3);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(-2, 1)));
            assert(re[0].head === 2);
            assert(re[0].tail === 3);
        });
        it('[sub] range [0, 3] sub range [0, 1], should get range [[2, 3]]', () => {
            const r = new Range(0, 3);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(0, 1)));
            assert(re[0].head === 2);
            assert(re[0].tail === 3);
        });
        it('[sub] range [0, 1] sub range [-1, 3], should get range []', () => {
            const r = new Range(0, 1);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(-1, 3)));
            assert(re.length === 0);
        });
        it('[sub] range [0, 3] sub range [0, 3], should get range []', () => {
            const r = new Range(0, 3);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(0, 3)));
            assert(re.length === 0);
        });
        it('[sub] range [0, 3] sub range [2, 3], should get range [[0, 1]]', () => {
            const r = new Range(0, 3);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(2, 3)));
            assert(re[0].head === 0);
            assert(re[0].tail === 1);
        });
        it('[sub] range [0, 3] sub range [2, 4], should get range [[0, 1]]', () => {
            const r = new Range(0, 3);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(2, 4)));
            assert(re[0].head === 0);
            assert(re[0].tail === 1);
        });
        it('[sub] range [0, 3] sub range [1, 2], should get range [[0, 0], [3, 3]]', () => {
            const r = new Range(0, 3);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(1, 2)));
            assert(re[0].head === 0);
            assert(re[0].tail === 0);
            assert(re[1].head === 3);
            assert(re[1].tail === 3);
        });
        it('[sub] range [0, 10] sub range [2, 3], should get range [[0, 1], [4, 10]]', () => {
            const r = new Range(0, 10);
            let re;
            assert.doesNotThrow(() => re = r.sub(new Range(2, 3)));
            assert(re[0].head === 0);
            assert(re[0].tail === 1);
            assert(re[1].head === 4);
            assert(re[1].tail === 10);
        });
    });
    describe('toString', () => {
        it('[toString] range [0, 1], should get range `[0, 1]`', () => {
            const r = new Range(0, 1);
            assert(r.toString() === '[0, 1]');
        })
    });
});