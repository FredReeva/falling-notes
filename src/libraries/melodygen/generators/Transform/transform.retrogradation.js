//Computation of pitches and rhythms in reverse
export default class Retrogradation{
    constructor(piece, segmentIndex, motif){
        this.piece = piece
        this.motif = motif
        this.segment = piece.segments[segmentIndex]
        this.previousSegment = (segmentIndex > 0) ? piece.segments[segmentIndex-1] : null
        this.segmentIndex = segmentIndex
        
        this.generateTiming()
        this.generatePitch()
        return this.segment
    }

    //Generation of durations
    generateTiming(){
        for(let i=0; i<this.motif.objects.length; i++){
            this.segment.objects.push(
                this.motif.objects[(this.motif.objects.length-1) - i]
            )
        }
    }
    
    //Generation of pitches
    generatePitch(){
       return
    }
}