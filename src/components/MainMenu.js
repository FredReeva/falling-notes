import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
    IoMusicalNotes,
    IoColorPalette,
    IoPlayCircle,
    IoStopCircle,
    IoDownloadOutline,
    IoDice,
    IoText,
} from 'react-icons/io5';
import generateSounds from './Sound.js';
import { createMidi } from './MidiCreator.js';

const StyledMainMenu = styled.div`
    display: flex;

    align-items: center;
    width: fit-content;

    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.4);

    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);

    border-radius: 15px;
    border: ${(props) => props.theme.border};

    margin: 1%;
    padding: 0.2%;
`;

const MenuButton = styled.button`
    transition: 0.5s;
    width: 50px;
    height: 50px;
    border: ${(props) => props.theme.border};
    border-radius: 25%;

    background: ${(props) => props.theme.buttonColor};

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 1s;
        width: 60px;
        height: 60px;
        box-shadow: 0 8px 32px -5px rgba(75, 75, 75, 0.4);
    }
`;

const MainMenu = (props) => {
    // useEffect(() => {}, [props.chords, props.melody]);

    // useEffect(() => {
    //     generateSounds();
    // }, [props.isPlaying]);

    // return pulsanti
    return (
        <StyledMainMenu className={props.className}>
            <MenuButton
                onClick={() => {
                    props.toggleMenu(0);
                    props.stopContext();
                }}
            >
                <IoText className="Icon" />
            </MenuButton>
            <MenuButton
                onClick={() => {
                    props.toggleMenu(1);
                    props.stopContext();
                }}
            >
                <IoMusicalNotes className="Icon" />
            </MenuButton>

            <MenuButton onClick={() => props.toggleMenu(2)}>
                <IoColorPalette className="Icon" />
            </MenuButton>

            <MenuButton
                onClick={() => {
                    props.toggleMenu(3);
                }}
                style={{
                    background:
                        props.melody.length === 0 || props.chords.length === 0
                            ? 'rgb(130,130,130)'
                            : null,
                    pointerEvents: props.chords.length === 0 ? 'none' : null,
                }}
            >
                <IoDice className="Icon" />
            </MenuButton>

            <MenuButton
                onClick={() => {
                    createMidi(
                        props.melody,
                        props.chords,
                        props.tempo,
                        props.songName
                    );
                }}
                style={{
                    background:
                        props.melody.length === 0 || props.chords.length === 0
                            ? 'rgb(130,130,130)'
                            : null,
                    pointerEvents:
                        props.melody.length === 0 || props.chords.length === 0
                            ? 'none'
                            : null,
                }}
            >
                <IoDownloadOutline className="Icon" />
            </MenuButton>

            <MenuButton
                onClick={props.startStopContext}
                style={{
                    background:
                        props.melody.length === 0 || props.chords.length === 0
                            ? 'rgb(130,130,130)'
                            : null,
                    pointerEvents:
                        props.melody.length === 0 || props.chords.length === 0
                            ? 'none'
                            : null,
                }}
            >
                {!props.isPlaying ? (
                    <IoPlayCircle className="Icon" />
                ) : (
                    <IoStopCircle className="Icon" />
                )}
            </MenuButton>
        </StyledMainMenu>
    );
};

export default MainMenu;
