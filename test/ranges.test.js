const Ranges = require('./../src/ranges');
const Range = require('./../src/range');
const assert = require('assert');

describe('Ranges', () => {
    describe('constructor', () => {
        it('new Ranges(), should get an empty instance', () => {
            const rs = new Ranges();
            assert(rs.piece === 0);
            assert(rs.length === 0);
        });
        it('new Ranges(new Range(1, 2)), should get an Ranges instance of [[1, 2]]', () => {
            const rs = new Ranges(new Range(1, 2));
            assert(rs.piece === 1);
            assert(rs.length === 1);
            assert(rs.ranges[0].head === 1);
            assert(rs.ranges[0].tail === 2);
        });
        it('new Ranges(new Ranges(new Range(1, 2))), should get an Ranges instance of [[1, 2]]', () => {
            const rs = new Ranges(new Range(1, 2));
            const rs1 = new Ranges(rs);
            assert(rs1.piece === 1);
            assert(rs1.length === 1);
            assert(rs1.ranges[0].head === 1);
            assert(rs1.ranges[0].tail === 2);
        });
        it('new Ranges([new Range(1, 2), new Range(3, 4)]), should get an Ranges instance of [[1, 4]]', () => {
            const rs = new Ranges([new Range(1, 2), new Range(3, 4)]);
            assert(rs.piece === 1);
            assert(rs.length === 3);
            assert(rs.ranges[0].head === 1);
            assert(rs.ranges[0].tail === 4);
        });
        it('new Ranges({a: 1}), should get a TypeError', () => {
            assert.throws(() => new Ranges({ a: 1 }), e => e instanceof TypeError);
        });
    });
    describe('convertFromArray', () => {
        it('[static convertFromArray] create Ranges instance from array [[0, 3]]', () => {
            const rs = Ranges.convertFromArray([[0, 3]]);
            assert(rs.length === 3);
            assert(rs.piece === 1);
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 3);
        });
        it('[static convertFromArray] create Ranges instance from array [[0, 3], [4, 5]]', () => {
            const rs = Ranges.convertFromArray([[0, 3], [4, 5]]);
            assert(rs.length === 5);
            assert(rs.piece === 1);
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 5);
        });
        it('[static convertFromArray] create Ranges instance from {a: 1}, should get a TypeError', () => {
            assert.throws(() => Ranges.convertFromArray({ a: 1 }), e => e instanceof TypeError);
        });
        it('[static convertFromArray] create Ranges instance from array [0, 3], should get a TypeError', () => {
            assert.throws(() => Ranges.convertFromArray([0, 3]), e => e instanceof TypeError);
        });
    });
    describe('sort', () => {
        it('@deprecations [sort], it can automatic sort itself. sort Ranges [[3, 4], [0, 1]]', () => {
            const rs = new Ranges();
            rs._ranges.push(new Range(3, 4), new Range(0, 1));
            assert(rs.ranges[0].head === 3);
            assert(rs.ranges[0].tail === 4);
            assert(rs.ranges[1].head === 0);
            assert(rs.ranges[1].tail === 1);
            rs.sort();
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 1);
            assert(rs.ranges[1].head === 3);
            assert(rs.ranges[1].tail === 4);
        })
    });
    describe('add', () => {
        it('[add] ranges [[0, 3]] add [4, 5], should get [[0, 5]]', () => {
            const rs = Ranges.convertFromArray([[0, 3]]);
            rs.add(new Range(4, 5));
            assert(rs.length === 5);
            assert(rs.piece === 1);
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 5);
        });
        it('[add] ranges [[0, 3]] add [4, 5], [8, 9], should get [[0, 5], [8, 9]]', () => {
            const rs = Ranges.convertFromArray([[0, 3]]);
            rs.add(new Range(4, 5), new Range(8, 9));
            assert(rs.length === 6);
            assert(rs.piece === 2);
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 5);
            assert(rs.ranges[1].head === 8);
            assert(rs.ranges[1].tail === 9);
        });
        it('[add] ranges [[0, 3]] add {a: 1}, should get a TypeError', () => {
            const rs = Ranges.convertFromArray([[0, 3]]);
            assert.throws(() => rs.add({ a: 1 }), e => e instanceof TypeError);
        });
    });
    describe('sub', () => {
        it('[sub] ranges [[0, 5]] sub [2, 3], should get [[0, 1], [4, 5]]', () => {
            const rs = Ranges.convertFromArray([[0, 5]]);
            rs.sub(new Range(2, 3));
            assert(rs.length === 2);
            assert(rs.piece === 2);
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 1);
            assert(rs.ranges[1].head === 4);
            assert(rs.ranges[1].tail === 5);
        });
        it('[sub] ranges [[0, 5]] sub [0, 2], should get [[3, 5]]', () => {
            const rs = Ranges.convertFromArray([[0, 5]]);
            rs.sub(new Range(0, 2));
            assert(rs.length === 2);
            assert(rs.piece === 1);
            assert(rs.ranges[0].head === 3);
            assert(rs.ranges[0].tail === 5);
        });
        it('[sub] ranges [[0, 5], [7, 9]] sub [2, 3], should get [[0, 1], [4, 5], [7, 9]]', () => {
            const rs = Ranges.convertFromArray([[0, 5], [7, 9]]);
            rs.sub(new Range(2, 3));
            assert(rs.length === 4);
            assert(rs.piece === 3);
            assert(rs.ranges[0].head === 0);
            assert(rs.ranges[0].tail === 1);
            assert(rs.ranges[1].head === 4);
            assert(rs.ranges[1].tail === 5);
            assert(rs.ranges[2].head === 7);
            assert(rs.ranges[2].tail === 9);
        });
        it('[sub] ranges [[0, 3]] add {a: 1}, should get a TypeError', () => {
            const rs = Ranges.convertFromArray([[0, 3]]);
            assert.throws(() => rs.sub({ a: 1 }), e => e instanceof TypeError);
        });
    });
    describe('contain', () => {
        it('[contain] ranges [[0, 3]] contain 1, should get true', () => {
            assert(Ranges.convertFromArray([[0, 3]]).contain(1));
        });
        it('[contain] ranges [[0, 3], [5, 7]] contain 1, should get true', () => {
            assert(Ranges.convertFromArray([[0, 3], [5, 7]]).contain(1));
        });
        it('[contain] ranges [[0, 3], [5, 7]] contain 4, should get false', () => {
            assert(Ranges.convertFromArray([[0, 3], [5, 7]]).contain(4) === false);
        });
        it('[contain] ranges [[0, 3], [5, 7]] contain {a: 1}, should get false', () => {
            assert.throws(() => Ranges.convertFromArray([[0, 3], [5, 7]]).contain({ a: 1 }), e => e instanceof TypeError);
        });
    });
    describe('connect', () => {
        it('[static connect] connect [{a: 1}, {a: 2}], should get a TypeError', () => {
            assert.throws(() => Ranges.connect([{ a: 1 }, { a: 2 }]), e => e instanceof TypeError);
        });
        it('[static connect] connect [{a: 1}, {a: 2}], should get a TypeError', () => {
            assert.throws(() => Ranges.connect({ a: 1 }), e => e instanceof TypeError);
        });
    });
    describe('toString', () => {
        it('[toString] ranges [[0, 5], [7, 9], [11, 12]], should get `[[0, 5], [7, 9], [11, 12]]`', () => {
            const rs = Ranges.convertFromArray([[0, 5], [7, 9], [11, 12]]);
            assert(rs.toString() === '[[0, 5], [7, 9], [11, 12]]');
        });
    });
});