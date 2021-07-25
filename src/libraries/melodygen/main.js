import * as pieceProto from './piece.prototype.js'
import {Segmentation} from './generators/Segmentation.js'
import {Directionality} from './generators/Directionality.js'
import {ChordScaleTonality} from './generators/ChordScaleTonality.js'
import {Transform} from './generators/Transform/Transform.js'

//The melody generation is managed entirely by this class
export class MelodyGen{
    
    //This method is used to generate the melody, given chords, pauses probability and music mode as arguments
    //passed by GUI (the last two arguments are optional)
    generate(chords, pausePresence = 0.2, classicMode = false){
        /**
          chords = [
               {
                    tonic: "C",
                    color: "Major",
                    duration: 4
                }
            ]

            pausePresence = <0.00 - 1.00>
            classicMode = <true/false>
         */

        //Create piece empty prototype scheme to be elaborated. Our goal will be filling this prototype up.
        let piece = pieceProto.piece()

        piece.pausePresence = pausePresence
        piece.staticScaleAssociation = classicMode

        //Piece segments generation
        piece = new Segmentation(piece, chords).generate()
        piece = new Directionality(piece).generate()
        piece = new ChordScaleTonality(piece, chords).generate()
        piece = new Transform(piece).pickTransformations()
        piece = new Transform(piece).applyTransformations()
        
        //Prints piece object
        console.log(piece)

        //Render final object to be used by GUI
        return this.export(piece)       
    }


    //Final output object rendering
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