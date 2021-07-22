import firebase from 'firebase/app';
import 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // apiKey: 'AIzaSyCHt07QmrCgXY_U17O23jQVpAxUmXD_W0E',
    // authDomain: 'falling-notes.firebaseapp.com',
    // projectId: 'falling-notes',
    // storageBucket: 'falling-notes.appspot.com',
    // messagingSenderId: '207181998221',
    // appId: '1:207181998221:web:20bb5a0f9075f527c45ac4',
    // measurementId: 'G-FKWRFZHM6B',

    apiKey: 'AIzaSyA_oN8KNoH7IRTTDTbTCV_HdjX7kCCUdCE',
    authDomain: 'fa-no-92f77.firebaseapp.com',
    projectId: 'fa-no-92f77',
    storageBucket: 'fa-no-92f77.appspot.com',
    messagingSenderId: '126141384109',
    appId: '1:126141384109:web:37d1f53610cb8522cc0d24',
    measurementId: 'G-T50C9WGFYZ',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
