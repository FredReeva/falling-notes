import * as Tone from 'tone';
import ChordsMenu from './ChordsMenu';

let baseVolume = -18.0;
const analyserBus = new Tone.Channel(0, 0);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function connectEffectsChain(chain) {
    for (let i = 0; i < chain.length - 1; i += 1) {
        chain[i].connect(chain[i + 1]);
    }
    // let pingPong = new Tone.PingPongDelay("8n", 0.7);
    // // let verb = new Tone.Freeverb(0.80, 6000);
    // chain[chain.length - 1].connect(pingPong);
    // pingPong.connect(analyserBus);
    // analyserBus.connect(Tone.Master);
    chain[chain.length - 1].connect(analyserBus);
    analyserBus.connect(Tone.Master);
}

function createSynthParams(chain) {
    let lastSignalChain = chain[chain.length - 1];

    return {
        enabled: true,

        stop: function () {
            if (this.enabled !== false) {
                this.enabled = false;
                lastSignalChain.disconnect(Tone.Master);
            }
        },

        start: function () {
            if (this.enabled !== true) {
                this.enabled = true;
                lastSignalChain.connect(Tone.Master);
            }
        },
    };
}

let sequence = [
    { type: 'note', onsetTime: 0.25, duration: 0.125, pitch: "C4"},
    { type: 'note', onsetTime: 0.375, duration: 0.25, pitch: "E4"},
    { type: 'note', onsetTime: 0.625, duration: 0.125, pitch: "G4"},
];

// let i=0;

// function createLoop(instrument) {
//     let loop = new Tone.Loop(function (time) {
//         // let sequence = ChordsMenu.melody;
//         for (let i = 0; i < sequence.length; i++) {
//             if (sequence[i].type == 'note') {
//                 instrument['synth'].triggerAttackRelease(
//                     sequence[i].pitch,
//                     sequence[i].duration,
//                     sequence[i].onsetTime
//                 );
//             }
//         }
//         console.log("loop");
//     }, 0.8);
//     loop.humanize = instrument['humanize'];
//     // loop.probability = instrument['probability'];
//     loop.start();
// }

function createLoop (instrument) {
    let loop = new Tone.Loop(function(time) {
        let notes = instrument["notes"];
        let note = notes[getRandomInt(0, notes.length)];
        instrument["synth"].triggerAttackRelease(note, instrument["timeDelay"], time);
    }, instrument["timeDelay"]);
    loop.humanize = instrument["humanize"];
    loop.probability = instrument["probability"];
    loop.start();
}

// instruments

function createSynthPad() {

    let synth = new Tone.DuoSynth();
    synth.set({
        "volume": baseVolume - 10.0,
        "portamento": 0.7,
        "harmonicity": 1.5,
        "vibratoAmount": 0.1,
        "vibratoRate": "4n",

        "voice0": {
            "oscillator": {
                "type": "sawtooth6"
            },
            "envelope": {
                "attack": 2,
                "decay": 1,
                "sustain": 0.8,
                "release": 0
            },
        },
    });

    let dist = new Tone.Chebyshev(7);
    let filter = new Tone.Filter(800, "lowpass")
    let chorus = new Tone.Chorus("3n", 35, 0.65);
    // let delay = new Tone.PingPongDelay("8n", 0.2);
    // let verb = new Tone.Freeverb(0.80, 6000);

    let chain = [
        synth,
        dist,
        chorus,
        filter
    ];

    connectEffectsChain(chain);
    let synthParams = createSynthParams(chain);

    let notes = ["E2", "A1", "C2", "G2"];
    let timeDelay = "1m";
    let humanize = 0;
    let probability = 1;

    return {
        synth: synth,
        synthParams: synthParams,
        notes: notes,
        timeDelay : timeDelay,
        humanize : humanize,
        probability : probability
    };
}

