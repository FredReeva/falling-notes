import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import { convert, chordNotes } from '../libraries/melodygen/utils.js';

// INIT

// NON FUNZIONA
// const toneContext = new Tone.Context({ latencyHint: "playback" });
// Tone.setContext(toneContext);

const analyserBus = new Tone.Channel(0, 0);
let baseVolume = -15.0;
Tone.Transport.bpm.value = 60;

function connectEffectsChain(chain) {
    for (let i = 0; i < chain.length - 1; i += 1) {
        chain[i].connect(chain[i + 1]);
    }
    // let pingPong = new Tone.PingPongDelay("8n", 0.7);
    // let verb = new Tone.Freeverb(0.8, 6000);
    // chain[chain.length - 1].connect(verb);
    // verb.connect(analyserBus);
    // analyserBus.connect(Tone.getDestination());
    chain[chain.length - 1].connect(analyserBus);
    analyserBus.connect(Tone.getDestination());
}

function createSynthParams(chain) {
    let lastSignalChain = chain[chain.length - 1];
    return {
        enabled: true,
        stop: function () {
            if (this.enabled !== false) {
                this.enabled = false;
                lastSignalChain.disconnect(Tone.getDestination());
            }
        },
        start: function () {
            if (this.enabled !== true) {
                this.enabled = true;
                lastSignalChain.connect(Tone.getDestination());
            }
        },
    };
}

let melodyLoop = [];
let melodySequence = [];
let chordLoop = [];
let chordSequence = [];
let loopDuration = 0;

function createChordLoop(instrument) {
    if (chordSequence != []) {
        let loop = new Tone.Loop(function (time) {
            chordSequence.forEach((chord) => {
                instrument['synth'].triggerAttackRelease(
                    chord.notes,
                    parseInt(chord.duration),
                    time+chord.time,
                    1
                );
            });
        }, loopDuration);
        // loop.humanize = instrument['humanize'];
        // loop.probability = instrument['probability'];
        loop.start();
        return loop
    }
}

function createMelodyLoop(instrument) {
    if (melodySequence != []) {
        let loop = new Tone.Loop(function (time) {
            melodySequence.forEach((note) => {
                if (note.type == 'note') {
                    let m = note.pitch;
                    let f = Math.pow( 2, (m-69)/12 ) * 440;
                    instrument['synth'].triggerAttackRelease(
                        f,
                        note.duration,
                        time+note.onsetTime,
                        1
                    );
                } else { //pause = note with 0 velocity and random pitch
                    instrument['synth'].triggerAttackRelease(
                        60,
                        note.duration,
                        time+note.onsetTime,
                        0
                    );
                }
            });
        }, loopDuration);
        // loop.humanize = instrument['humanize'];
        // loop.probability = instrument['probability'];
        loop.start();
        return loop
    }
}



// INSTRUMENTS

function createSynthPad() {

    // let synth = new Tone.DuoSynth();
    // synth.set({
    //     volume: baseVolume - 10.0,
    //     portamento: 0.7,
    //     harmonicity: 1.5,
    //     vibratoAmount: 0.1,
    //     vibratoRate: '4n',

    //     voice0: {
    //         oscillator: {
    //             type: 'fatsawtooth8',
    //         },
    //         envelope: {
    //             attack: 2,
    //             decay: 1,
    //             sustain: 0.8,
    //             release: 0,
    //         },
    //     },
    //     voice1: {
    //         oscillator: {
    //             type: 'fatsawtooth10',
    //         },
    //         envelope: {
    //             attack: 2,
    //             decay: 1,
    //             sustain: 0.8,
    //             release: 0,
    //         },
    //     }
    // });

    let pad = {
        oscillator: {
            type: 'fatsine8',
        },
        envelope: {
            attack: 0.005,
            decay: 0,
            sustain: 1,
            release: 0.2,
        }
    }

    let polySynth = new Tone.PolySynth(pad);
    polySynth.set({
        volume: baseVolume - 15.0,
    });

    // let eq = new Tone.EQ3(3, -3, -6)
    // let chorus = new Tone.Chorus(5, 7, 1);

    let chain = [polySynth];

    connectEffectsChain(chain);

    let humanize = 0;
    let probability = 1;

    return {
        synth: polySynth,
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

function createSynthFX() {
    let synth = new Tone.FMSynth();
    synth.set({
        volume: baseVolume + 10.0,
        //"portamento": 0.1,
        harmonicity: 1.5,
        oscillator: {
            type: 'square4',
        },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.1,
            release: 0.5,
        },
    });
    //synth.sync();

    // let dist = new Tone.Chebyshev(4);
    // let chorus = new Tone.Chorus("8n", 30, 1);
    // let delay = new Tone.PingPongDelay("16n", 0.6);
    // let verb = new Tone.Freeverb(0.60, 8000);
    // let filter = new Tone.Filter(300, "highpass")

    let chain = [synth];
    connectEffectsChain(chain);
    let synthParams = createSynthParams(chain);

    let notes = ['C4', 'D4', 'E4', 'A4', 'C5', 'D5', 'E5', 'A5'];
    let timeDelay = '8n';
    let humanize = 0.2;
    let probability = 0.1;

    return {
        synth: synth,
        synthParams: synthParams,
        notes: notes,
        timeDelay: timeDelay,
        humanize: humanize,
        probability: probability,
    };
}

var pad = createSynthPad();
var lead = createSynthLead();
var bell = createSynthBell();
var fx = createSynthFX();

const Sound = (props) => {
    // useEffect(() => {

    // }, []); // never update

    useEffect(() => {

        // CHORDS
        // delete previous chords sequence(s)
        chordLoop.forEach((loop) => {
            loop.dispose();
            chordLoop.pop(loop);
        });
        // init sequence and determine chord notes
        chordSequence = [];
        loopDuration = 0;
        let chordOnSet = 0;
        props.chords.forEach((chord) => {
            let input = { tonic: chord['tonic'] , color: chord['quality'] };
            let notes = chordNotes(input, 4);
            chordSequence.push({ time: chordOnSet, notes: notes, duration: chord['duration'] });
            chordOnSet += parseInt(chord['duration']);
            loopDuration = chordOnSet;
        });
        // create chord loop(s) and handle to delete it
        let chords = createChordLoop(pad);
        chordLoop.push(chords);

        // MELODY
        // delete previous melody sequence(s)
        melodyLoop.forEach((loop) => {
            loop.dispose();
            melodyLoop.pop(loop);
        });
        // init sequence and determine chord notes
        melodySequence = [];
        props.melody.forEach((note) => {
            melodySequence.push(note);
        });
        // create melody loop(s) and handle to delete it
        let melody = createMelodyLoop(bell);
        melodyLoop.push(melody);
        
    }, [props.melody]); // update when prop changes
    
    return <></>;
};

export default Sound;

export const generateSounds = () => {
};

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
