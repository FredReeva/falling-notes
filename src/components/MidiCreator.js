import { IoPause } from 'react-icons/io5';
import { convert, chordNotes } from '../libraries/melodygen/utils.js';
import { MidiWriter } from 'midi-writer-js';

export const createMidi = (melody, chords) => {
    var MidiWriter = require('midi-writer-js');

    var melodyMidi = new MidiWriter.Track();
    var chordsMidi = new MidiWriter.Track();

    var pause = 0;

    const convertDurationValues = (dur) => {
        return ['T' + dur * 128];
    };

    melody.forEach((note) => {
        if (note['type'] === 'pause') {
            pause = pause + note['duration'];
        }

        if (note['type'] === 'note') {
            pause = convertDurationValues(pause);
            //console.log(pause);

            melodyMidi.addEvent(
                [
                    new MidiWriter.NoteEvent({
                        pitch: note['pitch'],
                        duration: 4 / note['duration'],
                        wait: pause,
                    }),
                ],

                function (event, index) {
                    return { sequential: true };
                }
            );

            pause = 0;
        }
    });

    // var notesInChords = [];
    // var convertChord = { tonic: 'C', color: 'Major' };

    // chords.forEach((chord) => {
    //     convertChord.tonic = chord['tonic'];
    //     convertChord.color = chord['quality'];
    //     notesInChords.push(chordNotes(convertChord, 2));

    //     melodyMidi.addEvent(
    //         [
    //             new MidiWriter.NoteEvent({
    //                 pitch: note['pitch'],
    //                 duration: 1 / (chord['duration'] * 2),
    //                 wait: pause,
    //             }),
    //         ],

    //         function (event, index) {
    //             return { sequential: true };
    //         }
    //     );
    // });
    // console.log(notesInChords);

    //console.log(melodyMidi);

    var write = new MidiWriter.Writer(melodyMidi);
    //console.log(write.dataUri());

    var link = document.createElement('a');
    link.download = 'untitled';
    link.href = write.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
