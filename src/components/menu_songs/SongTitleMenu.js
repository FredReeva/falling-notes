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
    const toggleMenu = () => {
        props.toggleMenu(0);
        setValue('');
    };

    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={toggleMenu} />
            <ModalMenu className="SongTitleMenu">
                <HeaderMenu
                    titleMenu={'Song Selection'}
                    toggleMenu={toggleMenu}
                />
                <p>
                    Please, enter the name of the song you want to modify ✍🏼 or
                    create a new one 🆕
                </p>
                <Form
                    onSubmit={props.onSubmit}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    allSongs={props.allSongs}
                    onDelete={() => {
                        props.onDelete(value);
                        setValue('');
                    }}
                />

                <p>List of available songs 🎶</p>
                <StyledSongSection>
                    {props.allSongs
                        .filter((song) => song !== 'default')
                        .map((song, index) => (
                            <StyledSongName
                                key={index}
                                onClick={(e) => {
                                    setValue(e.target.innerText);
                                }}
                                style={{
                                    background:
                                        props.songName === song
                                            ? props.color.hex
                                            : null,
                                    borderColor:
                                        value === song ? props.color.hex : null,
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
