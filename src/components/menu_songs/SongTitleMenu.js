import React, { useState } from 'react';
import BlurredPage from '../shared_components/BlurredPage';
import Form from '../shared_components/Form';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import styled from 'styled-components';

const StyledSongSection = styled.div`
    display: flex;
    width: fit-content;
    height: 200px;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    margin-top: 5px;
`;

const StyledSongName = styled.div`
    display: flex;
    width: fit-content;
    height: fit-content;
    flex-wrap: wrap;

    background: ${(props) => props.theme.buttonColor};

    border-radius: 10px;
    border: ${(props) => props.theme.border};

    margin-right: 10px;
    margin-bottom: 5px;
    margin-top: 5px;
    cursor: pointer;
    padding: 5px;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
    }
`;

const SongTitleMenu = (props) => {
    const [value, setValue] = useState('');

    return props.showMenu ? (
        <div className="Container">
            <BlurredPage
                onClick={() => {
                    props.toggleMenu(2);
                    setValue('');
                }}
            />
            <ModalMenu className="SongTitleMenu">
                <HeaderMenu
                    titleMenu={'Song Selection'}
                    toggleMenu={() => {
                        props.toggleMenu(2);
                        setValue('');
                    }}
                />
                <Form
                    onSubmit={props.onSubmit}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <p>List of available songs 🎶</p>
                <StyledSongSection>
                    {props.allSongs.map((song, index) => (
                        <StyledSongName
                            key={index}
                            onClick={(e) => {
                                setValue(e.target.innerText);
                                //props.onDelete(e.target.innerText);
                            }}
                        >
                            {song}
                        </StyledSongName>
                    ))}
                </StyledSongSection>
            </ModalMenu>
        </div>
    ) : null;
};

export default SongTitleMenu;
