import * as pieceProto from '../piece.prototype.js';

export class Segmentation {
    constructor(piece, chords) {
        this.chords = chords;
        this.piece = piece;
    }

    generate() {
        this.piece.pieceDuration = this.calcPieceDuration();
        this.piece.segmentDuration = this.calcSegmentDuration();

        let segmentQty = this.piece.pieceDuration / this.piece.segmentDuration;

        for (let i = 0; i < segmentQty; i++) {
            this.piece.segments.push(pieceProto.segment());
        }

        return this.piece;
    }

    calcPieceDuration() {
        let sum = 0.0;
        for (let i = 0; i < this.chords.length; i++) {
            sum = sum + this.chords[i].duration;
        }
        return sum;
    }

    calcSegmentDuration() {
        let calcgcd = function (a, b) {
            if (!b) return a;
            return calcgcd(b, a % b);
        };

        let gcd = this.chords[0].duration;

        if (this.chords.length > 1) {
            for (let i = 1; i < this.chords.length; i++) {
                gcd = calcgcd(gcd, this.chords[i].duration);
            }
        }

        let factors = [];
        for (let i = 1; i <= gcd; i++) {
            if (gcd % i === 0) {
                factors.push(i);
            }
        }

        let rand = Math.random() * factors.length;
        rand = Math.floor(rand);

        return factors[rand];
    }
}
