import React from 'react';
import styled from 'styled-components';

import { IoMusicalNotes, IoColorPalette, IoPlayCircle } from 'react-icons/io5';
const StyledMainMenu = styled.div`
    display: flex;

    align-items: center;
    width: fit-content;

    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.4);

    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);

    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    margin: 1%;
    padding: 0.2%;
`;

const MenuButton = styled.button`
    transition: 0.5s;
    width: 50px;
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25%;

    background: rgba(255, 255, 255, 0.4);

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 1s;
        width: 60px;
        height: 60px;
        box-shadow: 0 8px 32px -5px rgba(75, 75, 75, 0.4);
    }
`;

const MainMenu = (props) => {
    return (
        <StyledMainMenu className={props.className}>
            <MenuButton onClick={props.btnAction}>
                <IoMusicalNotes className="Icon" />
            </MenuButton>

            <MenuButton>
                <IoColorPalette className="Icon" />
            </MenuButton>

            <MenuButton>
                <IoPlayCircle className="Icon" />
            </MenuButton>
        </StyledMainMenu>
    );
};

export default MainMenu;
