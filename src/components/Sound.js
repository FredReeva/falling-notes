import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import { convert, chordNotes } from '../libraries/melodygen/utils.js';

// INIT

// NON FUNZIONA
// const toneContext = new Tone.Context({ latencyHint: "playback" });
// Tone.setContext(toneContext);

const analyserBus = new Tone.Channel(0, 0);
let baseVolume = -15.0;

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

let songTempo = 120;

let melodyInstrument = [];
let melodyLoop = [];
let melodySequence = [];

let chordInstrument = [];
let chordLoop = [];
let chordSequence = [];
let loopDuration = 0;

function createChordLoop(instrument) {
    if (chordSequence != []) {
        let loop = new Tone.Loop(function (time) {
            chordSequence.forEach((chord) => {
                instrument['synth'].triggerAttackRelease(
                    chord.notes,
                    parseInt(chord.duration)*(120/songTempo),
                    time+chord.time*(120/songTempo),
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
                        note.duration*(120/songTempo),
                        time+note.onsetTime*(120/songTempo),
                        1
                    );
                } else { //pause = note with 0 velocity and random pitch
                    instrument['synth'].triggerAttackRelease(
                        60,
                        note.duration*(120/songTempo),
                        time+note.onsetTime*(120/songTempo),
                        0
                    );
                }
            });
        }, loopDuration);
        loop.humanize = instrument['humanize'];
        // loop.probability = instrument['probability'];
        loop.start();
        return loop
    }
}

// INSTRUMENTS

function createSynthPiano() {

    let polySynthPiano = new Tone.PolySynth();
    polySynthPiano.set({
        volume: baseVolume + 3.0,
        oscillator: {
            type: "fatsine",
            spread: Math.random()*20
            //detune: Math.random()*25
        },
        envelope: {
            attack: 0.075,
            decay: 6,
            sustain: 0.1,
            release: 0.1,
        }
    });
    //polySynthPiano.sync();

    let eq = new Tone.EQ3(-3, 0, 0);
    let tremolo = new Tone.Tremolo(10, 1).start();

    let chain = [polySynthPiano, tremolo, eq];

    connectEffectsChain(chain);

    let humanize = 0;
    let probability = 1;

    return {
        synth: polySynthPiano,
        humanize: humanize,
        probability: probability,
    };
}

function createSynthPad() {

    let polySynthPad = new Tone.PolySynth();
    polySynthPad.set({
        volume: baseVolume - 20.0,
        oscillator: {
            type: "pwm",
            modulationFrequency: 0.2,
            detune: Math.random()*14
        },
        envelope: {
            attack: 0.7,
            decay: 2,
            sustain: 0.7,
            release: 0.9,
        }
    });
    //polySynthPad.sync();

    let eq = new Tone.EQ3(4, 0, 0);
    let vibrato = new Tone.Vibrato(20, 0.07);
    let filt = new Tone.Filter(1200, "lowpass", -24);
    let lfo = new Tone.LFO(0.2, 600, 1200);
    lfo.connect(filt.frequency);
    lfo.start();

    let chain = [polySynthPad, vibrato, filt, eq];

    connectEffectsChain(chain);

    let humanize = 0;
    let probability = 1;

    return {
        synth: polySynthPad,
        humanize: humanize,
        probability: probability,
    };
}

function createSynthLead() {
    let lead = new Tone.Synth({
        volume: baseVolume - 25.0,
        portamento: 0.01,
        oscillator: {
            type: 'amsine',
        },
        envelope: {
            attack: 0.8,
            decay: 2,
            sustain: 0.2,
            release: 0.5,
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

    let chain = [lead];

    connectEffectsChain(chain);

    let humanize = 0.2;
    let probability = 1;

    return {
        synth: lead,
        humanize: humanize,
        probability: probability,
    };
}

function createSynthBell() {
    let bells = new Tone.Synth();
    bells.set({
        harmonicity: 8,
        modulationIndex: 2,
        oscillator: {
            type: 'sine',
        },
        envelope: {
            attack: 0.01,
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
        volume: baseVolume - 6.0,
    });
    //synth.sync();

    let pingPong = new Tone.FeedbackDelay('8t', 0.3);
    let filter2 = new Tone.Filter(400, "highpass")

    let chain = [bells, pingPong, filter2];
    connectEffectsChain(chain);

    let humanize = 0.5;
    let probability = 0.2;

    return {
        synth: bells,
        humanize: humanize,
        probability: probability,
    };
}

var piano = createSynthPiano();
var pad = createSynthPad();
var lead = createSynthLead();
var bell = createSynthBell();

const Sound = (props) => {

    useEffect(() => {

        songTempo = props.parameters.tempo;

    }, [props.parameters.tempo]); // update when prop changes

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
        let octave = 4;
        let bassnote = 1;
        if (props.parameters.chordSound == 'Piano') {
            bassnote = 1;
        } else if (props.parameters.chordSound == 'Pad') {
            bassnote = 2;
        }
        props.chords.forEach((chord) => {
            let input = { tonic: chord['tonic'] , color: chord['quality'] };
            let tonic = chordNotes(input, octave-bassnote);
            let notes = chordNotes(input, octave);
            notes.push(tonic[0]);
            chordSequence.push({ time: chordOnSet, notes: notes, duration: chord['duration'] });
            chordOnSet += parseInt(chord['duration']);
            loopDuration = chordOnSet;
        });
        // create chord loop(s) and handle to delete it
        let chords = createChordLoop(chordInstrument);
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
        let melody = createMelodyLoop(melodyInstrument);
        melodyLoop.push(melody);
        
    }, [props.melody]); // update when prop changes

    useEffect(() => {

        // CHORDS
        // delete previous chords sequence(s)
        chordLoop.forEach((loop) => {
            loop.dispose();
            chordLoop.pop(loop);
        });
        // change instrument
        if (props.parameters.chordSound == 'Piano') {
            chordInstrument = piano;
        } else if (props.parameters.chordSound == 'Pad') {
            chordInstrument = pad;
        }
        // create chord loop(s) and handle to delete it
        let chords = [];
        chords = createChordLoop(chordInstrument);
        chordLoop.push(chords);
        console.log('changed', chordInstrument);

        // MELODY
        // delete previous melody sequence(s)
        melodyLoop.forEach((loop) => {
            loop.dispose();
            melodyLoop.pop(loop);
        });
        // change instrument
        if (props.parameters.melodySound == 'Synth') {
            melodyInstrument = lead;
        } else if (props.parameters.melodySound == 'Bells') {
            melodyInstrument = bell;
        }
        // create melody loop(s) and handle to delete it
        let melody = [];
        melody = createMelodyLoop(melodyInstrument);
        melodyLoop.push(melody);
        console.log('changed', melodyInstrument);

    }, [props.parameters.melodySound, props.parameters.chordSound]); // update when prop changes
    
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
