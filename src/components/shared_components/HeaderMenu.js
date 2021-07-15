import React from 'react';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';

const StyledHeaderMenu = styled.div`
    position: relative;
    top: -3px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const HeaderMenu = (props) => {
    return (
        <StyledHeaderMenu>
            <h2>{props.titleMenu}</h2>
            <IoCloseCircle
                className="CloseBtn"
                onClick={() => {
                    props.toggleMenu();
                }}
            />
        </StyledHeaderMenu>
    );
};

export default HeaderMenu;
