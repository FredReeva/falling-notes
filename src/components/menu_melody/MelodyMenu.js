import React from 'react';
import styled from 'styled-components';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';

const MelodyMenu = (props) => {
    const toggleMenu = () => {
        props.toggleMenu(3);
    };

    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={toggleMenu} />
            <ModalMenu className="MelodyMenu">
                <HeaderMenu titleMenu={'Melody Lab'} toggleMenu={toggleMenu} />
            </ModalMenu>
        </div>
    ) : null;
};

export default MelodyMenu;
