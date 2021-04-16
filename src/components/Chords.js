import React from 'react';
import { FaFileExcel } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const ChordsTimeline = styled.div`
    position: relative;
    height: 90%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: left;
    overflow: auto;
`;

const StyledChord = styled.div`
    width: fit-content;

    background: rgba(255, 255, 255, 0.35);

    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);

    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    margin: 5px;
    position: relative;
    height: 75px;
    min-width: ${(props) => {
        return props.size * 300;
    }}px;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    overflow: visible;
    padding: 10px;
    cursor: grab;
`;

const Chords = (props) => {
    return (
        <DragDropContext onDragEnd={props.handleOnDragEnd}>
            <Droppable droppableId="chords" direction="horizontal">
                {(provided) => (
                    <ChordsTimeline
                        className="chords"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {props.chords.map((chord, index) => (
                            <Draggable
                                key={chord.id}
                                draggableId={chord.id}
                                index={index}
                            >
                                {(provided) => (
                                    <StyledChord
                                        size={chord.duration}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <h3>
                                            {chord.tonic}
                                            {chord.color}
                                        </h3>
                                    </StyledChord>
                                )}
                            </Draggable>
                        ))}
                    </ChordsTimeline>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Chords;
