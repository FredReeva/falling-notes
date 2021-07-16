export const createMidi = (name, melody, chords) => {
    var MidiWriter = require('midi-writer-js');

    var melodyMidi = new MidiWriter.Track();
    var chordsMidi = new MidiWriter.Track();

    melodyMidi.addEvent(
        [
            new MidiWriter.NoteEvent({
                pitch: ['E4', 'D4'],
                duration: '4',
            }),
            new MidiWriter.NoteEvent({ pitch: ['C4'], duration: '2' }),
            new MidiWriter.NoteEvent({
                pitch: ['E4', 'D4'],
                duration: '4',
            }),
            new MidiWriter.NoteEvent({ pitch: ['C4'], duration: '2' }),
            new MidiWriter.NoteEvent({
                pitch: ['C4', 'C4', 'C4', 'C4', 'D4', 'D4', 'D4', 'D4'],
                duration: '8',
            }),
            new MidiWriter.NoteEvent({
                pitch: ['E4', 'D4'],
                duration: '4',
            }),
            new MidiWriter.NoteEvent({ pitch: ['C4'], duration: '2' }),
        ],
        function (event, index) {
            return { sequential: true };
        }
    );

    var write = new MidiWriter.Writer(melodyMidi);
    console.log(write.dataUri());

    var link = document.createElement('a');
    link.download = 'untitled';
    link.href = write.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
