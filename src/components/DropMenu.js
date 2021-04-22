import React from 'react';
import styled, { css } from 'styled-components';

const StyledDropMenu = styled.div`
    display: flex;
    flex-direction: row;
    /* flex-wrap: wrap; */

    justify-content: space-evenly;

    position: absolute;
    top: 100px;

    border: ${(props) => props.theme.border};
    border-radius: 15px;

    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);

    margin: 5px;
    padding: 5px;
    cursor: initial;
    ${(props) =>
        props.keyboard === 'circle' &&
        css`
            width: 165px;
            height: 165px;
        `}
`;

const StyledElement = styled.button`
    transition: 0.2s;
    height: 25px;
    min-width: 25px;
    padding: 2px;

    border: ${(props) => props.theme.border};
    border-radius: 25px;

    background: ${(props) => props.theme.buttonColor};

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 0.5s;
        background: rgba(255, 255, 255, 0.8);
    }

    ${(props) =>
        props.keyboard === 'circle' &&
        css`
            position: absolute;
            ${(props) =>
                props.element === 'C' &&
                css`
                    transform: translate(0, 0);
                `}
            ${(props) =>
                props.element === 'G' &&
                css`
                    transform: translate(30px, 8px);
                `}
            ${(props) =>
                props.element === 'D' &&
                css`
                    transform: translate(52px, 30px);
                `}
            ${(props) =>
                props.element === 'A' &&
                css`
                    transform: translate(60px, 60px);
                `}
            ${(props) =>
                props.element === 'E' &&
                css`
                    transform: translate(52px, 90px);
                `}
            ${(props) =>
                props.element === 'B' &&
                css`
                    transform: translate(30px, 112px);
                `}
                
            ${(props) =>
                props.element === 'F#' &&
                css`
                    transform: translate(0, 120px);
                `}
            ${(props) =>
                props.element === 'C#' &&
                css`
                    transform: translate(-30px, 112px);
                `}
            ${(props) =>
                props.element === 'G#' &&
                css`
                    transform: translate(-52px, 90px);
                `}
            ${(props) =>
                props.element === 'D#' &&
                css`
                    transform: translate(-60px, 60px);
                `}
            ${(props) =>
                props.element === 'A#' &&
                css`
                    transform: translate(-52px, 30px);
                `}
            ${(props) =>
                props.element === 'F' &&
                css`
                    transform: translate(-30px, 8px);
                `}
        `}
`;

const DropMenu = (props) => {
    return (
        <StyledDropMenu
            onClick={(e) => e.stopPropagation()}
            keyboard={props.keyboard}
        >
            {props.elements.map((element, index) => (
                <StyledElement
                    keyboard={props.keyboard}
                    element={element}
                    key={index}
                    onClick={(e) => {
                        props.setElements(element);
                    }}
                >
                    {element}
                </StyledElement>
            ))}
        </StyledDropMenu>
    );
};

export default DropMenu;
