import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/GlobalStyles';
import MainMenu from './components/MainMenu';
import ChordsMenu from './components/ChordsMenu';
import { IoHelpCircle } from 'react-icons/io5';

const theme = {
    background: 'rgb(255, 183, 74)',
    panelColor: 'rgba(255, 255, 255, 0.4)',
    buttonColor: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(220, 220, 220, 0.2)',
};

const Background = styled.div`
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: ${(props) => props.theme.background};
`;

function App() {
    const [showMenu, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu((prev) => !prev);
    };

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Background>
                <IoHelpCircle
                    className="Icon"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                    }}
                />
                <MainMenu btnAction={toggleMenu} />
                <ChordsMenu showMenu={showMenu} toggleMenu={toggleMenu} />
            </Background>
        </ThemeProvider>
    );
}

export default App;
