import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/GlobalStyles';
import MainMenu from './components/MainMenu';
import ChordsMenu from './components/menu_chords/ChordsMenu';
import World from './components/Background';
import themes from './Themes';
import { MelodyGen } from './libraries/melodygen/main.js';
import firebase from './components/firebase';
import StyleMenu from './components/menu_styles/StyleMenu';
import SongTitleMenu from './components/menu_songs/SongTitleMenu';
import ParametersMenu from './components/menu_parameters/ParametersMenu';
import HelpMenu from './components/help page/HelpMenu';
import { IoInformationCircle } from 'react-icons/io5';

import * as Tone from 'tone';
import Sound from './components/Sound';

function App() {
    // states of the app, passed to the components
    const [showMenu, setShowMenu] = useState([
        false,
        false,
        false,
        false,
        true,
    ]);
    const [songName, updateSongName] = useState('default');
    const [allSongs, updateAllSongs] = useState([]);
    const [chords, updateChords] = useState([]);
    const [melody, updateMelody] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const complexityModes = ['Classical', 'Pro Jazz'];
    const melodySounds = ['Bells', 'Synth'];
    const chordSounds = ['Pad', 'Piano'];
    const [parameters, updateParameters] = useState({
        tempo: 120,
        notePause: 0.5,
        complexityMode: complexityModes[0],
        melodySound: melodySounds[0],
        chordSound: chordSounds[0],
        color: {
            hsl: {
                h: 0,
                s: 1,
                l: 0.5,
                a: 1,
            },
            hex: '#FF0000',
        },
    });

    // Get songs from DB
    useEffect(() => {
        getAllSongs();
        getSong('default');
        //computeMelody();
    }, []); // execute only at start

    // Visual and menu functions

    // Toogle Menu when pressed
    const toggleMenu = (i) => {
        let newMenuState = [false, false, false, false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    //* DB management functions

    const debugDb = true;

    // reference to the DB on firebase
    const refSongs = firebase.firestore().collection('songs');
    const refParams = firebase.firestore().collection('parameters');

    // Given the name of the song, get it from the DB or create a new one
    const getSong = (docName) => {
        if (debugDb) console.log('Aceess to db get song');

        // get the song
        refSongs
            .doc(docName)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const items = doc.data();
                    if (items) {
                        let loadSong = [];
                        for (const key in items) {
                            loadSong = [...loadSong, items[key]];
                        }
                        updateChords(loadSong);
                        updateMelody([]);
                    }
                } else {
                    // doc.data() will be undefined in this case
                    updateChords([]);
                    updateMelody([]);
                    updateServer(docName);
                    const newAllSongs = [...allSongs, docName];
                    updateAllSongs(newAllSongs);
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });

        // get the parameters
        refParams
            .doc(docName)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const items = doc.data();
                    if (items) {
                        // here save parameters in state
                        updateParameters({
                            tempo: items.tempo,
                            notePause: items.notePause,
                            complexityMode: items.complexityMode,
                            melodySound: items.melodySound,
                            chordSound: items.chordSound,
                            color: items.color,
                        });
                    }
                } else {
                    // doc.data() will be undefined in this case
                    // here initialize parameters to default
                    updateParameters({
                        tempo: 120,
                        notePause: 0.5,
                        complexityMode: complexityModes[0],
                        melodySound: melodySounds[0],
                        chordSound: chordSounds[0],
                        color: {
                            hsl: {
                                h: 0,
                                s: 1,
                                l: 0.5,
                                a: 1,
                            },
                            hex: '#FF0000',
                        },
                    });
                    updateServer(docName);
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    };

    // update the currently selected song
    const updateServer = (docName = songName) => {
        if (debugDb) console.log('Aceess to db update');
        const newChordState = { ...chords };
        refSongs.doc(docName).delete();
        refSongs.doc(docName).set(newChordState);

        const newParamsState = { ...parameters };

        refParams.doc(docName).delete();
        refParams.doc(docName).set(newParamsState);
    };

    // delete the provided song from the DB
    const deleteSong = (docName) => {
        if (debugDb) console.log('Aceess to db delete');

        const newAllSongs = allSongs.filter((song) => song !== docName);
        updateAllSongs(newAllSongs);

        refSongs.doc(docName).delete();
        refParams.doc(docName).delete();
    };

    // query the DB to obtain the list of available songs
    const getAllSongs = async () => {
        if (debugDb) console.log('Aceess to db get all');
        const snapshot = await firebase.firestore().collection('songs').get();
        const updatedSongs = snapshot.docs.map((doc) => doc.id);

        updateAllSongs(updatedSongs);
    };

    // get the selected song from the Form in the title menu
    const submitSongName = (event) => {
        //console.log(event.target.elements.song.value);
        event.preventDefault();
        var text =
            event.target.elements.song.value !== ''
                ? event.target.elements.song.value
                : 'default';
        updateSongName(text);

        getSong(text);
    };

    // Sound-related functions

    // start/stop the transport
    const startStopContext = async () => {
        await Tone.start();

        if (isPlaying) {
            // Turn of our player if music is currently playing
            //console.log('...stop');
            setIsPlaying(false);
            await Tone.Transport.stop();

            return;
        }

        console.log('play...');
        setIsPlaying(true);
        await Tone.Transport.start();
    };

    // start/stop the transport
    const stopContext = async () => {
        if (isPlaying) {
            // Turn of our player if music is currently playing
            //console.log('...stop');
            setIsPlaying(false);
            await Tone.Transport.stop();

            return;
        }
        return;
    };

    // melody computation functions

    // given a list of chords, generate the melody

    const computeMelody = () => {
        // convert values
        var chordList = [];
        chords.forEach((element) => {
            const tonic = element['tonic'];
            const color = element['quality'];
            const duration = parseInt(element['duration']);
            var readChord = { tonic, color, duration };

            chordList = [...chordList, readChord];
        });
        var classic = false;
        var balance = Math.abs(1 - parameters.notePause);

        if (parameters.complexityMode === 'Classical') classic = true;

        // if there are chords, generate the melody
        if (chordList.length > 0) {
            let generator = new MelodyGen();
            let generatedMelody = generator.generate(
                chordList,
                balance,
                classic
            );
            updateMelody(generatedMelody);
        }
    };

    // app structure

    return (
        <div className="app">
            <ThemeProvider theme={themes.dark}>
                <GlobalStyles />
                <Sound
                    chords={chords}
                    melody={melody}
                    isPlaying={isPlaying}
                    parameters={parameters}
                />

                <World
                    melody={melody}
                    chords={chords}
                    color={parameters.color.hsl.h}
                    isPlaying={isPlaying}
                />

                <p
                    className="Info"
                    style={{
                        color: 'white',
                        position: 'fixed',
                        bottom: '25px',
                        right: '25px',
                        zIndex: '100',
                    }}
                >
                    Song: {songName}
                </p>

                <MainMenu
                    toggleMenu={toggleMenu}
                    melody={melody}
                    chords={chords}
                    tempo={parameters.tempo}
                    songName={songName}
                    isPlaying={isPlaying}
                    startStopContext={startStopContext}
                    stopContext={stopContext}
                    computeMelody={computeMelody}
                />
                <HelpMenu toggleMenu={toggleMenu} showMenu={showMenu[4]} />
                <IoInformationCircle
                    style={{
                        color: 'white',
                        fontSize: '2.5em',
                        position: 'fixed',
                        top: '15px',
                        right: '15px',
                        cursor: 'pointer',
                    }}
                    onClick={() => toggleMenu(4)}
                ></IoInformationCircle>
                <SongTitleMenu
                    songName={songName}
                    color={parameters.color}
                    showMenu={showMenu[0]}
                    toggleMenu={toggleMenu}
                    onSubmit={(e) => {
                        submitSongName(e);
                        //computeMelody();
                    }}
                    onDelete={deleteSong}
                    allSongs={allSongs}
                    stopContext={stopContext}
                />
                <ChordsMenu
                    showMenu={showMenu[1]}
                    toggleMenu={toggleMenu}
                    chords={chords}
                    updateChords={updateChords}
                    updateServer={updateServer}
                    stopContext={stopContext}
                />
                <StyleMenu
                    showMenu={showMenu[2]}
                    toggleMenu={toggleMenu}
                    color={parameters.color}
                    setColor={(e) => {
                        updateParameters({
                            ...parameters,
                            color: {
                                hsl: e.hsl,
                                hex: e.hex,
                            },
                        });
                    }}
                    parameters={parameters}
                    changeChordSound={(e) =>
                        updateParameters({ ...parameters, chordSound: e })
                    }
                    changeMelodySound={(e) =>
                        updateParameters({ ...parameters, melodySound: e })
                    }
                    melodySounds={melodySounds}
                    chordSounds={chordSounds}
                    updateServer={updateServer}
                    stopContext={stopContext}
                />
                <ParametersMenu
                    showMenu={showMenu[3]}
                    toggleMenu={toggleMenu}
                    parameters={parameters}
                    color={parameters.color}
                    changeTempo={(e) =>
                        updateParameters({ ...parameters, tempo: e })
                    }
                    changeNotePause={(e) =>
                        updateParameters({ ...parameters, notePause: e })
                    }
                    changeComplexity={(e) =>
                        updateParameters({ ...parameters, complexityMode: e })
                    }
                    complexityModes={complexityModes}
                    updateServer={updateServer}
                    stopContext={stopContext}
                />
            </ThemeProvider>
        </div>
    );
}

export default App;
