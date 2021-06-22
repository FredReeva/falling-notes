import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { IoCloseCircle } from 'react-icons/io5';

import Chords from './Chords';
// import song from './song';
import AddChordSection from './AddChordSection';

import firebase from './firebase';

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
    // TODO: sistema gestione id!
    // TODO: accesso utente al proprio spazio e salvataggio canzoni
    // TODO: crea più documenti (song) e dai la possibilità di salvare preset

    const [chords, updateChords] = useState([]);
    const [loading, setLoading] = useState(false);

    const ref = firebase.firestore().collection('songs');
    const documentSong = '2';

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

        //console.log(items);
        //updateChords(items[0]););

        setLoading(false);
    }

    useEffect(() => {
        getSong();
    }, []); // execute only at start or also when preset changed...

    if (loading) {
        return <h1>Loading...</h1>;
    }

    const deleteChord = (id) => {
        // console.log('delete', id);
        updateChords(chords.filter((chord) => chord.id !== id));
    };

    const addChord = (chord) => {
        //console.log('added', chord);
        const id = Math.floor(Math.random() * 10000 + 1).toString();

        const newChord = { id, ...chord };

        updateChords([...chords, newChord]);
    };

    const updateServer = (docName = documentSong) => {
        const newState = { ...chords };
        ref.doc(docName).delete();
        ref.doc(docName).set(newState);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        updateChords(items);
        // ref.doc(items.id).update(result).set();
        // console.log(items);
    }
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
