import React from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import RadioButton from '../shared_components/RadioButton';
import Slider from '../shared_components/Slider';
import Paragraph from '../shared_components/Paragraph';

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
                <Paragraph text="⏲ Select the BPM of the generated melody" />
                <Container>
                    <Slider
                        color={props.color}
                        title={'BPM'}
                        min={40}
                        max={200}
                        value={props.parameters.tempo}
                        onSlide={(value) => {
                            props.changeTempo(value);
                        }}
                    ></Slider>
                </Container>
                <Paragraph text="🎼 Select the balance between notes and pauses" />
                <Container>
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
                <Paragraph text="🎼 Select the level of complexity" />
                <Container>
                    <RadioButton
                        color={props.color}
                        mode={props.parameters.complexityMode}
                        buttons={props.complexityModes}
                        buttonPressed={(button) => {
                            props.changeComplexity(button);
                        }}
                    ></RadioButton>
                </Container>
                <Paragraph text="🎼 Compute a new melody (old one will be overwritted)" />
                <Container>
                    <Select
                        onClick={props.computeMelody}
                        style={{ background: props.color.hex }}
                    > Compute New Melody
                    </Select>
                </Container>
            </ModalMenu>
        </div>
    ) : null;
};

export default ParametersMenu;
