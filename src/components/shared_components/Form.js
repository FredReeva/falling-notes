import React, { useState } from 'react';
import styled from 'styled-components';
import { IoPlay } from 'react-icons/io5';

const StyledForm = styled.div`
    display: flex;
    align-items: left;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
`;

const SubmitButton = styled.button`
    display: flex;
    align-self: flex-end;
    transition: 0.2s;
    height: 30px;
    width: fit-content;
    border: ${(props) => props.theme.border};
    border-radius: 15px;
    font-size: 1em;
    background: ${(props) => props.theme.buttonColor};
    padding: 4px;

    margin-left: 10px;

    cursor: pointer;

    transition: 0.5s;
    &:hover {
        background: rgba(100, 255, 100, 0.9);
    }
`;

const Form = (props) => {
    return (
        <StyledForm>
            <p>
                Please, enter the name of the song you want to modify ✍🏼 or
                create a new one 🆕
            </p>
            <form onSubmit={props.onSubmit}>
                <input name="song" type="text" placeholder="nice title..." />
                <SubmitButton type="submit">Enter</SubmitButton>
            </form>
        </StyledForm>
    );
};

export default Form;
