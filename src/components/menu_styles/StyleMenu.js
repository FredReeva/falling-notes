import React from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import { CirclePicker } from 'react-color';

const StyledCirclePicker = styled(CirclePicker)`
    display: flex;
    flex-direction: row;
    margin-top: 10px;

    align-self: center;
`;

const StyleMenu = (props) => {
    return props.showMenu ? (
        <BlurredPage>
            <ModalMenu className="StyleMenu">
                <HeaderMenu
                    titleMenu={'Style Lab'}
                    toggleMenu={() => props.toggleMenu(1)}
                />
                <StyledCirclePicker
                    width={400}
                    circleSize={50}
                    circleSpacing={20}
                    colors={[
                        '#000000',
                        '#3f51b5',
                        '#9c27b0',
                        '#03a9f4',
                        '#4caf50',
                        '#ffeb3b',
                        '#ff9800',
                        '#ff5722',
                        '#FF0000',
                    ]}
                    onChangeComplete={props.changeColor}
                />
            </ModalMenu>
        </BlurredPage>
    ) : null;
};

export default StyleMenu;
