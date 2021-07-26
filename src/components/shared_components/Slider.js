import React from 'react';
import styled from 'styled-components';

const StyledSliderSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: fit-content;
    width: fit-content;
    background: ${(props) => props.theme.panelColor};
    box-shadow: 0 8px 32px 0 rgba(75, 75, 75, 0.37);
    margin: 10px;

    border-radius: 15px;
    border: ${(props) => props.theme.border};
    padding: 5px;
`;

const StyledSlider = styled.input`
    -webkit-appearance: none;
    width: 300px;
    height: 20px;

    background: ${(props) => props.theme.panelColor};
    border: ${(props) => props.theme.border};
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    margin: 5px;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: rgb(100, 100, 100);
        cursor: pointer;
    }
`;

const Slider = (props) => {
    return (
        <StyledSliderSection className={props.className}>
            <p>{props.title}</p>
            <StyledSlider
                type="range"
                min={props.min}
                max={props.max}
                step={props.step}
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
        </StyledSliderSection>
    );
};

export default Slider;
