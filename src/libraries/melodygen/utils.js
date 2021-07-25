/*
These funcitons are used as utilities by all the classes
*/

//Pick one component of array starting from its associated probabilities
export function pickState(input){
    /* [
        [choice, probability<0...100>],
        [choice, probability<0...100>],
        ...
    ] */
    let min = 0
    let max = 100 + 1

    let random = Math.floor(Math.random()*(max-min)+min);

    let sum = 0
    for(let i = 0; i<input.length; i++){
        sum += input[i][1]
        if(random <= sum) return input[i][0]
    }

}

//Return random element of array
export function randItem(array){
    let random = Math.floor((Math.random() * array.length))
    return array[random]
}

//Converts an array of note names (string) to MIDI numbers (int) or vice versa
export function convert(notesArray){

    let converted = []
    let numbers = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3,  'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
        'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab':8, 'Bb': 10,
        'A##': 11, 'B##': 0, 'C##': 2, 'D##': 4, 'E##': 6, 'F##':7, 'G##': 9
    }
    let letters = {
        0: 'C', 1: 'C#', 2: 'D', 3: 'D#',  4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#',11: 'B'
    }
    
    for(let i=0; i<notesArray.length; i++){
        if((typeof notesArray[i]) == 'string'){
            converted.push(numbers[notesArray[i]])
        }else{
            let octave = Math.trunc(notesArray[i] / 12) + 1
            converted.push(letters[notesArray[i]%12] + octave)
        }
    }
    
    return converted
}


//Return nearest element of an array
export function nearestNote(notesArray, note){
    let difference = null
    let nearestNote = null

    for(let i=0; i<notesArray.length; i++){
        let currdiff = Math.abs(notesArray[i] - note)
        if(nearestNote == null){
            nearestNote = notesArray[i]
            difference = currdiff
        }else{
            if(currdiff < difference){
                nearestNote = notesArray[i]
                difference = currdiff
            }
        }
    }

    return nearestNote
}

//Return notes of a chord
export function chordNotes(chord, octave=null){
    const music_chord = require('music-chord')
    let notes = music_chord(chord.color, chord.tonic)
    //Error: chord not recognized
    if(notes[0] == null){
        throw 'MelodyGen@Pitch Error: Chord [' + chord.tonic + chord.color + "] not recognized";
    }else if(octave != null){
        for(let i=0; i<notes.length; i++){
            notes[i] += octave.toString()
        }
        return notes
    }else{
        return notes
    }
}