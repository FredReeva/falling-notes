import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
    transition: 0.5s;
    width: 50px;
    height: 50px;

    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);

    border-radius: 25%;
    border: 2px solid rgba(255, 255, 255, 0.2);

    margin: 5px;
    cursor: pointer;

    outline: none;

    &:hover {
        transition: 1s;
        width: 60px;
        height: 60px;
        box-shadow: 0 8px 32px 0 rgba(43, 43, 43, 0.596);
    }
`;

const Button = (props) => {
    return (
        <StyledButton className={props.className} onClick={props.btnAction}>
            {props.children}
        </StyledButton>
    );
};

export default Button;
