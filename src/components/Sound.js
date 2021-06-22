import * as Tone from 'tone';

let baseVolume = -15.0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function connectEffectsChain(chain) {
    for (let i = 0; i < chain.length - 1; i += 1) {
        chain[i].connect(chain[i + 1]);
    }

    chain[chain.length - 1].connect(Tone.Master);
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
    //Tone.Transport.start();
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

    let notes = ['E2', 'A2', 'C2', 'G2'];
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

const generateSounds = () => {
    var pad = createSynthPad();
    createLoop(pad);
};

export default generateSounds;
