# Falling Notes 🌠

Abstract: what the app does in 4 lines

## Part 1: Graphical User Interface

Overview of the main interface of the app [foto]

### Main Menu

The main menu consists of 6 interactive buttons that provide access to the main functionality of the app
![Main Menu](./documentation/MainMenuEx.png)

1. [Song Title Selection](#song-title-menu-)
2. [Chords Menu](#chords-menu-)
3. [Melody Generator](#random-melody-generator-)
4. [Style Menu](#style-menu-)
5. [Parameters menu](#parameters-menu-)
6. [Download MIDI](#midi-downloader-)
7. [Start/Stop transport](#play-)

#### Song Title Menu 🔡

Start from here if you want to create your beautiful song. You can select a title from the list (and modify an existing song) or you can create a new one by typing a new title (make sure it is different from other titles!).
If you don't want to create a song, don't worry! You can still use the app with a 'default' song. Finally, you can delete the selected song from the database.
![Song Selection Menu](./documentation/SongSelectionEx.gif)
\*opening this menu will also stop the reproduction of the song

#### Chords Menu 🎵

Here you can add, delete and modify the chords in your song. Every change will be saved when you exit the menu.
![Chords Menu](./documentation/ChordLabEx.gif)

\*opening this menu will also stop the reproduction of the song

#### Random Melody Generator 🎲

Pressing this button will generate a new melody based on the current chords the parameters' selection. Careful! The old melody will be overwritten. If you wnt to save the melody in a file please refer to
[Midi Downloader](#midi-downloader-)

\*pressing this button will also stop the reproduction of the current song

#### Style Menu 🎨

Here you can express your artistic side. You can modify the main color of the interface but also the type of sound used by the app to reproduce your song.

![Style Menu](./documentation/StyleLabEx.png)

#### Parameters Menu ⚙

This is the brain of the melody computation. Select the tempo of your song, the balance beetween pauses and notes and the complexity of the generated melody. If you modify this parameters and you want to listen to the result, remember to [recompute the melody](#random-melody-generator-) before play.
![Parameters Menu](./documentation/ParametersLabEx.png)
\*opening this menu will also stop the reproduction of the song

#### Midi Downloader ⬇

This button generates and downloads a midi file containing the chords and the latest melody (in two separate tracks) of the currently selected song. Of course the melody is yours, and you can use it in your favourite DAW.

#### Play! ⏯

Press this button to start/stop the transport and generate the animation. Enjoy some falling notes!

## Part 2: Technical Implementation

### Overview: React & Styled components

### Song Database

### Drag&Drop Chords Functionality

### Melody Generation

### Sound Generation (Tone)

### Sound Visualization (THREE JS)

### Midi Writer

## Part 3: Additional Material

-   React
-   React Icons: Ionicons 5
-   Styled Components
-   Firebase
-   React Beautiful DnD
-   React Color
-   Tone JS
-   Three JS
-   Midi Writer
