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

                <p>1. Create a song or select it from the existing list </p>
                <p>2. Insert the chords of the song </p>
                <p>3. Select color and sounds for the app </p>
                <p>4. Modify the parameters for melody computation </p>
                <p>5. Press play and enjoy your creation! </p>
                <p>6. If you really like it, you can download the midi </p>
                <p>&nbsp;&nbsp;</p>
                <p className="pulsate">Click anywhere to continue...</p>
            </StyledHelperSection>
        </div>
    ) : null;
};

export default HelpMenu;
