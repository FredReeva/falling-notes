import { IoPause } from 'react-icons/io5';
import { convert, chordNotes } from '../libraries/melodygen/utils.js';
import { MidiWriter } from 'midi-writer-js';

export const createMidi = (melody, chords) => {
    var MidiWriter = require('midi-writer-js');

    var melodyMidi = new MidiWriter.Track();
    var chordsMidi = new MidiWriter.Track();

    var pause = 0;

    const convertDurationValues = (dur) => {
        //console.log('converting' + dur);
        if (dur === 3) return 'd2';
        if (dur === 5) return ['d2', '2'];
        if (dur === 6) return ['d2', 'd2'];
        if (dur === 7) return ['d2', '1'];
        if (dur === 9) return ['d2', '2', '1'];
        if (dur === 10) return ['d2', 'd2', '1'];
        if (dur === 11) return ['d2', '1', '1'];
        if (dur === 12) return ['1', '1', '1'];
        //! finish
        if (dur === 13) return ['1', '1', 'd2', '2'];
        if (dur === 14) return ['1', '1', 'd2', 'd2'];
        if (dur === 15) return ['1', '1', '1', 'd2'];

        return dur;
    };

    melody.forEach((note) => {
        if (note['type'] === 'pause') {
            pause = pause + 1 / (note['duration'] * 2);
        }

        if (note['type'] === 'note') {
            pause = convertDurationValues(pause);
            //console.log(pause);

            melodyMidi.addEvent(
                [
                    new MidiWriter.NoteEvent({
                        pitch: note['pitch'],
                        duration: 1 / (note['duration'] * 2),
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
