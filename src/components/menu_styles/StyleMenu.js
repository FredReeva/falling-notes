import React from 'react';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';

const StyleMenu = (props) => {
    return props.showMenu ? (
        <BlurredPage>
            <ModalMenu className="StyleMenu">
                <HeaderMenu
                    titleMenu={'Style Lab'}
                    toggleMenu={() => props.toggleMenu(1)}
                />
            </ModalMenu>
        </BlurredPage>
    ) : null;
};

export default StyleMenu;
