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

// const Background = styled.div`
//     height: 100vh;
//     width: 100vw;
//     overflow: hidden;
//     background-color: ${(props) => props.theme.background};
// `;

function App() {
    // state shared through various components
    const [selectedColor, updateColor] = useState([]);
    const [chords, updateChords] = useState([]);
    const [melody, updateMelody] = useState([]);
    const [songName, updateSongName] = useState('default');
    const [allSongs, updateAllSongs] = useState([]);

    const changeColor = (color) => {
        updateColor(color);
    };

    const getAllSongs = async () => {
        const snapshot = await firebase.firestore().collection('songs').get();
        const updatedSongs = snapshot.docs.map((doc) => doc.id);
        //console.log(updatedSongs);
        updateAllSongs(updatedSongs);
    };

    const submitSongName = (event) => {
        //console.log(event.target.elements.song.value);
        var text =
            event.target.elements.song.value !== ''
                ? event.target.elements.song.value
                : 'default';
        updateSongName(text);
        event.preventDefault();
        getSong(text);
    };

    const ref = firebase.firestore().collection('songs');

    function getSong(docName) {
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
    }

    const updateServer = (docName = songName) => {
        const newState = { ...chords };
        ref.doc(docName).delete();
        ref.doc(docName).set(newState);

        //computeMelody(); // ogni volta che il server viene aggiornato calcolo la melodia
    };

    useEffect(() => {
        getSong(songName);
        computeMelody();
    }, []); // execute only at start

    useEffect(() => {
        getAllSongs();
    }, [songName]);

    // dati gli accordi, li converte in modo che siano comprensibili al codice di antonio e calcola melodia
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
        console.log(chordList);

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

    // const [showMenu, setMenu] = useState([false, false]);

    // const toggleMenu = (index) => {
    //     setMenu((prev) => !prev);
    //     console.log('ho cliccato menu accordi');
    // };

    const [showMenu, setShowMenu] = useState([false, false, true]);
    const toggleMenu = (i) => {
        let newMenuState = [false, false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    return (
        <div className="app">
            <ThemeProvider theme={themes.dark}>
                <GlobalStyles />
                <World melody={melody} selectedColor={selectedColor} />
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
                />
                <ChordsMenu
                    showMenu={showMenu[0]}
                    toggleMenu={toggleMenu}
                    chords={chords}
                    updateChords={updateChords}
                    updateServer={updateServer}
                />
                <StyleMenu
                    showMenu={showMenu[1]}
                    toggleMenu={toggleMenu}
                    changeColor={changeColor}
                />
                <SongTitleMenu
                    showMenu={showMenu[2]}
                    toggleMenu={toggleMenu}
                    songName={songName}
                    onSubmit={submitSongName}
                    allSongs={allSongs}
                />
            </ThemeProvider>
        </div>
    );
}

export default App;
