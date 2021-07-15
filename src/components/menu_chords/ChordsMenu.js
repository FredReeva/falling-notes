import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';
import ChordsDnDSection from './ChordsDnDSection';
import AddChordSection from './AddChordSection';
import firebase from '../firebase';
import { MelodyGen } from '../../libraries/melodygen/main.js';

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

    const deleteChord = (id) => {
        // console.log('delete', id);
        props.updateChords(props.chords.filter((chord) => chord.id !== id));
    };

    const addChord = (chord) => {
        // generate id based on time (guaranteed to be unique for our application)
        const id = Date.now().toString();
        const newChord = { id, ...chord };

        props.updateChords([...props.chords, newChord]);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(props.chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        props.updateChords(items);
    }

    return props.showMenu ? (
        <BlurredPage>
            <StyledChordsMenu className={props.className}>
                <HeaderMenu>
                    <h2>Chords Lab</h2>
                    <IoCloseCircle
                        className="CloseBtn"
                        onClick={() => {
                            props.updateServer();
                            props.toggleMenu();
                        }}
                    />
                </HeaderMenu>

                <ChordsDnDSection
                    chords={props.chords}
                    handleOnDragEnd={handleOnDragEnd}
                    onDelete={deleteChord}
                />
                <AddChordSection onAdd={addChord} />
            </StyledChordsMenu>
        </BlurredPage>
    ) : null;
};

export default ChordsMenu;
