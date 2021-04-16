import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { FaItunesNote, FaFillDrip, FaRegPlayCircle } from 'react-icons/fa';

const StyledMainMenu = styled.div`
    display: flex;

    align-items: center;
    width: fit-content;

    background: rgba(255, 255, 255, 0.35);
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    backdrop-filter: blur(8.5px);

    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    margin: 1%;
    padding: 0.2%;
`;

const MainMenu = (props) => {
    return (
        <StyledMainMenu className={props.className}>
            <Button btnAction={props.btnAction}>
                <FaItunesNote className="Icon" />
            </Button>
            <Button>
                <FaFillDrip className="Icon" />
            </Button>
            <Button>
                <FaRegPlayCircle className="Icon" />
            </Button>
        </StyledMainMenu>
    );
};

export default MainMenu;
