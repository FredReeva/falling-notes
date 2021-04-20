import React, { useState } from 'react';

import styled from 'styled-components';
import { IoAddCircle } from 'react-icons/io5';

const StyledAddChord = styled.div`
    display: flex;
    width: 50%;
    align-self: center;
    align-items: center;
    justify-content: flex-end;
    border-radius: 100px;
    margin-top: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    height: 50px;
    background: rgba(255, 255, 255, 0.4);
`;

const AddButton = styled(IoAddCircle)`
    transition: 0.2s;
    font-size: 250%;
    color: rgba(50, 255, 10, 0.4);

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 0.5s;
        color: rgba(50, 240, 50, 0.8);
    }
`;

function AddChord(props) {
    const [tonic, setTonic] = useState('');
    const [color, setColor] = useState('');
    const [octave, setOctave] = useState('');
    const [duration, setDuration] = useState('');

    const onSubmit = (e) => {
        if (!tonic || !color || !octave || !duration) {
            alert('Add Everything!');
            return;
        }
        props.onAdd({ tonic, color, octave, duration });
        setTonic('');
        setColor('');
        setOctave('');
        setDuration('');
    };

    return (
        <StyledAddChord>
            <input
                type="text"
                placeholder="Tonic"
                value={tonic}
                onChange={(e) => setTonic(e.target.value)}
            />
            <input
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <input
                type="number"
                placeholder="Octave"
                value={octave}
                min="-2"
                max="2"
                step="1"
                onChange={(e) => setOctave(e.target.value)}
            />
            <input
                type="number"
                placeholder="duration"
                value={duration}
                min="0.25"
                max="1"
                step="0.25"
                onChange={(e) => setDuration(e.target.value)}
            />
            <AddButton onClick={onSubmit} />
        </StyledAddChord>
    );
}

export default AddChord;
