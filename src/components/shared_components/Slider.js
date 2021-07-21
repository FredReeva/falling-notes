import React from 'react';
import styled from 'styled-components';

const StyledSlider = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: fit-content;
    width: fit-content;
    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 15px;
    border: ${(props) => props.theme.border};
    padding: 5px;
`;

const Slider = (props) => {
    return (
        <StyledSlider className={props.className}>
            <p>{props.title}</p>
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={(e) => {
                    props.onSlide(e.target.value);
                }}
            />
            <p>{props.value}</p>
            {/* <input
                type="number"
                min={props.min}
                max={props.max}
                value={props.value}
                onSubmit={(e) => {
                    if (
                        e.target.value > props.min &&
                        e.target.value < props.max
                    )
                        props.onSlide(e.target.value);
                }}
            /> */}
        </StyledSlider>
    );
};

export default Slider;
