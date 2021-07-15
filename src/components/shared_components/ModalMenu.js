import React from 'react';
import styled from 'styled-components';

const StyledModalMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    width: 90vw;
    overflow: visible;

    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    border-radius: 15px;
    border: ${(props) => props.theme.border};
    padding: 10px;
`;

const ModalMenu = (props) => {
    return (
        <StyledModalMenu className={props.className}>
            {props.children}
        </StyledModalMenu>
    );
};

export default ModalMenu;
