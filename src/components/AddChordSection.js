import React, { useState } from 'react';

import styled from 'styled-components';

import { IoAddCircle } from 'react-icons/io5';

import DropMenu from './DropMenu';

const StyledAddChord = styled.div`
    display: flex;
    width: 50%;
    align-self: center;
    align-items: center;
    justify-content: flex-end;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    height: 50px;
    background: rgba(255, 255, 255, 0.4);
`;

const AddButton = styled(IoAddCircle)`
    transition: 0.2s;
    font-size: 250%;
    opacity: 0.5;

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 0.5s;
        opacity: 1;
    }
`;

const Select = styled.div`
    position: relative;

    transition: 0.2s;
    width: 50px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 100px;

    background: rgba(255, 255, 255, 0.4);

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 0.5s;
        background: rgba(255, 255, 255, 0.8);
    }
`;

function AddChord(props) {
    const [tonic, setTonic] = useState('');
    const [quality, setQuality] = useState('');
    const [octave, setOctave] = useState('');
    const [duration, setDuration] = useState('');

    const onSubmit = (e) => {
        if (!tonic || !quality || !octave || !duration) {
            return;
        }
        props.onAdd({ tonic, quality, octave, duration });
        setTonic('');
        setQuality('');
        setOctave('');
        setDuration('');
        setShowMenu([false, false, false, false]);
    };

    const tonics = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const qualities = ['M', 'm', 'Maj7', 'm7', '7', 'm7b5'];
    const octaves = [-2, -1, 0, 1, 2];
    const durations = [0.25, 0.5, 0.75, 1];

    const [showMenu, setShowMenu] = useState([false, false, false, false]);
    const toggleMenu = (i) => {
        let newMenuState = [false, false, false, false];
        let changeMenu = !showMenu[i];
        newMenuState[i] = changeMenu;
        setShowMenu(newMenuState);
    };

    return (
        <StyledAddChord>
            <Select onClick={() => toggleMenu(0)}>
                {tonic ? tonic : 'Tonic'}
                {showMenu[0] ? (
                    <DropMenu elements={tonics} setElements={setTonic} />
                ) : null}
            </Select>

            <Select onClick={() => toggleMenu(1)}>
                {quality ? quality : 'Quality'}
                {showMenu[1] ? (
                    <DropMenu elements={qualities} setElements={setQuality} />
                ) : null}
            </Select>

            <Select onClick={() => toggleMenu(2)}>
                {octave ? octave : 'Octave'}
                {showMenu[2] ? (
                    <DropMenu elements={octaves} setElements={setOctave} />
                ) : null}
            </Select>

            <Select onClick={() => toggleMenu(3)}>
                {duration ? duration : 'Duration'}
                {showMenu[3] ? (
                    <DropMenu elements={durations} setElements={setDuration} />
                ) : null}
            </Select>

            <AddButton
                onClick={onSubmit}
                style={{
                    color:
                        !tonic || !quality || !octave || !duration
                            ? 'rgb(199, 199, 199)'
                            : 'rgb(102, 255, 102)',
                    pointerEvents:
                        !tonic || !quality || !octave || !duration
                            ? 'none'
                            : null,
                }}
            />
        </StyledAddChord>
    );
}

export default AddChord;
