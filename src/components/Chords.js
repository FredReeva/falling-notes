import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { IoRemoveCircle } from 'react-icons/io5';

const ChordsTimeline = styled.div`
    position: relative;
    height: 100px;
    display: flex;
    flex-direction: row;
    /* flex-wrap: wrap; */
    justify-content: flex-start;
    align-items: left;
    overflow: auto;
`;

const StyledChord = styled.div`
    width: fit-content;

    background: rgba(255, 255, 255, 0.4);

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

const DeleteChord = styled(IoRemoveCircle)`
    transition: 0.2s;
    position: absolute;
    top: 5px;
    right: 5px;
    color: rgba(150, 150, 150, 0.3);
    cursor: pointer;

    &:hover {
        transition: 0.5s;
        color: rgba(100, 100, 100, 0.7);
    }
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
                        {props.chords.length > 0 ? (
                            props.chords.map((chord, index) => (
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
                                            <DeleteChord
                                                onClick={() => {
                                                    props.onDelete(chord.id);
                                                }}
                                            />
                                        </StyledChord>
                                    )}
                                </Draggable>
                            ))
                        ) : (
                            <p
                                style={{
                                    width: 'auto',
                                    margin: 'auto',
                                }}
                            >
                                Oops! Seems like you haven't added any chord
                                yet... Please add a chord 👉🏼➕
                            </p>
                        )}
                        {provided.placeholder}
                    </ChordsTimeline>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Chords;
