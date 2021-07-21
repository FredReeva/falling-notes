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
import Form from './components/shared_components/Form';
import SongTitleMenu from './components/menu_songs/SongTitleMenu';
import ParametersMenu from './components/menu_parameters/ParametersMenu';

import * as Tone from 'tone';
import Sound from './components/Sound';

// const Background = styled.div`
//     height: 100vh;
//     width: 100vw;
//     overflow: hidden;
//     background-color: ${(props) => props.theme.background};
// `;

function App() {
    //* state of the app, passed to the components
    const [showMenu, setShowMenu] = useState([true, false, false, false]);
    const [songName, updateSongName] = useState('default');
    const [allSongs, updateAllSongs] = useState([]);
    const [chords, updateChords] = useState([]);
    const [melody, updateMelody] = useState([]);
    const [color, setColor] = useState({
        hsl: {
            h: 0,
            s: 1,
            l: 0.5,
            a: 1,
        },
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const complexityModes = ['Noob', 'Classical', 'Pro Jazz'];
    const melodySounds = ['Bells', 'Synth', 'Piano'];
    const chordSounds = ['Pad', 'Piano'];
    const [parameters, updateParameters] = useState({
        tempo: 120,
        complexityMode: complexityModes[0],
        melodySound: melodySounds[0],
        chordSound: chordSounds[0],
    });

    //* Visual and menu functions

    const toggleMenu = (i) => {
        let newMenuState = [false, false, false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    //* DB management functions

    const debugDb = true;

    // reference to the DB on firebase
    const ref = firebase.firestore().collection('songs');

    // Given the name of the song, get it from the DB or create a new one
    const getSong = (docName) => {
        if (debugDb) console.log('Aceess to db get song');
        ref.doc(docName)
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
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document! Creating an empty one...');
                    updateChords([]);
                    updateServer(docName);
                    const newAllSongs = [...allSongs, docName];
                    updateAllSongs(newAllSongs);
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    };

    // update the currently selected song
    const updateServer = (docName = songName) => {
        if (debugDb) console.log('Aceess to db update');
        const newState = { ...chords };
        ref.doc(docName).delete();
        ref.doc(docName).set(newState);
        //updateMelody([]);
        computeMelody();
    };

    // delete the provided song from the DB
    const deleteSong = (docName) => {
        if (debugDb) console.log('Aceess to db delete');

        const newAllSongs = allSongs.filter((song) => song !== docName);
        console.log(newAllSongs);
        updateAllSongs(newAllSongs);

        ref.doc(docName).delete();
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

    //* Sound-related functions

    // start/stop the transport
    const startStopContext = async () => {
        await Tone.start();

        if (isPlaying) {
            // Turn of our player if music is currently playing
            console.log('...stop');
            setIsPlaying(false);
            await Tone.Transport.stop();

            return;
        }

        console.log('play...');
        setIsPlaying(true);
        await Tone.Transport.start();
    };

    // * melody computation functions

    // given a list of chords, generate the melody
    //! add parameters
    const computeMelody = () => {
        // adapter dell'interfaccia

        //console.log(chords);
        var chordList = [];
        chords.forEach((element) => {
            const tonic = element['tonic'];
            const color = element['quality'];
            const duration = parseInt(element['duration']);
            var readChord = { tonic, color, duration };

            chordList = [...chordList, readChord];
        });
        //console.log(chordList);

        // genero melodia se ci sono accordi:
        if (chordList.length > 0) {
            //Istanzio l'oggetto generatore
            let generator = new MelodyGen();
            //Genero la linea melodica dando in input gli accordi dell'utente
            let generatedMelody = generator.generate(chordList);
            updateMelody(generatedMelody);
            console.log('New melody: ', generatedMelody);
        }
    };

    //* effects
    useEffect(() => {
        console.log('effect 1');
        getAllSongs();
        getSong(songName);

        //computeMelody();
    }, []); // execute only at start

    //* app structure

    return (
        <div className="app">
            <ThemeProvider theme={themes.dark}>
                <GlobalStyles />
                <Sound chords={chords} melody={melody} />
                <World
                    melody={melody}
                    chords={chords}
                    color={color.hsl.h}
                    isPlaying={isPlaying}
                />

                <p
                    className="Info"
                    style={{
                        color: 'white',
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: '100',
                    }}
                >
                    Song: {songName}
                </p>

                <MainMenu
                    toggleMenu={toggleMenu}
                    computeMelody={computeMelody}
                    melody={melody}
                    chords={chords}
                    isPlaying={isPlaying}
                    startStopContext={startStopContext}
                />
                <SongTitleMenu
                    showMenu={showMenu[0]}
                    toggleMenu={toggleMenu}
                    onSubmit={submitSongName}
                    onDelete={deleteSong}
                    allSongs={allSongs}
                />
                <ChordsMenu
                    showMenu={showMenu[1]}
                    toggleMenu={toggleMenu}
                    chords={chords}
                    updateChords={updateChords}
                    updateServer={updateServer}
                />
                <StyleMenu
                    showMenu={showMenu[2]}
                    toggleMenu={toggleMenu}
                    color={color}
                    setColor={setColor}
                />
                <ParametersMenu
                    showMenu={showMenu[3]}
                    toggleMenu={toggleMenu}
                    parameters={parameters}
                    changeTempo={(e) =>
                        updateParameters({ ...parameters, tempo: e })
                    }
                    changeComplexity={(e) =>
                        updateParameters({ ...parameters, complexityMode: e })
                    }
                    changeChordSound={(e) =>
                        updateParameters({ ...parameters, chordSound: e })
                    }
                    changeMelodySound={(e) =>
                        updateParameters({ ...parameters, melodySound: e })
                    }
                    complexityModes={complexityModes}
                    melodySounds={melodySounds}
                    chordSounds={chordSounds}
                />
            </ThemeProvider>
        </div>
    );
}

export default App;
