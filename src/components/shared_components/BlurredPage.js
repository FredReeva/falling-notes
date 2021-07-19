import React from 'react';
import styled from 'styled-components';

const StyledBlurredPage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);
`;

const BlurredPage = (props) => {
    return (
        <StyledBlurredPage onClick={props.onClick}>
            {props.children}
        </StyledBlurredPage>
    );
};

export default BlurredPage;
