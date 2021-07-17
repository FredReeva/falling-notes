export const createMidi = (melody) => {
    var MidiWriter = require('midi-writer-js');

    var melodyMidi = new MidiWriter.Track();
    var chordsMidi = new MidiWriter.Track();

    melody.forEach((note) => {
        // new MidiWriter.NoteEvent({
        //     pitch: [note['pitch']],
        //     duration: note['duration'],
        // });
        if (note['type'] === 'note') console.log(note['duration'] * 8);
    });

    // melodyMidi.addEvent(
    //     [
    //         melody.forEach((note) => {
    //             if (note['type'] === 'note') {
    //                 new MidiWriter.NoteEvent({
    //                     pitch: [note['pitch']],
    //                     duration: 8 * note['duration'],
    //                 });
    //             }
    //         }),
    //     ],
    //     function (event, index) {
    //         return { sequential: true };
    //     }
    // );

    // var write = new MidiWriter.Writer(melodyMidi);
    // console.log(write.dataUri());

    // var link = document.createElement('a');
    // link.download = 'untitled';
    // link.href = write.dataUri();
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
};
