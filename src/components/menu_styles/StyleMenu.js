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
`;

const StyleMenu = (props) => {
    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={() => props.toggleMenu(1)} />
            <ModalMenu className="StyleMenu">
                <HeaderMenu
                    titleMenu={'Style Lab'}
                    toggleMenu={() => props.toggleMenu(1)}
                />
                <StyledColorPicker
                    color={props.color}
                    onChangeComplete={(color) => {
                        props.setColor(color.hsl.h);
                    }}
                ></StyledColorPicker>
            </ModalMenu>
        </div>
    ) : null;
};

export default StyleMenu;
