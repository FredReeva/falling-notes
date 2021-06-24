import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import { IoMusicalNotes, IoColorPalette, IoPlayCircle } from 'react-icons/io5';
import generateSounds from './Sound.js';
import {MelodyGen} from "../libraries/melodygen/main.js"

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
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        generateSounds();
    }, [isPlaying]);

    const startContext = async () => {
        //Tone.setContext(new Tone.Context({ latencyHint: 1000 }));
        console.log('ho cliccato play');



        
        //*******************

        //ACCORDI ESEMPIO (Inserire accordi specificati dall'utente)
        let chords = [
            {
                tonic: "C",
                color: "Major",
                duration: 2
            },
        
            {
                tonic: "G",
                color: "Major",
                duration: 3
            },
        
            {
                tonic: "D",
                color: "Major",
                duration: 2
            },
        ]
        
        //Istanzio l'oggetto generatore 
        let generator = new MelodyGen()

        //Genero la linea melodica dando in input gli accordi dell'utente
        let melody = generator.generate(chords)

        console.log(melody)
        
        //*******************




        await Tone.start();

        if (isPlaying) {
            // Turn of our player if music is currently playing
            setIsPlaying(false);

            await Tone.Transport.stop();
            console.log('stop');

            return;
        }

        setIsPlaying(true);

        await Tone.Transport.start();
    };

    // return pulsanti
    return (
        <StyledMainMenu className={props.className}>
            <MenuButton onClick={props.btnAction}>
                <IoMusicalNotes className="Icon" />
            </MenuButton>

            <MenuButton>
                <IoColorPalette className="Icon" />
            </MenuButton>

            <MenuButton onClick={() => startContext()}>
                <IoPlayCircle className="Icon" />
            </MenuButton>
        </StyledMainMenu>
    );
};

export default MainMenu;
