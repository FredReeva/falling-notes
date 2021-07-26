import React from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;

    width: fit-content;
    height: fit-content;

    margin-top: 10px;
    margin-bottom: 25px;
`;

const SubmitButton = styled.button`
    display: flex;
    align-self: flex-end;
    align-items: center;
    transition: 0.2s;
    height: 30px;
    width: fit-content;
    border: ${(props) => props.theme.border};
    border-radius: 15px;
    font-size: 1em;
    background: rgba(100, 255, 100, 0.9); /*${(props) =>
        props.theme.buttonColor};*/

    padding: 6px;

    margin-left: 10px;

    cursor: pointer;

    transition: 0.5s;
    &:hover {
        background: rgba(100, 255, 100, 0.9);
    }
`;

const DeleteButton = styled.button`
    display: flex;
    align-self: flex-end;
    align-items: center;
    transition: 0.2s;
    height: 30px;
    width: fit-content;
    border: ${(props) => props.theme.border};
    border-radius: 15px;
    font-size: 1em;
    background: ${(props) => props.theme.buttonColor};

    padding: 6px;

    margin-left: 10px;

    cursor: pointer;

    transition: 0.5s;
`;

const Form = (props) => {
    return (
        <StyledForm id="test" onSubmit={props.onSubmit}>
            <input
                name="song"
                type="text"
                placeholder="nice title..."
                value={props.value}
                onChange={props.onChange}
            />

            <SubmitButton type="submit">Select</SubmitButton>
            <DeleteButton
                type="submit"
                onSubmit={props.onSubmit}
                onClick={props.onDelete}
                style={{
                    color:
                        props.allSongs.indexOf(props.value) < 0
                            ? 'rgb(100, 100, 100)'
                            : 'rgb(0, 0, 0)',
                    background:
                        props.allSongs.indexOf(props.value) < 0
                            ? 'rgb(150, 150, 150)'
                            : 'rgb(255, 100, 100, 0.8)',
                    pointerEvents:
                        props.allSongs.indexOf(props.value) < 0 ? 'none' : null,
                }}
            >
                Delete
            </DeleteButton>
        </StyledForm>
    );
};

export default Form;
