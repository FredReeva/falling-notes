import React, { useState } from 'react';

import styled from 'styled-components';

import { IoAddCircle } from 'react-icons/io5';

import DropMenu from './DropMenu';

const StyledAddChord = styled.div`
    position: relative;
    display: flex;
    min-width: 400px;
    /* width: 75%; */
    align-self: center;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 15px;
    border: ${(props) => props.theme.border};
    height: 75px;
    background: ${(props) => props.theme.panelColor};
`;

const AddButton = styled(IoAddCircle)`
    display: flex;
    transition: 0.2s;
    font-size: 400%;
    opacity: 0.5;

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 0.5s;
        opacity: 1;
    }
`;

const Select = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    min-width: 70px;
    width: 20%;
    height: 55px;
    border: ${(props) => props.theme.border};
    border-radius: 15px;
    font-size: 1em;
    background: ${(props) => props.theme.buttonColor};

    margin-left: 10px;
    cursor: pointer;
    overflow: hidden;
    transition: 0.5s;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
    }
`;

function AddChord(props) {
    const [tonic, setTonic] = useState('');
    const [quality, setQuality] = useState('');
    const [duration, setDuration] = useState('');

    const onSubmit = (e) => {
        if (!tonic || !quality || !duration) {
            return;
        }
        props.onAdd({ tonic, quality, duration });
        setTonic('');
        setQuality('');
        setDuration('');
        setShowMenu([false, false, false]);
    };

    const tonics = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
    ];
    const qualities = ['Major', 'minor', 'Maj7', 'minor7', '7', 'm7b5'];
    const durations = ['1', '2', '3', '4'];

    const [showMenu, setShowMenu] = useState([false, false, false]);
    const toggleMenu = (i) => {
        let newMenuState = [false, false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    return (
        <StyledAddChord>
            <Select
                onClick={() => toggleMenu(0)}
                style={{
                    background: showMenu[0] ? 'rgba(255, 255, 255, 0.9)' : null,
                }}
            >
                {tonic ? tonic : 'Tonic'}
                {showMenu[0] ? (
                    <DropMenu
                        keyboard="circle"
                        elements={tonics}
                        setElements={(e) => {
                            setTonic(e);
                            toggleMenu();
                        }}
                    />
                ) : null}
            </Select>

            <Select
                onClick={(e) => {
                    toggleMenu(1);
                }}
                style={{
                    background: showMenu[1] ? 'rgba(255, 255, 255, 0.9)' : null,
                }}
            >
                {quality ? quality : 'Quality'}
                {showMenu[1] ? (
                    <DropMenu
                        elements={qualities}
                        setElements={(e) => {
                            setQuality(e);
                            toggleMenu();
                        }}
                    />
                ) : null}
            </Select>

            <Select
                onClick={() => toggleMenu(3)}
                style={{
                    background: showMenu[3] ? 'rgba(255, 255, 255, 0.9)' : null,
                }}
            >
                {duration ? duration : 'Duration'}
                {showMenu[3] ? (
                    <DropMenu
                        elements={durations}
                        setElements={(e) => {
                            setDuration(e);
                            toggleMenu();
                        }}
                    />
                ) : null}
            </Select>

            <AddButton
                onClick={onSubmit}
                style={{
                    color:
                        !tonic || !quality || !duration
                            ? 'rgb(210, 210, 210)'
                            : 'rgb(255, 180, 0)',
                    pointerEvents:
                        !tonic || !quality || !duration ? 'none' : null,
                }}
            />
        </StyledAddChord>
    );
}

export default AddChord;
