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
                <p>Select the level of complexity of the generated melody:</p>
                <Container>
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
                        title={'BPM'}
                        min={60}
                        max={200}
                        value={props.parameters.tempo}
                        onSlide={(value) => {
                            props.changeTempo(value);
                        }}
                    ></Slider>

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
                </Container>
            </ModalMenu>
        </div>
    ) : null;
};

export default ParametersMenu;
