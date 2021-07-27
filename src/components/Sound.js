import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import { convert, chordNotes } from '../libraries/melodygen/utils.js';

// INIT

let baseVolume = -3.0;
let songTempo = 120;

// connect the premaster signal to two bus for analyzing the signal
const analyserBusLeft = new Tone.Channel(0, 0);
const analyserBusRight = new Tone.Channel(0, 0);
const split = new Tone.Split(2);
split.connect(analyserBusLeft, 0);
split.connect(analyserBusRight, 1);

// enhance hi freq component for analyzer
const eq = new Tone.EQ3(0,0,0);
eq.set({
    high: 18,
    highFrequency: 800,
    mid: 3,
    midFrequency: 300
})
eq.connect(split);

// master fxs for loudness
const comp = new Tone.Compressor(baseVolume-6, 3);
comp.set({
    attack: 0.01,
    release: 0.05,
    knee: 40,
})
const limiter = new Tone.Limiter(baseVolume);
comp.connect(limiter);
limiter.connect(Tone.getDestination());

// function for chaining the instruments to the master bus and the analyzer busses
function connectEffectsChain(chain) {
    for (let i = 0; i < chain.length - 1; i += 1) {
        chain[i].connect(chain[i + 1]);
    }
    chain[chain.length - 1].connect(eq);
    chain[chain.length - 1].connect(comp);
}

// melody and chords sequence init

let melodyInstrument = [];
let melodyLoop = [];
let melodySequence = [];

let chordInstrument = [];
let chordLoop = [];
let chordSequence = [];
let loopDuration = 0;

// function to create the chord loop
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
        }, loopDuration*(120/songTempo));
        loop.start();
        return loop
    }
}

// function to create the melody loop
function createMelodyLoop(instrument, transposition) {
    if (melodySequence != []) {
        let loop = new Tone.Loop(function (time) {
            // for each element, if it's a note, trigger it
            melodySequence.forEach((note) => {
                if (note.type == 'note') {
                    let m = note.pitch;
                    // midi to freq conversion + transposition
                    let f = Math.pow( 2, (m-69+(transposition*12))/12 ) * 440;
                    instrument['synth'].triggerAttackRelease(
                        f,
                        note.duration*(120/songTempo),
                        time+note.onsetTime*(120/songTempo),
                        1
                    );
                } 
            });
        }, loopDuration*(120/songTempo));
        loop.humanize = instrument['humanize'];
        loop.start();
        return loop
    }
}

// INSTRUMENTS

// electric piano type of synth, made with a distorted sine wave, tremolo and chorus
function createSynthPiano() {

    let polySynthPiano = new Tone.PolySynth();
    polySynthPiano.set({
        volume: baseVolume + 3.0,
        oscillator: {
            type: "fatsine",
            spread: Math.random()*20
        },
        envelope: {
            attack: 0.075,
            decay: 6,
            sustain: 0.1,
            release: 0.1,
        }
    });

    let eq = new Tone.EQ3(-3, 0, 0);
    let tremolo = new Tone.Tremolo(10, 0.5).start();
    let chorus = new Tone.Chorus(0.1, 7, 0.3).start();

    let chain = [polySynthPiano, tremolo, eq, chorus];

    connectEffectsChain(chain);

    return {
        synth: polySynthPiano,
    };
}

// pad type of synth, made with pwm oscillator and a LFO controlled filter
function createSynthPad() {

    let polySynthPad = new Tone.PolySynth();
    polySynthPad.set({
        volume: baseVolume - 25.0,
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

    let eq = new Tone.EQ3(6, 0, 0);
    let vibrato = new Tone.Vibrato(20, 0.07);
    let filt = new Tone.Filter(1200, "lowpass", -24);
    let lfo = new Tone.LFO(0.2, 600, 1200);
    lfo.connect(filt.frequency);
    lfo.start();

    let chain = [polySynthPad, vibrato, filt, eq];

    connectEffectsChain(chain);

    return {
        synth: polySynthPad,
    };
}

// lead synth, with chorus and ping pong delay to exploit spatialization, broadband
function createSynthLead() {
    let lead = new Tone.Synth({
        volume: baseVolume - 25.0,
        portamento: 0.01,
        oscillator: {
            type: 'amsine',
        },
        envelope: {
            attack: 0.3,
            decay: 2,
            sustain: 0.2,
            release: 2,
        },

        detune: 0.5,
    });

    let chorus = new Tone.Chorus(0.5, 10, 0.3);
    let pingPong = new Tone.PingPongDelay(1/8*(120/songTempo), 0.4);
    let tremolo = new Tone.Tremolo(2*(120/songTempo), 0.4).start();
    let filter = new Tone.Filter(300, "highpass")

    let chain = [lead, chorus, pingPong, tremolo, filter];

    connectEffectsChain(chain);

    let humanize = 0.2;

    return {
        synth: lead,
        humanize: humanize,
    };
}

// percussive synth, with autopanner and delay to exploit spatialization, narrowband
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
            attack: 0.05,
            decay: 0.2,
            sustain: 0,
            release: 0.5,
        },
        volume: baseVolume - 16.0,
    });

    let autoPanner = new Tone.AutoPanner(0.25*(120/songTempo));
    autoPanner.set({
        depth: 1,
        type: "sawtooth1"
    })
    autoPanner.start();
    let dly = new Tone.FeedbackDelay(1/3*(120/songTempo), 0.25);
    let filter2 = new Tone.Filter(400, "highpass");

    let chain = [bells, autoPanner, dly, filter2];
    connectEffectsChain(chain);

    let humanize = 0.5;
    return {
        synth: bells,
        humanize: humanize,
    };
}

// instantiate the synths
var piano = createSynthPiano();
var pad = createSynthPad();
var lead = createSynthLead();
var bell = createSynthBell();

const Sound = (props) => {

    useEffect(() => {

        songTempo = props.parameters.tempo;

    }, [props.parameters.tempo]); // update when tempo changes

    useEffect(() => {

        // CHORDS
        // delete previous chords sequence(s)
        chordLoop.forEach((loop) => {
            loop.dispose();
            chordLoop.pop(loop);
        });
        // init sequence
        chordSequence = [];
        loopDuration = 0;
        let chordOnSet = 0;
        // change instrument
        let octave = 4;
        let bassnote = 1;
        if (props.parameters.chordSound == 'Piano') {
            bassnote = 1;
            chordInstrument = piano;
        } else if (props.parameters.chordSound == 'Pad') {
            bassnote = 2;
            chordInstrument = pad;
        }
        // determine chord notes
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
        // init sequence
        melodySequence = [];
        props.melody.forEach((note) => {
            melodySequence.push(note);
        });
        // change instrument
        let transpose = 0;
        if (props.parameters.melodySound == 'Synth') {
            melodyInstrument = lead;
            transpose = 0;
        } else if (props.parameters.melodySound == 'Bells') {
            melodyInstrument = bell;
            transpose = 2;
        }
        // create melody loop(s) and handle to delete it
        let melody = createMelodyLoop(melodyInstrument, transpose);
        melodyLoop.push(melody);
        
    }, [props.melody, props.parameters.melodySound, props.parameters.chordSound, props.parameters.tempo]); // update when melody or parameters change
    
    return <></>;
};

export default Sound;

// exports to make the visualizer work
export var context = Tone.getContext();
export var busLeft = analyserBusLeft;
export var busRight = analyserBusRight;