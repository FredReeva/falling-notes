import * as Utils from '../../utils.js'
import * as Filters from './pitch.filters.js'
import * as Const from './pitch.constants.js'

export class Pitch{
    constructor(segment){
        this.segment = segment
    }
    generate(startingNote=null){
        let debug = {}
        let diatonicPitches = []
        let minPitch = null
        let maxPitch = null
        let localRangeDirection = null
       
        for(let i in this.segment.objects){
            if(this.segment.objects[i].type == 'pause'){
                delete this.segment.objects[i].pitch
                continue
            }

            let filteredNotes = []
            for(let j=0; j<this.segment.diatonicScale.notes.length; j++){
                filteredNotes.push(this.segment.diatonicScale.notes[j])
            }

            

            // Filter chord notes on beat (all octaves)
            if (i % 8 == 0){

                if(diatonicPitches.length == 0){
                    debug.topFilteredNotes = filteredNotes
                    debug.chordNotes = this.segment.chord.notes
                }
                
                //Convert chord notes
                let diatonicChordNotes = []
                for(let n=0; n<this.segment.chord.notes.length; n++){
                    let note = this.segment.chord.notes[n]
                    diatonicChordNotes.push(Const.cromaticToDiatonic[note])
                }

                filteredNotes = Filters.specifiedNotes(filteredNotes, diatonicChordNotes)

                if(diatonicPitches.length == 0){
                    debug.secondFilteredNotes = diatonicChordNotes
                }
            }

            // Filter melodic contour
            if(diatonicPitches.length > 0){
                filteredNotes = Filters.melodicCountour(filteredNotes, diatonicPitches, this.segment.directionality)
                
                debug.melodicContour = Filters.NaNclean(this.segment.diatonicScale.notes, filteredNotes)
            }

            // Filter local range
            if(diatonicPitches.length > 0){
                //CONSTR: For first note sign of localRange = segment.direction
                if(diatonicPitches.length == 1 && this.segment.directionality != '0'){
                    localRangeDirection = this.segment.directionality
                }else{
                    localRangeDirection = Utils.randItem(['+', '-'])
                }

                debug.localRangeDirection = localRangeDirection

                filteredNotes = Filters.localRange(filteredNotes, diatonicPitches[diatonicPitches.length - 1], localRangeDirection)
                
                debug.localRange = Filters.NaNclean(this.segment.diatonicScale.notes, filteredNotes)
            }

            // Filter global range
            if(diatonicPitches.length > 0){
                filteredNotes = Filters.globalRange(filteredNotes, minPitch, maxPitch)

                debug.globalRange = Filters.NaNclean(this.segment.diatonicScale.notes, filteredNotes)
            }

            let NOTE = null
            
            if(diatonicPitches.length == 0){
                debug.firstFilteredNotes = filteredNotes
               

                if(startingNote == null){
                    filteredNotes = Filters.startingOctave(filteredNotes)
                }else{   
                    
                    let diatonicStartingPitch = Const.cromaticToDiatonic[startingNote % 12]
                    let diatonicStartingOctave = Math.floor(startingNote / 12) * 7
                    let diatonicStartingNote = diatonicStartingPitch + diatonicStartingOctave + 28

                    filteredNotes = [Utils.nearestNote(filteredNotes, diatonicStartingNote)]
                }
                
                NOTE = Utils.randItem(filteredNotes)
                minPitch = NOTE
                maxPitch = NOTE
                debug.firstNote = NOTE

            }else if(filteredNotes.length == 1){
                NOTE = filteredNotes[0]
                if(NOTE < minPitch) minPitch = NOTE
                if(NOTE > maxPitch) maxPitch = NOTE

            }else{
                let lastnote = diatonicPitches[diatonicPitches.length - 1]
                let lastNotePosition = null
                let cleanedDiatonic = Filters.NaNclean(this.segment.diatonicScale.notes, filteredNotes)
                for(let n=0; n<cleanedDiatonic.length; n++){
                    if(cleanedDiatonic[n] == lastnote){
                        lastNotePosition = n
                        break
                    }
                }

                //Final noteset
                let noteSet = []
                if(localRangeDirection == '+'){
                    for(let r=0; r<5; r++){
                        noteSet.push(cleanedDiatonic[lastNotePosition + r])
                    }
                }else if(localRangeDirection == '-'){
                    for(let j=0; j<5; j++){
                        noteSet.push(cleanedDiatonic[lastNotePosition - j])
                    }
                }


                //Pick note
                let probsProto = [
                    [noteSet[0], 10],
                    [noteSet[1], 60],
                    [noteSet[2], 15],
                    [noteSet[3], 10],
                    [noteSet[4], 5],
                ]

                let probs = []
                let sumprobs = 0

                //exclude nans
                for(let n=0; n<probsProto.length; n++){
                    if(!Number.isNaN(probsProto[n][0])){
                        if(probsProto[n][0] != null){
                            probs.push(probsProto[n])
                            sumprobs += probsProto[n][1]
                        }  
                    }
                }

                //Adjust probs
                for(let p=0; p<probs.length; p++){
                    probs[p][1] = (probs[p][1] / sumprobs) * 100
                }
                
                debug.probs = probs
                
                NOTE = Utils.pickState(probs)

                if(NOTE < minPitch) minPitch = NOTE
                if(NOTE > maxPitch) maxPitch = NOTE

            }

            diatonicPitches.push(NOTE)
            debug.diatonicPitches = diatonicPitches
            
            this.segment.objects[i].pitch = this.diatonicToCromatic(NOTE, this.segment.diatonicScale.cromaticOffset)
        }

        //BUG WORKAROUND PATCH: prevent NaN pitches
        for(let w=0; w<this.segment.objects.length; w++){
            
            if(this.segment.objects[w].type=="pause") continue
            
            if(Number.isNaN(this.segment.objects[w].pitch)){
                console.warn("NaN fixed")
                delete this.segment.objects[w].pitch
                this.segment.objects[w].type = 'pause'
            }

            if(this.segment.objects[w].pitch == null){
                console.log(this.segment.objects[w])
                console.warn("Null fixed")
                delete this.segment.objects[w].pitch
                this.segment.objects[w].type = 'pause'
            }
        }
        
        return this.segment
    }


    diatonicToCromatic(diatonicPitch, cromaticOffset){
        let diatonicNote = diatonicPitch % 7
        let octave = Math.floor(diatonicPitch / 7)
        let cromaticNote = Const.diatonicToCromaticNote(diatonicNote, cromaticOffset)
        return cromaticNote+((12*octave)-48)
    }
}