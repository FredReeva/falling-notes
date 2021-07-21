import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import RadioButton from '../shared_components/RadioButton';
import Slider from '../shared_components/Slider';

const ParametersMenu = (props) => {
    const toggleMenu = () => {
        props.toggleMenu(3);
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

                <RadioButton
                    mode={props.parameters.complexityMode}
                    buttons={props.complexityModes}
                    buttonPressed={(button) => {
                        props.changeComplexity(button);
                    }}
                ></RadioButton>

                <RadioButton
                    mode={props.parameters.chordSound}
                    buttons={props.chordSounds}
                    buttonPressed={(button) => {
                        props.changeChordSound(button);
                    }}
                ></RadioButton>

                <RadioButton
                    mode={props.parameters.melodySound}
                    buttons={props.melodySounds}
                    buttonPressed={(button) => {
                        props.changeMelodySound(button);
                    }}
                ></RadioButton>

                <Slider
                    title={'BPM'}
                    min={60}
                    max={200}
                    value={props.parameters.tempo}
                    onSlide={(value) => {
                        props.changeTempo(value);
                    }}
                ></Slider>

                <p>Other parameters there</p>
            </ModalMenu>
        </div>
    ) : null;
};

export default ParametersMenu;
