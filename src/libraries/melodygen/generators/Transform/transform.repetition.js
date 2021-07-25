//Repetition of same segment
export default class Repetition{
    constructor(piece, segmentIndex, motif){
        this.motif = motif
        this.piece = piece
        this.segment = piece.segments[segmentIndex]
        this.previousSegment = (segmentIndex > 0) ? piece.segments[segmentIndex-1] : null
        this.segmentIndex = segmentIndex
        
        this.generateTiming()
        this.generatePitch()
        return this.segment
    }

    //Generation of durations
    generateTiming(){
        
        for(let i in this.motif.objects){
            this.segment.objects.push(
                this.motif.objects[i]
            )
        }
    }
    
    //Generation of pitches
    generatePitch(){
       return
    }
}