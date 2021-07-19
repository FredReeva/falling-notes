import { IoPause } from 'react-icons/io5';

export const createMidi = (melody, chords) => {
    var MidiWriter = require('midi-writer-js');

    var melodyMidi = new MidiWriter.Track();
    var chordsMidi = new MidiWriter.Track();

    var pause = 0;

    melody.forEach((note) => {
        if (note['type'] === 'pause') {
            pause = pause + 1 / (note['duration'] * 2);
        }

        if (note['type'] === 'note') {
            melodyMidi.addEvent(
                [
                    new MidiWriter.NoteEvent({
                        pitch: note['pitch'],
                        duration: 1 / (note['duration'] * 2),
                        wait: pause === 6 ? 4 : pause,
                    }),
                ],

                function (event, index) {
                    return { sequential: true };
                }
            );

            pause = 0;
        }
    });

    // chords.forEach((chord) => {
    //     console.log(chord['tonic'])

    // });

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
