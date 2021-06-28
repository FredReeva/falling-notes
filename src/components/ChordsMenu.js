import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';
import Chords from './Chords';
import AddChordSection from './AddChordSection';
import firebase from './firebase';
import { MelodyGen } from '../libraries/melodygen/main.js';

const BlurredPage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);
`;

const StyledChordsMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    width: 90vw;
    overflow: visible;

    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    border-radius: 15px;
    border: ${(props) => props.theme.border};
    padding: 10px;
`;

const HeaderMenu = styled.div`
    position: relative;
    top: -3px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ChordsMenu = (props) => {
    // TODO: accesso utente al proprio spazio e salvataggio canzoni
    // TODO: crea più documenti (song) e dai la possibilità di salvare preset

    const [chords, updateChords] = useState([]);
    const [loading, setLoading] = useState(false);

    const ref = firebase.firestore().collection('songs');
    const documentSong = '3';

    function getSong(docName = documentSong) {
        setLoading(true);

        ref.doc(docName)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const items = doc.data();
                    if (items) {
                        for (const key in items) {
                            updateChords((chords) => [...chords, items[key]]);
                        }
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

        setLoading(false);
    }

    useEffect(() => {
        getSong();
    }, []); // execute only at start

    if (loading) {
        return <h1>Loading...</h1>;
    }

    const deleteChord = (id) => {
        // console.log('delete', id);
        updateChords(chords.filter((chord) => chord.id !== id));
    };

    const addChord = (chord) => {
        // generate id based on time (guaranteed to be unique for our application)
        const id = Date.now().toString();
        const newChord = { id, ...chord };

        updateChords([...chords, newChord]);
    };

    const updateServer = (docName = documentSong) => {
        const newState = { ...chords };
        ref.doc(docName).delete();
        ref.doc(docName).set(newState);

        computeMelody(); // ogni volta che il server viene aggiornato calcolo la melodia
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        updateChords(items);
    }


    // dati gli accordi, li converte in modo che siano comprensibili al codice di antonio e calcola melodia
    const computeMelody = () => {
        // adapter dell'interfaccia
        var chordList = [];
        chords.forEach((element) => {
            const tonic = element['tonic'];
            const color = element['quality'];
            const duration = parseInt(element['duration']);
            var readChord = { tonic, color, duration };

            chordList = [...chordList, readChord];
        });
        // console.log(chordList);

        // genero melodia se ci sono accordi:
        if (chordList.length > 0) {
            //Istanzio l'oggetto generatore
            let generator = new MelodyGen();
            //Genero la linea melodica dando in input gli accordi dell'utente
            let melody = generator.generate(chordList);
            console.log('New melody: ', melody);
        }
    };

    return props.showMenu ? (
        <BlurredPage>
            <StyledChordsMenu className={props.className}>
                <HeaderMenu>
                    <h2>Chords Lab</h2>
                    <IoCloseCircle
                        className="CloseBtn"
                        onClick={() => {
                            updateServer();
                            props.toggleMenu();
                        }}
                    />
                </HeaderMenu>

                <Chords
                    chords={chords}
                    handleOnDragEnd={handleOnDragEnd}
                    onDelete={deleteChord}
                />
                <AddChordSection onAdd={addChord} />
            </StyledChordsMenu>
        </BlurredPage>
    ) : null;
};

export default ChordsMenu;
