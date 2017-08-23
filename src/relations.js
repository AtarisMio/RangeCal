const PandR = {
    BEFORE: -1,
    IN: 0,
    AFTER: 1
};

const RandR = {
    TOTAL_BEFORE: -3,
    HEAD_BEFORE: -2,
    CONTAIN: -1,
    INNER: 1,
    TAIL_AFTER: 2,
    TOTAL_AFTER: 3
}

const RandR_map = {
    [PandR.BEFORE]: {
        [PandR.BEFORE]: RandR.TOTAL_BEFORE, // [1,2] vs [3,4]
        [PandR.IN]: RandR.HEAD_BEFORE, // [1,3] vs [2,4]
        [PandR.AFTER]: RandR.CONTAIN // [1,4] vs [2,3]
    },
    [PandR.IN]: {
        [PandR.IN]: RandR.INNER, // [2,3] vs [1,4]
        [PandR.AFTER]: RandR.TAIL_AFTER // [2,4] vs [1,3]
    },
    [PandR.AFTER]: {
        [PandR.AFTER]: RandR.TOTAL_AFTER // [3,4] vs [1,2]
    }
}

exports = module.exports = {
    PandR,
    RandR,
    RandR_map
}
