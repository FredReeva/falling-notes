import * as Utils from '../utils.js'
import * as pieceProto from '../piece.prototype.js'
import * as Const from './Pitch/pitch.constants.js'

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

export class ChordScaleTonality{

    constructor(piece, chords){
        this.piece = piece
        this.chords = chords
    }

    
    generate(){
        let segmentChordData = this.calcSegmentChordData()
        for(let i=0; i<this.piece.segments.length; i++){
            this.piece.segments[i].chord = segmentChordData[i].chord
            this.piece.segments[i].diatonicScale = segmentChordData[i].diatonicScale
        }
        return this.piece
    }


    calcDiatonicScale(chord, previousScale){

        let diatonicScale = pieceProto.diatonicScale()

        let note = Utils.convert(Utils.chordNotes(chord))[0]
        let scalesAssociated = Const.colorToScale[chord.color]
        
        let firstCromaticNote = (note % 12)
        let diatonicNote = Const.cromaticToDiatonic[firstCromaticNote]
        diatonicScale.cromaticOffset = Const.diatonicToCromaticOffset(diatonicNote, firstCromaticNote)

        if(previousScale == null){
            //FIRST CHORD: If scalesAssociated has 'ionian' we will pick ionian
            if(scalesAssociated.includes('ionian')){
                diatonicScale.name = 'ionian'
            }else{
                diatonicScale.name = Utils.randItem(scalesAssociated)
            }

            //Calc tonality
            let scaleIndex = Const.scaleNumber[diatonicScale.name]
            diatonicScale.tonality = (diatonicNote - scaleIndex).mod(7)

        }else{
            //OTHER CHORDS:
            //convert previous tonality to cromatic
            let previousTonality = Const.diatonicToCromaticNote(previousScale.tonality, previousScale.cromaticOffset)
            
            let scales = []
            let fifthCircle = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]

            for(let i=0; i<scalesAssociated.length; i++){
                //Calc tonalities of associated scales
                let scaleIndex = Const.scaleNumber[scalesAssociated[i]]
                scales.push({
                    name: scalesAssociated[i],
                    tonality: (diatonicNote - scaleIndex).mod(7),
                    index: null
                })
            }            
            
            let previousTonalityIndex = null

            //Get indexes of previousTonality and current tonalities
            for(let i=0; i<fifthCircle.length; i++){
                if(fifthCircle[i] == previousTonality){
                    previousTonalityIndex = i
                }

                for(let j=0; j<scales.length; j++){
                    let cromaticTonality = Const.diatonicToCromaticNote(scales[j].tonality, diatonicScale.cromaticOffset)
                    if(fifthCircle[i] == cromaticTonality){
                        scales[j].index = i
                    }
                }
            }

            //Calc minimun distance of indexes
            let minDistance = null
            let minScale = null
            for(let i=0; i<scales.length; i++){
                let distance = Math.min(
                    (previousTonalityIndex - scales[i].index).mod(12),
                    (scales[i].index - previousTonalityIndex).mod(12)
                )
                if(minDistance == null || distance < minDistance){
                    minDistance = distance
                    minScale = scales[i]
                }
            }

            diatonicScale.name = minScale.name
            diatonicScale.tonality = minScale.tonality
            
        }

        diatonicScale.notes = this.calcDiatonicArray(diatonicNote, Const.scalePattern[diatonicScale.name], 7)

        return diatonicScale
        
    }

    //chord-segment association
    calcSegmentChordData(){
        let segmentChords = []
        for(let i = 0; i<this.chords.length; i++){
            let chordSegs = this.chords[i].duration / this.piece.segmentDuration
            let previousScale = null
            if(segmentChords.length > 0){
                previousScale = segmentChords[segmentChords.length-1].diatonicScale
            }
            let diatonicScaleObj = this.calcDiatonicScale(this.chords[i], previousScale)
            for(let j = 0; j<chordSegs; j++){
                let chordObj = pieceProto.chord()
                chordObj.tonic = this.chords[i].tonic
                chordObj.color = this.chords[i].color
                chordObj.notes = Utils.convert(Utils.chordNotes(this.chords[i]))
                segmentChords.push({
                    chord: chordObj,
                    diatonicScale: diatonicScaleObj
                })
            }
        }

        return segmentChords
    }

    calcDiatonicArray(note, pattern, octaves=1){
        let scale = [note]
        for(let j=0; j<octaves; j++){
            for(let i=0; i<pattern.length; i++){
                note+=pattern[i]
                scale.push(note)
            }
        }
        return scale
    }
 


}