import React from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import { HuePicker } from 'react-color';
import RadioButton from '../shared_components/RadioButton';

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
`;

const StyledColorPicker = styled(HuePicker)`
    display: flex;

    align-self: center;
    margin: 25px;

    cursor: pointer;
`;

const StyledPointer = styled.div`
    width: 25px;
    height: 25px;
    transform: translate(-50%, -7px);
    border-radius: 50%;
    background: ${(props) => props.theme.buttonColor};
`;

const StyleMenu = (props) => {
    const toggleMenu = () => {
        props.toggleMenu(2);
        props.updateServer();
    };

    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={toggleMenu} />
            <ModalMenu className="StyleMenu">
                <HeaderMenu titleMenu={'Style Lab'} toggleMenu={toggleMenu} />
                <p>🎨 Select the accent color of the application</p>
                <Container>
                    <StyledColorPicker
                        height={10}
                        pointer={StyledPointer}
                        color={props.color}
                        onChangeComplete={(color) => {
                            props.setColor(color);
                        }}
                    ></StyledColorPicker>
                </Container>
                <p>
                    🎹 Select the sound of the chord instrument and the melodic
                    instrument
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
                            title={'Chords'}
                            color={props.color}
                            mode={props.parameters.chordSound}
                            buttons={props.chordSounds}
                            buttonPressed={(button) => {
                                props.changeChordSound(button);
                            }}
                        ></RadioButton>

                        <RadioButton
                            title={'Melody'}
                            color={props.color}
                            mode={props.parameters.melodySound}
                            buttons={props.melodySounds}
                            buttonPressed={(button) => {
                                props.changeMelodySound(button);
                            }}
                        ></RadioButton>
                    </div>
                </Container>
            </ModalMenu>
        </div>
    ) : null;
};

export default StyleMenu;
