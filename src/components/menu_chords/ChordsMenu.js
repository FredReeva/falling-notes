import React from 'react';
import ChordsDnDSection from './ChordsDnDSection';
import AddChordSection from './AddChordSection';
import BlurredPage from '../shared_components/BlurredPage';
import HeaderMenu from '../shared_components/HeaderMenu';
import ModalMenu from '../shared_components/ModalMenu';

const ChordsMenu = (props) => {
    const deleteChord = (id) => {
        // console.log('delete', id);
        props.updateChords(props.chords.filter((chord) => chord.id !== id));
    };

    const addChord = (chord) => {
        // generate id based on time (guaranteed to be unique for our application)
        const id = Date.now().toString();
        const newChord = { id, ...chord };

        props.updateChords([...props.chords, newChord]);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(props.chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        props.updateChords(items);
    }

    const toggleMenu = () => {
        props.toggleMenu(1);
        props.updateServer();
    };

    return props.showMenu ? (
        <div className="Container">
            <BlurredPage onClick={toggleMenu} />
            <ModalMenu className="ChordsMenu">
                <HeaderMenu titleMenu={'Chords Lab'} toggleMenu={toggleMenu} />

                <ChordsDnDSection
                    chords={props.chords}
                    handleOnDragEnd={handleOnDragEnd}
                    onDelete={deleteChord}
                />
                <AddChordSection onAdd={addChord} />
            </ModalMenu>
        </div>
    ) : null;
};

export default ChordsMenu;
