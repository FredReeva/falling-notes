import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import {
    createMuiTheme,
    MuiThemeProvider,
  } from "@material-ui/core/styles";

import {
    IoMusicalNotes,
    IoColorPalette,
    IoPlayCircle,
    IoStopCircle,
    IoDownloadOutline,
    IoDice,
    IoText,
} from 'react-icons/io5';
import {BsGearFill} from "react-icons/bs";
import { createMidi } from './MidiCreator.js';

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
        popper: {
            marginTop: "15px",
        },
        tooltip: {
            fontSize: "0.8em",
            fontWeight: 'bold',
            color: "black",
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderStyle: 'none'
        },
        arrow: {
            color: 'rgba(255, 255, 255, 0.85)',
            borderStyle: 'none'
        }
    }
  }
});

const StyledMainMenu = styled.div`
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

const MenuButton = styled.button`
    transition: 0.5s;
    width: 50px;
    height: 50px;
    border: ${(props) => props.theme.border};
    border-radius: 25%;

    background: ${(props) => props.theme.buttonColor};

    margin: 5px;
    cursor: pointer;

    &:hover {
        transition: 1s;
        width: 60px;
        height: 60px;
        box-shadow: 0 8px 32px -5px rgba(75, 75, 75, 0.4);
    }
`;

const MainMenu = (props) => {

    return (
        <MuiThemeProvider theme={defaultTheme}>
            <StyledMainMenu className={props.className}>
                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Song Selection"
                        arrow
                    >
                        <MenuButton
                            onClick={() => {
                                props.toggleMenu(0);
                                props.stopContext();
                            }}
                        >
                            <IoText className="Icon" />
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>

                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Chords Lab"
                        arrow
                    >
                        <MenuButton
                            onClick={() => {
                                props.toggleMenu(1);
                                props.stopContext();
                            }}
                        >
                            <IoMusicalNotes className="Icon" />
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>

                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Compute random melody"
                        arrow
                    >
                        <MenuButton
                            onClick={() => {
                                props.stopContext();
                                props.computeMelody();
                            }}
                            style={{
                                background:
                                    props.chords.length === 0 ? 'rgb(130,130,130)' : null,
                                pointerEvents: props.chords.length === 0 ? 'none' : null,
                            }}
                        >
                            <IoDice className="Icon" />
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>

                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Style Lab"
                        arrow
                    >
                        <MenuButton
                            onClick={() => {
                                props.toggleMenu(2);
                            }}
                        >
                            <IoColorPalette className="Icon" />
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>

                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Parameters Lab"
                        arrow
                    >
                        <MenuButton
                            onClick={() => {
                                props.toggleMenu(3);
                                props.stopContext();
                            }}
                            style={{
                                background:
                                    props.chords.length === 0 ? 'rgb(130,130,130)' : null,
                                pointerEvents: props.chords.length === 0 ? 'none' : null,
                            }}
                        >
                            <BsGearFill className="Icon" />
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>

                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Download MIDI"
                        arrow
                    >
                        <MenuButton
                            onClick={() => {
                                createMidi(
                                    props.melody,
                                    props.chords,
                                    props.tempo,
                                    props.songName
                                );
                            }}
                            style={{
                                background:
                                    props.melody.length === 0 || props.chords.length === 0
                                        ? 'rgb(130,130,130)'
                                        : null,
                                pointerEvents:
                                    props.melody.length === 0 || props.chords.length === 0
                                        ? 'none'
                                        : null,
                            }}
                        >
                            <IoDownloadOutline className="Icon" />
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>


                <MuiThemeProvider theme={theme}>
                    <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                        enterDelay={200}
                        title="Start/Stop"
                        arrow
                    >
                        <MenuButton
                            onClick={props.startStopContext}
                            style={{
                                background:
                                    props.melody.length === 0 || props.chords.length === 0
                                        ? 'rgb(130,130,130)'
                                        : null,
                                pointerEvents:
                                    props.melody.length === 0 || props.chords.length === 0
                                        ? 'none'
                                        : null,
                            }}
                        >
                            {!props.isPlaying ? (
                                <IoPlayCircle className="Icon" />
                            ) : (
                                <IoStopCircle className="Icon" />
                            )}
                        </MenuButton>
                    </Tooltip>
                </MuiThemeProvider>
            </StyledMainMenu>
        </MuiThemeProvider>
        
    );
};

export default MainMenu;