function createSynthFX() {

    let synth = new Tone.FMSynth();
    synth.set({
        "volume": baseVolume + 10.0,
        //"portamento": 0.1,
        "harmonicity": 1.5,
        "oscillator": {
            "type": "square4"
        },
        "envelope": {
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.1,
            "release": 0.5,
        }
    });

    // let dist = new Tone.Chebyshev(4);
    // let chorus = new Tone.Chorus("8n", 30, 1);
    // let delay = new Tone.PingPongDelay("16n", 0.6);
    // let verb = new Tone.Freeverb(0.60, 8000);
    // let filter = new Tone.Filter(300, "highpass")

    let chain = [
        synth
    ];
    connectEffectsChain(chain);
    let synthParams = createSynthParams(chain);

    let notes = ["C4", "D4", "E4", "A4", "C5", "D5", "E5", "A5"];
    let timeDelay = "8n";
    let humanize = 0.2;
    let probability = 0.1;

    return {
        synth: synth,
        synthParams: synthParams,
        notes: notes,
        timeDelay : timeDelay,
        humanize : humanize,
        probability : probability
    };
}

function createSynthLead() {

    let synth = new Tone.Synth({
        "volume": baseVolume - 15.0,
        "portamento": 0.3,
        "oscillator": {
            "type": "amsine"
        },
        "envelope": {
            "attack": 1,
            "decay": 2,
            "sustain": 0,
            "release": 5,
        },

        "detune": 0.5,
    });

    // let chorus = new Tone.Chorus("1m", 10, 0.5);
    // let pingPong = new Tone.PingPongDelay("8n", 0.7);
    // let panner = new Tone.AutoPanner("4n").start();
    // let tremolo = new Tone.Tremolo("2m", 0.5).start();
    // let verb = new Tone.Freeverb(0.80, 3000);
    // let filter = new Tone.Filter(300, "highpass")

    let chain = [
        synth,
    ];

    connectEffectsChain(chain);
    let synthParams = createSynthParams(chain);

    let notes = ["C4", "D4", "E4", "A4", "C5", "D5", "E5", "A5"];
    let timeDelay = "1q";
    let humanize = 0.2;
    let probability = 1;

    return {
        synth: synth,
        synthParams: synthParams,
        notes: notes,
        timeDelay : timeDelay,
        humanize : humanize,
        probability : probability
    };
}

function createSynthBell() {
    let synth = new Tone.Synth();
    synth.set({
        "harmonicity": 8,
        "modulationIndex": 2,
        "oscillator": {
            "type": "sine"
        },
        "envelope": {
            "attack": 0.001,
            "decay": 2,
            "sustain": 0,
            "release": 2
        },
        "modulation": {
            "type": "triangle"
        },
        "modulationEnvelope": {
            "attack": 0.001,
            "decay": 0.2,
            "sustain": 0,
            "release": 0.5
        },
        "volume": baseVolume - 5.0
    });

    // let filter1 = new Tone.Filter(5000, "highpass")
    // let pingPong = new Tone.FeedbackDelay("2t", 0.4);
    // let panner = new Tone.AutoPanner("1m", 0.5).start();
    // let verb = new Tone.Freeverb(0.80, 6000);
    // let filter2 = new Tone.Filter(1000, "highpass")

    let chain = [
        synth
    ]
    connectEffectsChain(chain);
    let synthParams = createSynthParams(chain);

    let notes = ["C6", "D6", "E6", "A6", "C7", "D7", "E7", "A7"];
    let timeDelay = "8n";
    let humanize = 0.5;
    let probability = 0.2;

    return {
        synth: synth,
        synthParams: synthParams,
        notes: notes,
        timeDelay : timeDelay,
        humanize : humanize,
        probability : probability
    };
}

export var context = Tone.getContext();
export var bus = analyserBus;

const generateSounds = () => {
    var pad = createSynthPad();
    createLoop(pad);
    // var fx = createSynthFX();
    // createLoop(fx);
    // var lead = createSynthLead();
    // createLoop(lead);
    // var bell = createSynthBell();
    // createLoop(bell);
};

export default generateSounds;
