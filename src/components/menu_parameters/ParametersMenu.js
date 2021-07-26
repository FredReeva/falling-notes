import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import RadioButton from '../shared_components/RadioButton';
import Slider from '../shared_components/Slider';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
`;

const Select = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;

    height: 80px;
    border: ${(props) => props.theme.border};
    border-radius: 15px;
    font-size: 1.2em;
    background: ${(props) => props.theme.buttonColor};
    padding: 5px;
    margin: 10px;
    cursor: pointer;
    overflow: hidden;
    transition: 0.5s;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
    }
`;

const ParametersMenu = (props) => {
    const toggleMenu = () => {
        props.toggleMenu(3);
        props.updateServer();
    };

    //var Toggle = require('react-toggle');
    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={toggleMenu} />
            <ModalMenu className="MelodyMenu">
                <HeaderMenu
                    titleMenu={'Parameters Lab'}
                    toggleMenu={toggleMenu}
                />
                <p>⏲ Select the BPM of the generated melody</p>
                <Container>
                    <Slider
                        color={props.color}
                        title={'BPM'}
                        min={60}
                        max={200}
                        value={props.parameters.tempo}
                        onSlide={(value) => {
                            props.changeTempo(value);
                        }}
                    ></Slider>
                </Container>
                <p>
                    🎼 Select the level of complexity | notes vs pauses balance
                    of the generated melody
                </p>
                <Container>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <RadioButton
                            color={props.color}
                            mode={props.parameters.complexityMode}
                            buttons={props.complexityModes}
                            buttonPressed={(button) => {
                                props.changeComplexity(button);
                            }}
                        ></RadioButton>

                        <Slider
                            color={props.color}
                            title={'Pauses ↔ Notes'}
                            min={0}
                            max={1}
                            step={0.01}
                            value={props.parameters.notePause}
                            onSlide={(value) => {
                                props.changeNotePause(value);
                            }}
                        ></Slider>
                    </div>
                    <Select
                        onClick={props.computeMelody}
                        style={{ background: props.color.hex }}
                    >
                        Compute New Melody
                    </Select>
                </Container>
            </ModalMenu>
        </div>
    ) : null;
};

export default ParametersMenu;
