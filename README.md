# RangeCal [![Build Status](https://travis-ci.org/AtrisMio/RangeCal.svg?branch=master)](https://travis-ci.org/AtrisMio/RangeCal) [![Coverage Status](https://coveralls.io/repos/github/AtrisMio/RangeCal/badge.svg?branch=master)](https://coveralls.io/github/AtrisMio/RangeCal?branch=master)

A library for calculating ranges

## Usage

``` javascript
const { Ranges, Range, PandR, RandR } = require('ranges-calc');
const ranges = new Ranges(new Range(0, 1));
ranges.add(new Range(2, 3));
ranges.sub(new Range(2, 3));
```

## Sample

``` javascript
const { Ranges, Range, PandR, RandR } = require('ranges-calc'); // or use it like an es6 module;
const ranges1 = new Ranges(new Range(0, 1)); // create a Ranges instance from Range instance;
const ranges2 = new Ranges([new Range(1, 19), new Range(23, 34)]); // create a Ranges instance from mutiple Range instances;
const ranges3 = Ranges.convertFromArray([ [0, 1], [3, 4], [5, 6] ]); // create a Ranges instance from array;
console.log(ranges1.length); // get all of the ranges's total length, it will print 1 to console, because 1 - 0 = 1;
console.log(ranges1.piece); // get the number of the pieces of ranges, it will print 1 to console;
ranges1.add(new Range(2, 3)); // change to [[0, 1], [2, 3]];
console.log(ranges1.length); // get all of the ranges's total length, it will print 2 to console, because 3 - 2 + 1 - 0 = 2;
console.log(ranges1.piece); // get the number of the pieces of ranges, it will print 2 to console;
ranges2.sub(new Range(5, 6)); // change to [[1, 4], [7, 19], [23, 34]];
console.log(ranges2.length); // get all of the ranges's total length, it will print 2 to console, because 34 - 23 + 19 - 7 + 4 - 1 = 26;
console.log(ranges2.piece); // get the number of the pieces of ranges, it will print 3 to console;
console.log(ranges3.toString()); // convert ranges to string `[[0, 1], [3, 4], [5, 6]]`
```

## License

MIT