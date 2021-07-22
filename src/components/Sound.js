import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';

// INIT

// NON FUNZIONA
// const toneContext = new Tone.Context({ latencyHint: "playback" });
// Tone.setContext(toneContext);

const analyserBus = new Tone.Channel(0, 0);
let baseVolume = -15.0;
Tone.Transport.bpm.value = 60;

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
    let verb = new Tone.Freeverb(0.8, 6000);
    chain[chain.length - 1].connect(verb);
    verb.connect(analyserBus);
    analyserBus.connect(Tone.getDestination());
    // chain[chain.length - 1].connect(analyserBus);
    // analyserBus.connect(Tone.Master);
}

// let sequence = [
//     { type: 'note', onsetTime: 0.25, duration: 0.125, pitch: "C4"},
//     { type: 'note', onsetTime: 0.375, duration: 0.25, pitch: "E4"},
//     { type: 'note', onsetTime: 0.625, duration: 0.125, pitch: "G4"},
// ];

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
//     }, 1);
//     //loop.humanize = instrument['humanize'];
//     // loop.probability = instrument['probability'];
//     loop.start();
// }

function createLoop(instrument) {
    let loop = new Tone.Loop(function (time) {
        let notes = instrument['notes'];
        let note = notes[getRandomInt(0, notes.length)];
        instrument['synth'].triggerAttackRelease(
            note,
            instrument['timeDelay'],
            time
        );
    }, instrument['timeDelay']);
    loop.humanize = instrument['humanize'];
    loop.probability = instrument['probability'];
    loop.start();
}

function createLoop(instrument, values) {
    const part = new Tone.Part(((time, values) => {
        // the value is an object which contains both the note and the velocity
        instrument['synth'].triggerAttackRelease(values.pitch, velues.duration, values.onset, value.velocity);
    }), [{ time: 0, note: "C3", velocity: 0.9 },
        { time: "0:2", note: "C4", velocity: 0.5 }
    ])
}



// INSTRUMENTS

function createSynthPad() {

    let synth = new Tone.DuoSynth();
    synth.set({
        volume: baseVolume - 10.0,
        portamento: 0.7,
        harmonicity: 1.5,
        vibratoAmount: 0.1,
        vibratoRate: '4n',

        voice0: {
            oscillator: {
                type: 'fatsawtooth8',
            },
            envelope: {
                attack: 2,
                decay: 1,
                sustain: 0.8,
                release: 0,
            },
        },
        voice1: {
            oscillator: {
                type: 'fatsawtooth10',
            },
            envelope: {
                attack: 2,
                decay: 1,
                sustain: 0.8,
                release: 0,
            },
        }
    });

    // let dist = new Tone.Chebyshev(7);
    // let filter = new Tone.Filter(800, 'lowpass');
    // let chorus = new Tone.Chorus('3n', 35, 0.65);
    // let delay = new Tone.PingPongDelay("8n", 0.2);
    // let verb = new Tone.Freeverb(0.80, 6000);

    let chain = [synth];

    connectEffectsChain(chain);

    let humanize = 0;
    let probability = 1;

    return {
        synth: synth,
        humanize: humanize,
        probability: probability,
    };
}

function createSynthLead() {
    let synth = new Tone.Synth({
        volume: baseVolume - 15.0,
        portamento: 0.3,
        oscillator: {
            type: 'amsine',
        },
        envelope: {
            attack: 1,
            decay: 2,
            sustain: 0,
            release: 5,
        },

        detune: 0.5,
    });
    //synth.sync();

    // let chorus = new Tone.Chorus("1m", 10, 0.5);
    // let pingPong = new Tone.PingPongDelay("8n", 0.7);
    // let panner = new Tone.AutoPanner("4n").start();
    // let tremolo = new Tone.Tremolo("2m", 0.5).start();
    // let verb = new Tone.Freeverb(0.80, 3000);
    // let filter = new Tone.Filter(300, "highpass")

    let chain = [synth];

    connectEffectsChain(chain);

    let humanize = 0.2;
    let probability = 1;

    return {
        synth: synth,
        humanize: humanize,
        probability: probability,
    };
}

