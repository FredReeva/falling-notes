import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

import styled from 'styled-components';

import { IoCloseCircle } from 'react-icons/io5';

import Chords from './Chords';
// import song from './song';
import AddChordSection from './AddChordSection';

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

    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
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
    const [chords, updateChords] = useState('');

    const deleteChord = (id) => {
        // console.log('delete', id);
        updateChords(chords.filter((chord) => chord.id !== id));
    };

    const addChord = (chord) => {
        // console.log('added', chord);
        const id = Math.floor(Math.random() * 10000 + 1).toString();
        const newChord = { id, ...chord };
        updateChords([...chords, newChord]);
    };

    const animation = useSpring({
        config: {
            duration: 250,
        },
        opacity: props.showMenu ? 1 : 0,
    });

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateChords(items);
        // console.log(items);
    }
    return props.showMenu ? (
        <BlurredPage>
            <animated.div style={animation}>
                <StyledChordsMenu className={props.className}>
                    <HeaderMenu>
                        <h2>Chords Lab</h2>
                        <IoCloseCircle
                            className="CloseBtn"
                            onClick={props.toggleMenu}
                        />
                    </HeaderMenu>

                    <Chords
                        chords={chords}
                        handleOnDragEnd={handleOnDragEnd}
                        onDelete={deleteChord}
                    />
                    <AddChordSection onAdd={addChord} />
                </StyledChordsMenu>
            </animated.div>
        </BlurredPage>
    ) : null;
};

export default ChordsMenu;
