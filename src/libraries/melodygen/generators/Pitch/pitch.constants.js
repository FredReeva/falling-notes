export const colorToScale = {
    'Major': ['ionian', 'lydian', 'mixolydian'],
    'minor': ['dorian', 'phrygian', 'aeolian'],
    'Maj7': ['ionian', 'lydian'],
    'minor7': ['dorian', 'phrygian', 'aeolian'],
    '7': ['mixolydian'],
    'm7b5': ['locrian'],
}

export const colorToStaticScale = {
    'Major': ['ionian'],
    'minor': ['aeolian'],
    'Maj7': ['ionian'],
    'minor7': ['aeolian'],
    '7': ['mixolydian'],
    'm7b5': ['locrian'],
}


export const scaleNumber = {
    ionian:     0,
    dorian:     1,
    phrygian:   2,
    lydian:     3,
    mixolydian: 4,
    aeolian:    5,
    locrian:    6
}

export const scalePattern = {
    ionian:     [2, 2, 1, 2, 2, 2, 1],
    dorian:     [2, 1, 2, 2, 2, 1, 2],
    phrygian:   [1, 2, 2, 2, 1, 2, 2],
    lydian:     [2, 2, 2, 1, 2, 2, 1],
    mixolydian: [2, 2, 1, 2, 2, 1, 2],
    aeolian:    [2, 1, 2, 2, 1, 2, 2],
    locrian:    [1, 2, 2, 1, 2, 2, 2]
}

export const cromaticToDiatonic = {
    0: 0,
    1: 0,
    2: 1,
    3: 1,
    4: 2,
    5: 3,
    6: 3,
    7: 4,
    8: 4,
    9: 5,
    10: 5,
    11: 6
}

export const diatonicToCromaticOffset = function(diatonicNote, cromaticNote){
    let map = {
        0: {0: 1, 1: 2},
        1: {2: 1, 3: 2},
        2: {4: 1},
        3: {5:1, 6:2},
        4: {7: 1, 8: 2},
        5: {9: 1, 10: 2},
        6: {11: 1}
    }
    return map[diatonicNote][cromaticNote]
}

export const diatonicToCromaticNote = function(diatonicNote, offset){
    let map = {
        1:{
            0: 0,
            1: 2,
            2: 4,
            3: 5,
            4: 7,
            5: 9,
            6: 11
        },
        2:{
            0: 1,
            1: 3,
            2: 4,
            3: 6,
            4: 8,
            5: 10,
            6: 11,
        }
    }
    return map[offset][diatonicNote]
}