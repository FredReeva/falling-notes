import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/GlobalStyles';
import MainMenu from './components/MainMenu';
import ChordsMenu from './components/ChordsMenu';
import World from './components/Background';
import { IoHelpCircle } from 'react-icons/io5';
import themes from './Themes';

// const Background = styled.div`
//     height: 100vh;
//     width: 100vw;
//     overflow: hidden;
//     background-color: ${(props) => props.theme.background};
// `;

function App() {
    const [showMenu, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu((prev) => !prev);
        console.log('ho cliccato menu accordi');
    };

    return (
        <div className="app">
            <ThemeProvider theme={themes.orange}>
                <GlobalStyles />
                <World />
                <IoHelpCircle
                    className="Icon"
                    style={{
                        color: 'white',
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                    }}
                />
                <MainMenu btnAction={toggleMenu} />
                <ChordsMenu showMenu={showMenu} toggleMenu={toggleMenu} />
            </ThemeProvider>
        </div>
    );
}

export default App;
