import * as pieceProto from '../../piece.prototype.js';

//Shuffles temporal features, keeps the same pitches.
export default class TemporalVariation {
    constructor(piece, segmentIndex, motif) {
        this.piece = piece;
        this.motif = motif;
        this.segment = piece.segments[segmentIndex];
        this.previousSegment =
            segmentIndex > 0 ? piece.segments[segmentIndex - 1] : null;
        this.segmentIndex = segmentIndex;

        this.generateTiming();
        this.generatePitch();
        return this.segment;
    }

    //Generation of Durations
    generateTiming() {
        let durations = [];

        for (let i = 0; i < this.motif.objects.length; i++) {
            durations.push(this.motif.objects[i].duration);
        }

        //Shuffle duration in-place using Durstenfeld shuffle algorithm 
        for (var i = durations.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = durations[i];
            durations[i] = durations[j];
            durations[j] = temp;
        }

        for (let i = 0; i < this.motif.objects.length; i++) {
            let obj = pieceProto.object();
            obj.type = this.motif.objects[i].type;
            obj.duration = durations[i];
            this.segment.objects.push(obj);
        }
    }

    //Generation of pitches
    generatePitch() {
        for (let i = 0; i < this.motif.objects.length; i++) {
            if (this.segment.objects[i].type === 'pause') {
                delete this.segment.objects[i].pitch;
            } else {
                this.segment.objects[i].pitch = this.motif.objects[i].pitch;
            }
        }
    }
}
