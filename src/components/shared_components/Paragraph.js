import React from 'react';
import styled from 'styled-components';

const StyledTextDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Paragraph = (props) => {
    return (
        <StyledTextDiv>
            <p>{props.text}</p>
        </StyledTextDiv>
    );
};

export default Paragraph;