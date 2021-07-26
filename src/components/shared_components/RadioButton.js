import React from 'react';
import styled from 'styled-components';

const StyledRadioButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 90px;
    width: fit-content;
    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);
    margin: 20px;
    font-size: 1.1em;
    border-radius: 15px;
    border: ${(props) => props.theme.border};
    padding: 5px;
`;

const StyledButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    min-width: 100px;
    height: 55px;
    border: ${(props) => props.theme.border};
    border-radius: 15px;
    font-size: 1.1em;
    background: ${(props) => props.theme.buttonColor};

    margin: 5px;
    cursor: pointer;
    overflow: hidden;
    transition: 0.5s;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
    }
`;

const RadioButton = (props) => {
    return (
        <StyledRadioButton className={props.className}>
            {props.title}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'center',
                    alignItems: 'center',
                }}
            >
                {props.buttons.map((button, id) => (
                    <StyledButton
                        key={id}
                        onClick={() => {
                            props.buttonPressed(button);
                        }}
                        style={{
                            background:
                                props.mode === button ? props.color.hex : null,
                        }}
                    >
                        {button}
                    </StyledButton>
                ))}
            </div>
        </StyledRadioButton>
    );
};

export default RadioButton;
