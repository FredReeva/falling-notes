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
import MelodyMenu from './components/menu_melody/MelodyMenu';
import { get } from 'music-chord';
import * as Tone from 'tone';

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

    //* effects
    useEffect(() => {
        getSong(songName);
        getAllSongs();
        //computeMelody();
    }, []); // execute only at start

    useEffect(() => {
        getAllSongs();
    }, [songName, allSongs]);

    //* Visual and menu functions

    const toggleMenu = (i) => {
        let newMenuState = [false, false, false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    //* DB management functions

    // reference to the DB on firebase
    const ref = firebase.firestore().collection('songs');

    // Given the name of the song, get it from the DB or create a new one
    const getSong = (docName) => {
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
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    };

    // update the currently selected song
    const updateServer = (docName = songName) => {
        const newState = { ...chords };
        ref.doc(docName).delete();
        ref.doc(docName).set(newState);
        //updateMelody([]);
        computeMelody();
    };

    // delete the provided song from the DB
    const deleteSong = (docName) => {
        //console.log('deleting' + docName);
        ref.doc(docName).delete();
    };

    // query the DB to obtain the list of available songs
    const getAllSongs = async () => {
        const snapshot = await firebase.firestore().collection('songs').get();
        const updatedSongs = snapshot.docs.map((doc) => doc.id);
        //console.log(updatedSongs);
        updateAllSongs(updatedSongs);
    };

    // get the selected song from the Form in the title menu
    const submitSongName = (event) => {
        //console.log(event.target.elements.song.value);
        var text =
            event.target.elements.song.value !== ''
                ? event.target.elements.song.value
                : 'default';
        updateSongName(text);
        event.preventDefault();
        getSong(text);
        getAllSongs();
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

    //* app structure

    return (
        <div className="app">
            <ThemeProvider theme={themes.dark}>
                <GlobalStyles />
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
                <MelodyMenu showMenu={showMenu[3]} toggleMenu={toggleMenu} />
            </ThemeProvider>
        </div>
    );
}

export default App;
