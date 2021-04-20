import React from 'react';
import styled from 'styled-components';

const StyledDropMenu = styled.div`
    position: absolute;
    top: 50px;

    width: 100px;
    height: 100px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25%;

    background: rgba(255, 255, 255, 0.4);

    margin: 5px;
    cursor: pointer;
`;

const StyledElement = styled.button`
    width: 10px;
    height: 10px;
`;

const DropMenu = (props) => {
    return (
        <StyledDropMenu>
            {props.elements.map((element, index) => (
                <StyledElement
                    key={index}
                    onClick={(e) => {
                        props.setElements(element);
                    }}
                >
                    {element}
                </StyledElement>
            ))}
        </StyledDropMenu>
    );
};

export default DropMenu;
