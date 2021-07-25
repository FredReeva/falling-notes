/*
*/
export class OnsetTime {
    constructor(piece) {
        this.piece = JSON.parse(JSON.stringify(piece));
    }

    
    generate() {
        let onsetTime = 0.00

        for (let i = 0; i < this.piece.segments.length; i++) {
            for(let j=0; j<this.piece.segments[i].objects.length; j++){
                this.piece.segments[i].objects[j].onsetTime = onsetTime
                onsetTime += this.piece.segments[i].objects[j].duration
            }
        }

        return this.piece;
    }
}
