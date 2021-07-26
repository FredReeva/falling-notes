import React, { useState } from 'react';
import BlurredPage from '../shared_components/BlurredPage';
import Form from '../shared_components/Form';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';
import styled from 'styled-components';
import Paragraph from '../shared_components/Paragraph';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
`;

const StyledSongSection = styled.div`
    display: flex;
    width: fit-content;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    margin-top: 10px;
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
                <Paragraph text="✍🏼 Enter the name of the song you want to modify or create a
                    new one" />
                <Container>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'center',
                            alignItems: 'center',
                        }}
                    >
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
                    </div>
                </Container>
                <Paragraph text="🧾 List of available songs" />
                <Container>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'center',
                            alignItems: 'center',
                        }}
                    >
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
                    </div>
                </Container>
            </ModalMenu>
        </div>
    ) : null;
};

export default SongTitleMenu;
