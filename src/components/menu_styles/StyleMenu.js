import React from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import { HuePicker } from 'react-color';

const StyledColorPicker = styled(HuePicker)`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    align-self: center;
    cursor: pointer;
`;

const StyledPointer = styled.div`
    width: 40px;
    height: 40px;
    transform: translate(-50%, -5px);
    border-radius: 50%;
    background: ${(props) => props.theme.buttonColor};
`;

const StyleMenu = (props) => {
    const toggleMenu = () => {
        props.toggleMenu(2);
    };
    //console.log(props.color);
    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={toggleMenu} />
            <ModalMenu className="StyleMenu">
                <HeaderMenu titleMenu={'Style Lab'} toggleMenu={toggleMenu} />
                <StyledColorPicker
                    height={30}
                    pointer={StyledPointer}
                    color={props.color}
                    onChangeComplete={(color) => {
                        props.setColor(color);
                    }}
                ></StyledColorPicker>
            </ModalMenu>
        </div>
    ) : null;
};

export default StyleMenu;
