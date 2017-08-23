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
        [PandR.BEFORE]: RandR.TOTAL_BEFORE,
        [PandR.IN]: RandR.HEAD_BEFORE,
        [PandR.AFTER]: RandR.CONTAIN
    },
    [PandR.IN]: {
        [PandR.IN]: RandR.INNER,
        [PandR.AFTER]: RandR.TAIL_AFTER
    },
    [PandR.AFTER]: {
        [PandR.AFTER]: RandR.TOTAL_AFTER
    }
}

exports = module.exports = {
    PandR,
    RandR,
    RandR_map
}
