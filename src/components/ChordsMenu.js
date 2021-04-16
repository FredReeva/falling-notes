import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

import styled from 'styled-components';

import Button from './Button';
import Chords from './Chords';
import song from './song';

/* prettier-ignore*/
const BlurredPage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    
`;

const StyledChordsMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    width: 90vw;

    overflow: hidden;

    background: rgba(255, 255, 255, 0.35);
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    padding: 10px;
`;

const CloseButton = styled(Button)`
    transition: 0.5s;
    width: 18px;
    height: 18px;
    border-radius: 50%;

    &:hover {
        transition: 0.5s;
        width: 18px;
        height: 18px;
        background: rgba(255, 100, 100, 0.5);
        border-color: rgba(255, 80, 80, 0.5);
    }
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
    const [chords, updateChords] = useState(song);
    const animation = useSpring({
        config: {
            duration: 250,
        },
        opacity: props.showMenu ? 1 : 0,
        // transform: props.showMenu ? `translateY(0%)` : `translateY(100%)`,
    });

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateChords(items);
    }
    return props.showMenu ? (
        <BlurredPage>
            <animated.div style={animation}>
                <StyledChordsMenu className={props.className}>
                    <HeaderMenu>
                        <h2>Chords Lab</h2>
                        <CloseButton btnAction={props.toggleMenu} />
                    </HeaderMenu>

                    <Chords chords={chords} handleOnDragEnd={handleOnDragEnd} />

                    {/* <AddChord></AddChord> */}
                </StyledChordsMenu>
            </animated.div>
        </BlurredPage>
    ) : null;
};

export default ChordsMenu;
