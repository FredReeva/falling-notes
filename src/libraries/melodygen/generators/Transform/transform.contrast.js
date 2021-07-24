import * as pieceProto from '../../piece.prototype.js';
import * as Utils from '../../utils.js';
import { Pitch } from '../Pitch/Pitch.js';

export default class Contrast {
    constructor(piece, segmentIndex) {
        this.piece = piece;
        this.segment = piece.segments[segmentIndex];
        this.previousSegment =
            segmentIndex > 0 ? piece.segments[segmentIndex - 1] : null;
        this.segmentIndex = segmentIndex;
        this.generateTiming();
        this.generatePitch();
        return this.segment;
    }

    //Generation of onsetTime and Duration
    generateTiming() {
        const cells = this.piece.segmentDuration * 8;
        const granularity = 0.125;

        //Set probabilities with respect to segment duration
        let probs = [];
        if (this.piece.segmentDuration >= 3) probs = [20, 50, 20, 10];
        if (this.piece.segmentDuration === 2) probs = [10, 40, 30, 20];
        if (this.piece.segmentDuration === 1) probs = [0, 40, 50, 10];

        let filledCells = 0.0;

        //Evaluating and filling cells with respect to available durations
        for (let c = 0; c < cells; c++) {
            let freeCells = cells - filledCells;

            if (c < filledCells) continue;

            let objDuration = 0.0;

            if (freeCells >= 8) {
                objDuration = Utils.pickState([
                    [granularity * 8, probs[0]],
                    [granularity * 4, probs[1]],
                    [granularity * 2, probs[2]],
                    [granularity, probs[3]],
                ]);
                filledCells += objDuration / granularity;
            } else if (freeCells >= 4) {
                let adjust = probs[1] + probs[2] + probs[3];

                objDuration = Utils.pickState([
                    [granularity * 4, (probs[1] / adjust) * 100],
                    [granularity * 2, (probs[2] / adjust) * 100],
                    [granularity, (probs[3] / adjust) * 100],
                ]);
                filledCells += objDuration / granularity;
            } else if (freeCells >= 2) {
                let adjust = probs[2] + probs[3];

                objDuration = Utils.pickState([
                    [granularity * 2, (probs[2] / adjust) * 100],
                    [granularity, (probs[3] / adjust) * 100],
                ]);

                filledCells += objDuration / granularity;

            } else if (freeCells === 1) {
                objDuration = granularity;
                filledCells += objDuration / granularity;
            }

            let objType = Utils.pickState([
                ['note', 100 - (this.piece.pausePresence * 100)],
                ['pause', this.piece.pausePresence * 100],
            ]);

            let objOnsetTime = c * granularity;

            let obj = pieceProto.object();
            obj.type = objType;
            obj.duration = objDuration;
            obj.onsetTime = objOnsetTime;

            this.segment.objects.push(obj);
        }
    }

    //Generation of pitches
    generatePitch() {
        if (this.previousSegment == null) {
            this.segment = new Pitch(this.segment).generate();
        } else {
            let lastPitch = null;
            for (let i = 0; i < this.previousSegment.objects.length; i++) {
                if (this.previousSegment.objects[i].type === 'pause') continue;
                lastPitch = this.previousSegment.objects[i].pitch;
            }

            this.segment = new Pitch(this.segment).generate(lastPitch);
        }
    }
}
