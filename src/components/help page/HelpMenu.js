import React from 'react';
import styled from 'styled-components';

const StyledHelperSection = styled.div`
    font-size: 1.3em;
    color: white;
`;

const StyledMenuNumber = styled.div`
    display: flex;

    align-items: center;

    font-size: 1.5em;
    width: 50px;
    height: 50px;
    color: white;
`;

const HelpMenu = (props) => {
    const toggleMenu = () => {
        props.toggleMenu(4);
    };

    return props.showMenu ? (
        <div className="Container" onClick={toggleMenu}>
            <StyledHelperSection>
                <h1 style={{ marginBottom: '10px' }}>
                    Hello traveller, welcome to Falling Notes! 🌠
                </h1>
                <p>&nbsp;&nbsp;</p>
                <h4>INSTRUCTIONS:</h4>
                <p>
                    1. Open the "Song Selection" menu to create a song or to
                    select it from the existing list{' '}
                </p>
                <p>
                    2. Open the "Chord Lab" menu to write the chord progression
                    of your song
                </p>
                <p>
                    3. Click on the dice to generate a random melody. Every time
                    you press this button, the old melody will be overwritten!
                </p>
                <p>4. Press the Play button and enjoy your creation! </p>
                <p>&nbsp;&nbsp;</p>
                <h4>CUSTOMIZATION:</h4>
                <p>
                    The "Style Lab" menu allows you to choose the color accent
                    and the instruments of your song
                </p>
                <p>
                    The "Parameters Lab" menu allows you to choose the tempo of
                    the song and tune the melody generator parameters
                </p>
                <p>&nbsp;&nbsp;</p>
                <h4>REMEMBER:</h4>
                <p>
                    If you really like the melody, you can download the MIDI
                    file using the Download button!
                </p>
                <p>&nbsp;&nbsp;</p>
                <h4>EXTRA:</h4>
                <p>
                    For more infos, please take a look at the&nbsp;
                    <a
                        style={{ color: '#ffbf00' }}
                        href="https://github.com/FredReeva/falling-notes"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Github Repository
                    </a>
                    .
                </p>
                <p>&nbsp;&nbsp;</p>
                <p className="pulsate">Click anywhere to continue...</p>
            </StyledHelperSection>
        </div>
    ) : null;
};

export default HelpMenu;