function createSynthBell() {
    let synth = new Tone.Synth();
    synth.set({
        harmonicity: 8,
        modulationIndex: 2,
        oscillator: {
            type: 'sine',
        },
        envelope: {
            attack: 0.001,
            decay: 2,
            sustain: 0,
            release: 2,
        },
        modulation: {
            type: 'triangle',
        },
        modulationEnvelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0,
            release: 0.5,
        },
        volume: baseVolume - 5.0,
    });
    //synth.sync();

    //let filter1 = new Tone.Filter(5000, "highpass");
    let pingPong = new Tone.FeedbackDelay('2t', 0.4);
    // let panner = new Tone.AutoPanner('1m', 0.5).start();
    // let verb = new Tone.Freeverb(0.80, 6000);
    // let filter2 = new Tone.Filter(1000, "highpass")

    let chain = [synth, pingPong];
    connectEffectsChain(chain);

    let humanize = 0.5;
    let probability = 0.2;

    return {
        synth: synth,
        humanize: humanize,
        probability: probability,
    };
}

// function createSynthFX() {
//     let synth = new Tone.FMSynth();
//     synth.set({
//         volume: baseVolume + 10.0,
//         //"portamento": 0.1,
//         harmonicity: 1.5,
//         oscillator: {
//             type: 'square4',
//         },
//         envelope: {
//             attack: 0.01,
//             decay: 0.1,
//             sustain: 0.1,
//             release: 0.5,
//         },
//     });
//     //synth.sync();

//     // let dist = new Tone.Chebyshev(4);
//     // let chorus = new Tone.Chorus("8n", 30, 1);
//     // let delay = new Tone.PingPongDelay("16n", 0.6);
//     // let verb = new Tone.Freeverb(0.60, 8000);
//     // let filter = new Tone.Filter(300, "highpass")

//     let chain = [synth];
//     connectEffectsChain(chain);
//     let synthParams = createSynthParams(chain);

//     let notes = ['C4', 'D4', 'E4', 'A4', 'C5', 'D5', 'E5', 'A5'];
//     let timeDelay = '8n';
//     let humanize = 0.2;
//     let probability = 0.1;

//     return {
//         synth: synth,
//         synthParams: synthParams,
//         notes: notes,
//         timeDelay: timeDelay,
//         humanize: humanize,
//         probability: probability,
//     };
// }

var pad = createSynthPad();
var lead = createSynthLead();
var bell = createSynthBell();

const Sound = (props) => {

    // useEffect(() => {

    // }, []); // never update

    // useEffect(() => {
    //     console.log(props.chords, props.melody);
    // }, [props.melody]); // update when prop changes
    
    return <></>;
};

export default Sound;

export const generateSounds = () => {};
export var context = Tone.getContext();
export var bus = analyserBus;

// TEST LATENCY HINT

// import * as Tone from 'tone';

// const toneContext = new Tone.Context({ latencyHint: "playback" });
// Tone.setContext(toneContext);

// let baseVolume = -10.0;
// const analyserBus = new Tone.Channel(0, 0);
// Tone.Transport.bpm.value = 60;

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function createLoop(instrument) {
//     let loop = new Tone.Loop(function (time) {
//         let notes = instrument['notes'];
//         let note = notes[getRandomInt(0, notes.length)];
//         instrument['synth'].triggerAttackRelease(
//             note,
//             instrument['timeDelay'],
//             time
//         );
//     }, instrument['timeDelay']);
//     loop.humanize = instrument['humanize'];
//     loop.probability = instrument['probability'];
//     loop.start();
// }

// var duoSynth = new Tone.DuoSynth();
// duoSynth.connect(analyserBus);
// analyserBus.connect(Tone.getDestination());

// export var context = Tone.getContext();
// export var bus = analyserBus;

// const generateSounds = () => {
//     duoSynth.triggerAttackRelease("C4", "2n");
// };

// export default generateSounds;