import * as Tone from 'tone';
import ChordsMenu from './ChordsMenu';

let baseVolume = -15.0;
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

function createLoop(instrument) {
    let loop = new Tone.Loop(function (time) {
        // let sequence = ChordsMenu.melody;
        let sequence = [
            { type: 'pause', onsetTime: 0.25, duration: 0.125 },
            { type: 'pause', onsetTime: 0.375, duration: 0.25 },
            { type: 'note', onsetTime: 0.625, duration: 0.125, pitch: 62 },
        ];
        for (let i = 0; i < sequence.length; i++) {
            if (sequence.type == 'note') {
                instrument['synth'].triggerAttackRelease(
                    sequence.objects[i].pitch,
                    sequence.objects[i].duration,
                    sequence.objects[i].onsetTime
                );
            }
        }
    }, sequence.objects[i].duration + sequence.objects[i].onsetTime);
    loop.humanize = instrument['humanize'];
    // loop.probability = instrument['probability'];
    loop.start();
}

// instruments

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
                type: 'sawtooth6',
            },
            envelope: {
                attack: 2,
                decay: 1,
                sustain: 0.8,
                release: 0.1,
            },
        },
    });
    let chain = [synth];

    connectEffectsChain(chain);
    let synthParams = createSynthParams(chain);

    let notes = ['E6', 'A6', 'C6', 'G6'];
    let timeDelay = '2m';
    let humanize = 0;
    let probability = 1;

    return {
        synth: synth,
        synthParams: synthParams,
        notes: notes,
        timeDelay: timeDelay,
        humanize: humanize,
        probability: probability,
    };
}

export var context = Tone.getContext();
export var bus = analyserBus;

const generateSounds = () => {
    var pad = createSynthPad();
    createLoop(pad);
};

export default generateSounds;
