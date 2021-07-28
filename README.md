# Falling Notes 🌠

Welcome to Falling Notes! The aim of this musical-app is to provide a functional and beautiful melody generator. You can insert the chords you want and we will do our best to compute a melody that fits the progression. You can tweak some parameters and listen to the result on the fly with a couple of sounds that we provide. In the meantime, the background will display a visual and musical landscape that evolves according to the chord progression and the melody. If you like the result and want to experiment more, you can download a MIDI file containing both the melody and the chords.
If you have any doubt you can find an "info" section on the top right, which briefly resumes the content of this documentation.

Enjoy!

PS: Here we provide a short [demo](https://youtu.be/KQRXkWLWtYU) of the app.

## Part 1: Graphical User Interface

This is how the main screen of the app looks like when reproducing a song:
![Interface](./documentation/MainInterface.gif)
In the next sections we will describe in detail the functions of every button.

### Main Menu

The main menu consists of 6 interactive buttons that provide access to the main functionality of the app
![Main Menu](./documentation/MainMenuEx.png)

1. [Song Title Selection](#song-title-menu-)
2. [Chords Menu](#chords-menu-)
3. [Melody Generator](#melody-generator-)
4. [Style Menu](#style-menu-)
5. [Parameters menu](#parameters-menu-)
6. [Download MIDI](#midi-downloader-)
7. [Start/Stop transport](#play-)

### Song Title Menu 🔡

Start from here if you want to create your beautiful song. You can select a title from the list (and modify an existing song) or you can create a new one by typing a new title (make sure it is different from other titles!).
If you have writer's block, don't worry! You can still use the app with a 'default' song. Finally, you can also delete the selected song from the database.
![Song Selection Menu](./documentation/SongSelectionEx.gif)
\*opening this menu will also stop the reproduction of the song as soon as the transport ends

### Chords Menu 🎵

Here you can add, delete and modify the chords in your song. Every change will be saved when you exit the menu.
![Chords Menu](./documentation/ChordLabEx.gif)

\*opening this menu will also stop the reproduction of the song as soon as the transport ends

### Melody Generator 🎲

Pressing this button will generate a new melody based on the current chords the parameters' selection. Careful! The old melody will be overwritten. If you want to save the melody as a MIDI file please refer to
[Midi Downloader](#midi-downloader-)

\*pressing this button will also stop the reproduction of the current song as soon as the transport ends

### Style Menu 🎨

Here you can express your artistic side. You can modify the main color of the interface but also the type of sound used by the app to reproduce your song.

![Style Menu](./documentation/StyleLabEx.png)

### Parameters Menu ⚙

This is the brain of the melody computation. Select the tempo of your song, the balance beetween pauses and notes and the complexity of the generated melody. If you modify this parameters and you want to listen to the result, remember to [recompute the melody](#random-melody-generator-) before play.
![Parameters Menu](./documentation/ParametersLabEx.png)
\*opening this menu will also stop the reproduction of the song as soon as the transport ends

### Midi Downloader ⬇

This button generates and downloads a midi file containing the chords and the latest melody (in two separate tracks) of the currently selected song. Of course the melody is yours, and you can use it in your favourite DAW.

### Play! ⏯

Press this button to start/stop the transport and generate the animation. Wooow!

## Part 2: Technical Implementation

### Overview: React & Styled components

The app is built using the React framework. This allowed us not only to easily manage the rendering of the correct component but also its state. It also improved the code readibility and reusability. But what is a "component"? Components are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML via a render() function; let's see an example:

```javascript
const Component = (props) => {
    const [state, modState] = useState('changed state');
    const sayHello = () => {
        console.log(state);
    };
    return (
        <ContainerComponent onClick={props.doSomething}>
            <SubComponent className="SubComp" onClick={sayHello}>
                <p>This is a paragraph in component in a component!</p>
            </SubComponent>
        </ContainerComponent>
    );
};

export default Component;
```

Notice that a component contains its structure (and can be made of nested components...), its functions (or can call parent component's function passed as prop) and even some states. Father componets can always provide some of this functionality by passing some props to their childs.

To simplify the styling process we also used syled-components, a library that allows customize the CSS of a component directly inside of it:

```javascript
const StyledComponent = styled.div`
    width: 10px;
    height: 10px;
    background: red;
`;

const Component = (props) => {
    return <StyledComponent>Little Red Box</StyledComponent>;
};

export default Component;
```

#### App

This is the root component which contains the basic logic of the app, the global state and all the other nested components.

-   State: it includes the chords, melody and parameters objects, but also arrays to manage the open/close state of the menus or the play/stop of the reproduction...
-   All the functions that need to access directly the state are placed here (for example the DB management or the computation of the melody).
-   Effects: side functions called when a given state changes; we used it to initialize the app (empty dependency array).
-   Nested components: the organized structure of the whole app, as well as the props passed to every children.

#### Main Menu

This is a simple component that manages the open/closed state of every menu in our app; It also calls some utility functions, for example the one used to compute a melody, play/pause transport or create and download a MIDI file.

#### Menus

Every menu presented in the first section is made of several components grouped together to create the interface; in general they are made of:

-   Blurred background page
-   Modal menu (the actual menu window)
-   Header menu (contains the title of the menu and the exit button)
-   Menu content (varies according to the specific menu, for example sliders, buttons, text, forms...)

A menu can also include one or more internal states (which are used for internal operations and are not visibles from the parent).

#### Background

We generated the background using THREE JS, but we still needed to provide some properties from the main state of the app (eg: color); that's why we needed to include it in a React component and pass it as a refs.

### Song Database

The Songs created by the users are synchronized on a server using Firebase by Google. The state is costantly saved (every time a menu is closed) so that it is possible to continue modifying previously created songs. At launch we get a "default" song, but as soon as the user submits a song name in the [Title Menu](#song-title-menu-), a new empty state is initialized and uploaded to the DB (if the title didn't exixt in the database) or the selected song is loaded and ready to generate a new melody.

```javascript
const refSongs = firebase.firestore().collection('songs');
refSongs
    .doc(docName)
    .get()
    .then((doc) => {
        if (doc.exists) {
            // docName is in the server
            const items = doc.data();
            if (items) {
                let loadSong = [];
                for (const key in items) {
                    loadSong = [...loadSong, items[key]];
                }
                // load the chords into the song, erase current melody
                updateChords(loadSong);
                updateMelody([]);
            }
        } else {
            // docName is not in the server...
            updateChords([]);
            updateMelody([]);
            updateServer(docName);
        }
    })
    .catch((error) => {
        console.log('Error getting document:', error);
    });
```

If the "Delete" button is pressed, the song is deleted from the databese and you won't be able to recover it.

### Drag&Drop Chords Functionality

### Melody Generation

### Sound Generation (Tone)

### Sound Visualization (THREE JS)

### Midi Writer

When pressing the [Download Midi](#midi-downloader-) button, the current melody, chords, tempo and song name are passed to a function that generates a MIDI file exploiting the midi-writer external library. For every note in the melody we generate a MIDI event, taking care of pauses.

```javascript
melody.forEach((note) => {
    if (note['type'] === 'pause') {
        // collect pauses
        pause = pause + note['duration'];
    }
    if (note['type'] === 'note') {
        // manage notes
        pause = convertDurationValues(pause);
        melodyMidi.addEvent(
            [
                new MidiWriter.NoteEvent({
                    pitch: note['pitch'],
                    duration: 4 / note['duration'],
                    wait: pause,
                }),
            ],

            function (event, index) {
                return { sequential: true };
            }
        );
        pause = 0;
    }
});
```

Chords at first are turned into array of parallel notes, then underly a similar process before being saved in a different track.

A link containing the two midi tracks is generated and appended to the document body. A simulated click to this element occurs and the download begins.

## Part 3: Additional Material

These are the external libraries that we used during the production of our app:

-   React
-   React Icons: Ionicons 5
-   Styled Components
-   Firebase
-   React Beautiful DnD
-   React Color
-   Tone JS
-   Three JS
-   Midi Writer
