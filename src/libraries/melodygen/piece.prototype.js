const map = function(){
    return {
        pieceDuration: Number, //Total piece duration
        segmentDuration: Number, //Total segment duration
        pausePresence: Number, //Pause probability (0.00 - 1.00)
        staticScaleAssociation: Boolean, //Classic (true) or jazzy (false) modes
        segments: [
            {
                directionality: String,
                transform: {
                    method: Object,
                    vars: Object
                },
                chord: {
                    tonic: String,
                    color: String,
                    notes: Array,
                },
                diatonicScale: {
                    name: String,
                    tonality: Number,
                    cromaticOffset: Number,
                    notes: Array,
                },
                //Musical Object
                objects: [
                    {
                        type: String,
                        onsetTime: Number,
                        duration: Number,
                        pitch: Number
                    }
                ]
            }
        ]
    }
}

export function piece(){
    let piece = map()
    piece.segments = []
    return piece
}

export function segment(){
    let segment = map().segments[0]
    segment.objects = []
    return segment
}


export function object(){
    return map().segments[0].objects[0]
}

export function chord(){
    let chord = map().segments[0].chord
    chord.notes = []
    return chord
}

export function diatonicScale(){
    let scale = map().segments[0].diatonicScale
    scale.notes = []
    return scale
}