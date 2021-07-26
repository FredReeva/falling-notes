import { convert, chordNotes } from '../libraries/melodygen/utils.js';
import { MidiWriter } from 'midi-writer-js';

export const createMidi = (melody, chords, tempo, songName) => {
    var MidiWriter = require('midi-writer-js');

    var melodyMidi = new MidiWriter.Track();
    var chordsMidi = new MidiWriter.Track();

    melodyMidi.setTempo(tempo);
    chordsMidi.setTempo(tempo);

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

    var notesInChord = [];
    var convertChord = { tonic: 'C', color: 'Major' };

    chords.forEach((chord) => {
        notesInChord = [];
        convertChord.tonic = chord['tonic'];
        convertChord.color = chord['quality'];
        notesInChord = chordNotes(convertChord, 3);

        var dur = 4 / chord['duration'];
        if (dur === 4 / 3) dur = 'd2';

        // add array of notes, non sequentially!
        chordsMidi.addEvent(
            [
                new MidiWriter.NoteEvent({
                    pitch: notesInChord,
                    duration: dur,
                }),
            ],
            function (event, index) {
                return { sequential: false };
            }
        );
    });

    var track = new MidiWriter.Writer([melodyMidi, chordsMidi]);

    //console.log(write.dataUri());

    var link = document.createElement('a');
    link.download = songName;
    link.href = track.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
