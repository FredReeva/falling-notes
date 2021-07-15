import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/GlobalStyles';
import MainMenu from './components/MainMenu';
import ChordsMenu from './components/menu_chords/ChordsMenu';
import World from './components/Background';
import themes from './Themes';
import { MelodyGen } from './libraries/melodygen/main.js';
import firebase from './components/firebase';
import StyleMenu from './components/menu_styles/StyleMenu';
import { createMidi } from './components/MidiCreator';

// const Background = styled.div`
//     height: 100vh;
//     width: 100vw;
//     overflow: hidden;
//     background-color: ${(props) => props.theme.background};
// `;

function App() {
    const [chords, updateChords] = useState([]);
    const [melody, updateMelody] = useState([]);

    const ref = firebase.firestore().collection('songs');
    const documentSong = '3';

    function getSong(docName = documentSong) {
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
                    updateServer(docName);
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    }

    const updateServer = (docName = documentSong) => {
        const newState = { ...chords };
        ref.doc(docName).delete();
        ref.doc(docName).set(newState);

        //computeMelody(); // ogni volta che il server viene aggiornato calcolo la melodia
    };

    useEffect(() => {
        getSong();
        //computeMelody();
    }, []); // execute only at start

    // dati gli accordi, li converte in modo che siano comprensibili al codice di antonio e calcola melodia
    const computeMelody = () => {
        // adapter dell'interfaccia

        console.log(chords);
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
            //console.log('New melody: ', generatedMelody);
        }
    };

    // const [showMenu, setMenu] = useState([false, false]);

    // const toggleMenu = (index) => {
    //     setMenu((prev) => !prev);
    //     console.log('ho cliccato menu accordi');
    // };

    const [showMenu, setShowMenu] = useState([false, false]);
    const toggleMenu = (i) => {
        let newMenuState = [false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    return (
        <div className="app">
            <ThemeProvider theme={themes.orange}>
                <GlobalStyles />
                <World melody={melody} />
                {/* <IoHelpCircle
                    className="Icon"
                    style={{
                        color: 'white',
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                    }}
                /> */}
                <MainMenu
                    toggleMenu={toggleMenu}
                    computeMelody={computeMelody}
                />
                <ChordsMenu
                    showMenu={showMenu[0]}
                    toggleMenu={toggleMenu}
                    chords={chords}
                    updateChords={updateChords}
                    updateServer={updateServer}
                />
                <StyleMenu showMenu={showMenu[1]} toggleMenu={toggleMenu} />
            </ThemeProvider>
        </div>
    );
}

export default App;
