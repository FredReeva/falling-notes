import { Pitch } from '../Pitch/Pitch.js';
import * as pieceProto from '../../piece.prototype.js';

export default class PitchVariation {
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

    //Generation of onsetTime and Durations
    generateTiming() {
        for (let i = 0; i < this.motif.objects.length; i++) {
            let obj = pieceProto.object();
            obj.type = this.motif.objects[i].type;
            obj.duration = this.motif.objects[i].duration;
            obj.onsetTime = this.motif.objects[i].onsetTime;
            this.segment.objects.push(obj);
        }
    }

    //Generation of pitches
    generatePitch() {
        if (this.previousSegment == null) {
            this.segment = new Pitch(this.segment).generate();
        } else {
            let lastPitch = null;
            for (let i = 0; i < this.previousSegment.objects; i++) {
                if (this.previousSegment.objects[i].type === 'pause') continue;
                lastPitch = this.previousSegment.objects[i].pitch;
            }
            this.segment = new Pitch(this.segment).generate(lastPitch);
        }
    }
}
