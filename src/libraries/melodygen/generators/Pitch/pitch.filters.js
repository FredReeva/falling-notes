import * as Utils from '../../utils.js';

/*
Pitch filters are defined in this section. 
*/

//Filter 4th octave (computing the 1st note)
export function startingOctave(diatonicArray) {
    let output = [];

    for (let i = 0; i < diatonicArray.length; i++) {
        if (diatonicArray[i] >= 60 && diatonicArray[i] < 72) {
            output.push(diatonicArray[i]);
        }
    }

    return output;
}

//Filter notes in specifiedNotes (all octaves included)
export function specifiedNotes(diatonicArray, specifiedNotes) {
    let output = [];

    for (let i = 0; i < diatonicArray.length; i++) {
        for (let n = 0; n < specifiedNotes.length; n++) {
            let note1 = specifiedNotes[n] % 12;
            let note2 = diatonicArray[i] % 12;

            //console.log(note1 + " " + note2)
            if (note1 === note2) {
                output.push(diatonicArray[i]);
                break;
            }
        }
    }

    return output;
}

//Computing the Average of <precNotes> and then filter the <diatonicArray>
export function melodicCountour(diatonicArray, precNotes, direction) {
    let sum = 0;
    for (let i = 0; i < precNotes.length; i++) {
        sum += precNotes[i];
    }
    let avg = sum / precNotes.length;

    let output = [];
    //Get nearest note of diatonicArray
    let nearestNote = Utils.nearestNote(
        diatonicArray,
        precNotes[precNotes.length - 1]
    );

    if (direction === '0') {
        //Search for last note of <precNotes> and pick next 2 notes or prev 2 notes
        for (let i = 0; i < diatonicArray.length; i++) {
            if (diatonicArray[i] === nearestNote) {
                if (i - 2 >= 0) {
                    output.push(diatonicArray[i - 2]);
                    output.push(diatonicArray[i - 1]);
                }

                output.push(diatonicArray[i]);

                if (i + 2 < diatonicArray.length) {
                    output.push(diatonicArray[i + 1]);
                    output.push(diatonicArray[i + 2]);
                }
            }
        }
    } else {
        for (let i = 0; i < diatonicArray.length; i++) {
            if (direction === '+')
                if (diatonicArray[i] >= avg) output.push(diatonicArray[i]);
            if (direction === '-')
                if (diatonicArray[i] <= avg) output.push(diatonicArray[i]);
        }
    }

    return output;
}

//Max local range filter
export function localRange(diatonicArray, note, direction) {
    let output = [];
    let steps = 4;

    for (let i = 0; i < diatonicArray.length; i++) {
        if (direction === '+' && diatonicArray[i] === note) {
            for (let j = 0; j < steps + 1; j++) {
                if (i + j < diatonicArray.length) {
                    output.push(diatonicArray[i + j]);
                }
            }
            break;
        }

        if (direction === '-' && diatonicArray[i] === note) {
            for (let f = i - steps; f <= i; f++) {
                if (f >= 0) {
                    output.push(diatonicArray[f]);
                }
            }
            break;
        }
    }

    if (output.length === 0) {
        return [Utils.nearestNote(diatonicArray, note)];
    } else {
        return output;
    }
}

//Max global range filter
export function globalRange(diatonicArray, min, max, offset = 16) {
    let output = [];
    for (let i = 0; i < diatonicArray.length; i++) {
        if (
            diatonicArray[i] <= min + offset &&
            diatonicArray[i] >= max - offset
        ) {
            output.push(diatonicArray[i]);
        }
    }
    return output;
}

//Set NaN where diatonicArray are not notesToKeep notes
export function NaNclean(diatonicArray, notesToKeep) {
    let output = [];

    for (let i = 0; i < diatonicArray.length; i++) {
        if (notesToKeep.includes(diatonicArray[i])) {
            output.push(diatonicArray[i]);
        } else {
            output.push(NaN);
        }
    }

    return output;
}
