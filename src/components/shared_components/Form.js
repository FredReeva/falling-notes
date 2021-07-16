import React, { useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.div`
    display: flex;

    align-items: center;
    width: fit-content;

    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.4);

    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);

    border-radius: 15px;
    border: ${(props) => props.theme.border};

    margin: 1%;
    padding: 0.2%;
`;

const Form = (props) => {
    return (
        <StyledForm>
            <form onSubmit={props.onSubmit}>
                <p>Enter the name of the song:</p>
                <input type="text" onChange={props.onChange} />
                <input type="submit" />
                <p>Current song: {props.songName}</p>
            </form>
        </StyledForm>
    );
};

export default Form;
