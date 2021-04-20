import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/GlobalStyles';
import MainMenu from './components/MainMenu';
import ChordsMenu from './components/ChordsMenu';
import { IoHelpCircle } from 'react-icons/io5';

const theme1 = {
    primary: 'rgb(74, 198, 255)',
};

const theme2 = {
    primary: 'rgb(255, 183, 74)',
};

const Background = styled.div`
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: ${(props) => props.theme.primary};
`;

function App() {
    const [showMenu, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu((prev) => !prev);
    };

    return (
        <ThemeProvider theme={theme1}>
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
