import * as Utils from '../../utils.js';
import * as Const from '../Pitch/pitch.constants.js';
import Repetition from './transform.repetition.js';
import Retrogradation from './transform.retrogradation.js';
import PitchVariation from './transform.pitchvariation.js';
import TemporalVariation from './transform.temporalvariation.js';
import Contrast from './transform.contrast.js';

import * as Filters from '../Pitch/pitch.filters.js';
import { Pitch } from '../Pitch/Pitch.js';

export class Transform {
    constructor(piece) {
        this.piece = piece;
    }

    applyTransformations() {
        let motif = null;
        for (let i = 0; i < this.piece.segments.length; i++) {
            if (i === 0) {
                this.piece.segments[i] = new this.piece.segments[
                    i
                ].transform.method(this.piece, i);
                motif = this.piece.segments[i];
            } else {
                this.piece.segments[i] = new this.piece.segments[
                    i
                ].transform.method(this.piece, i, motif);

                let prevChord =
                    this.piece.segments[i - 1].chord.tonic +
                    this.piece.segments[i - 1].chord.color;
                let currChord =
                    this.piece.segments[i].chord.tonic +
                    this.piece.segments[i].chord.color;
                if (prevChord !== currChord) {
                    motif = this.piece.segments[i];
                }
            }
        }

        //this.lastNoteAdjust()

        return this.piece;
    }

    lastNoteAdjust() {
        //Force last note to be a chord note
        let lastSegmentIndex = this.piece.segments.length - 1;
        let lastObjectIndex = null;

        for (
            let i = 0;
            i < this.piece.segments[lastSegmentIndex].objects.length;
            i++
        ) {
            let obj = this.piece.segments[lastSegmentIndex].objects[i];
            if (obj.type === 'note') {
                lastObjectIndex = i;
            }
        }

        //Chord notes
        let chordNotes = this.piece.segments[lastSegmentIndex].chord.notes;

        let diatonicChordNotes = [];
        for (let n = 0; n < chordNotes.length; n++) {
            let note = chordNotes[n];
            diatonicChordNotes.push(Const.cromaticToDiatonic[note]);
        }

        let scale = this.piece.segments[lastSegmentIndex].diatonicScale.notes;
        let filteredNotes = Filters.specifiedNotes(scale, chordNotes);
        let lastObj =
            this.piece.segments[lastSegmentIndex].objects[lastObjectIndex];
        if (!lastObj) {
            console.warn('LastObj not found');
            return;
        }

        let p = new Pitch();
        let lastPieceNote = p.diatonicToCromatic(
            Utils.nearestNote(filteredNotes, lastObj.pitch),
            this.piece.segments[lastSegmentIndex].diatonicScale.cromaticOffset
        );
        this.piece.segments[lastSegmentIndex].objects[lastObjectIndex].pitch =
            lastPieceNote;
    }

    pickTransformations() {
        let motif = null;
        for (let i = 0; i < this.piece.segments.length; i++) {
            //1st segment: Motif
            if (i === 0) {
                this.piece.segments[i].transform.method = Contrast;
                motif = this.piece.segments[i];
                continue;
            }

            //1st segment of a New chord
            if (
                this.piece.segments[i - 1].chord.tonic +
                    this.piece.segments[i - 1].chord.color !==
                this.piece.segments[i].chord.tonic +
                    this.piece.segments[i].chord.color
            ) {
                this.piece.segments[i].transform.method = Utils.randItem([
                    Contrast,
                    PitchVariation,
                ]);
                motif = this.piece.segments[i];
                continue;
            }

            let choices = [];

            //Repetiton
            if (
                this.piece.segments[i].directionality ===
                    motif.directionality &&
                this.piece.segments[i].chord.tonic +
                    this.piece.segments[i].chord.color ===
                    motif.chord.tonic + motif.chord.color &&
                this.piece.segments[i - 1].transform.method !== Repetition
                //&& this.piece.segments[i-1].transform.method != Contrast
            )
                choices.push(Repetition);

            //Retrogradation
            if (
                !['0', motif.directionality].includes(
                    this.piece.segments[i].directionality
                )
            )
                choices.push(Retrogradation);

            //PitchVariation
            if (['+', '-', '0'].includes(this.piece.segments[i].directionality))
                choices.push(PitchVariation);

            //TemporalVariation
            if (
                [motif.directionality].includes(
                    this.piece.segments[i].directionality
                )
            )
                choices.push(TemporalVariation);

            //Contrast
            if (['+', '-', '0'].includes(this.piece.segments[i].directionality))
                choices.push(Contrast);

            this.piece.segments[i].transform.method = Utils.randItem(choices);
            if (this.piece.segments[i].transform.method === Contrast)
                motif = this.piece.segments[i];
        }

        return this.piece;
    }
}
