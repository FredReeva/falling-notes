import * as pieceProto from './piece.prototype.js'
import {Segmentation} from './generators/Segmentation.js'
import {Directionality} from './generators/Directionality.js'
import {ChordScaleTonality} from './generators/ChordScaleTonality.js'
import {Transform} from './generators/Transform/Transform.js'
import * as Utils from './utils.js'

export class MelodyGen{
    
    constructor(){
        this.utils = Utils
    }
    
    generate(chords){
        /**
          chords = [
               {
                    tonic: "C",
                    color: "Major",
                    duration: 10
                },
            ]
         */
        let piece = pieceProto.piece()
        piece = new Segmentation(piece, chords).generate()
        piece = new Directionality(piece).generate()
        piece = new ChordScaleTonality(piece, chords).generate()
        piece = new Transform(piece).pickTransformations()
        piece = new Transform(piece).applyTransformations()

        this.piece = piece
        //return piece
        return this.export(piece)       
    }

    export(piece){
        piece = Object.assign({}, piece);
        let out = []
        for(let i=0; i<piece.segments.length; i++){
            for(let j=0; j<piece.segments[i].objects.length; j++){
                let obj = piece.segments[i].objects[j]
                obj.onsetTime = obj.onsetTime + (piece.segmentDuration * i)
                out.push(obj)
            }
        }
        return out
    }  


}