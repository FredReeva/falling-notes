import React from 'react';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';

const StyledHeaderMenu = styled.div`
    position: relative;
    top: -3px;
    align-items: center;
`;

const StyledCloseBtn = styled.div`
    position: relative;
    top: -60px;
    right: -20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

`;

const StyledTitleDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const HeaderMenu = (props) => {
    return (
        <StyledHeaderMenu >
            <StyledTitleDiv>
                <h1>{props.titleMenu}</h1>
            </StyledTitleDiv>
            <StyledCloseBtn>
                <IoCloseCircle
                    className="CloseBtn"
                    onClick={() => {
                        props.toggleMenu();
                    }}
                />
            </StyledCloseBtn>
        </StyledHeaderMenu>
    );
};

export default HeaderMenu;
