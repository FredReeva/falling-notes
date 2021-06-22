import * as THREE from 'three';
import * as Tone from 'tone';
/* import oc from 'three-orbit-controls'
const OrbitControls = oc(THREE) */

// 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    20000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

//normal camera
camera.position.set(0, 5, -10);
var target = new THREE.Vector3(0, 0, 100);
//var target = new THREE.Vector3(0 , 0 , 30)
camera.lookAt(target);

//controls
var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
    mouseX = ((event.clientX - windowHalfX) / window.innerWidth) * 2; //-1 to 1
    mouseY = ((event.clientY - windowHalfY) / window.innerHeight) * 2; //-1 to 1
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// audioCtx

var sound = require('./Sound.js');
var audioCtx = sound.context;
/* var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var myAudio = document.querySelector("audio");
var source = audioCtx.createMediaElementSource(myAudio); */

var analyserLeft = audioCtx.createAnalyser();
var analyserRight = audioCtx.createAnalyser();
var splitter = audioCtx.createChannelSplitter(2);

//var merger  = audioCtx.createChannelMerger(2);
//source.connect(splitter);

analyserLeft.fftSize = 128;
analyserLeft.smoothingTimeConstant = 0.6;
analyserLeft.minDecibels = -110;
analyserLeft.maxDecibels = -10;

analyserRight.fftSize = 128;
analyserRight.smoothingTimeConstant = 0.6;
analyserRight.minDecibels = -110;
analyserRight.maxDecibels = -10;

var bufferLength = analyserLeft.frequencyBinCount;

Tone.connect(Tone.Master, splitter);

splitter.connect(analyserLeft, 0);
splitter.connect(analyserRight, 1);

/* analyserLeft.connect(merger, 0, 0);
analyserRight.connect(merger, 0 , 1);
merger.connect(audioCtx.destination); */

// build 3D world

const worldWidth = 200,
    worldDepth = bufferLength * 2;
const pointSize = 0.05;

function generatePointCloud(color, width, length) {
    const geometry = new THREE.BufferGeometry();
    const numPoints = width * length;

    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    let k = 0;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < length; j++) {
            const u = i / width;
            const v = j / length;

            const x = v - 0.5;
            const z = u - 0.5;
            const y = 0;

            positions[3 * k] = x;
            positions[3 * k + 1] = y;
            positions[3 * k + 2] = z;

            const intensity = (y + 0.001) * 10;
            colors[3 * k] = color.r * intensity;
            colors[3 * k + 1] = color.g * intensity;
            colors[3 * k + 2] = color.b * intensity;

            k++;
        }
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geometry.computeBoundingBox();

    const material = new THREE.PointsMaterial({
        size: pointSize,
        vertexColors: true,
    });

    return new THREE.Line(geometry, material);
}

function updatePointCloud(pointCloud, color, width, length, data) {
    const numPoints = width * length;

    const positions = pointCloud.geometry.attributes.position.array;
    const colors = pointCloud.geometry.attributes.color.array;

    let k = numPoints;

    for (let i = width; i > 1; i--) {
        for (let j = length; j > 0; j--) {
            var y = positions[3 * (k - length) + 1];
            positions[3 * k + 1] = y;

            const intensity = (y + 0.001) * 6;
            colors[3 * k] = (color.r * intensity * (width - i)) / width;
            colors[3 * k + 1] = (color.g * intensity * (width - i)) / width;
            colors[3 * k + 2] = (color.b * intensity * (width - i)) / width;

            k--;
        }
    }

    for (let m = 0; m < length; m++) {
        var num = data[m] / 255;

        positions[3 * m + 1] = num / 3.5;
        var y = positions[3 * m + 1];

        const intensity = (y + 0.001) * 6;
        colors[3 * m] = color.r * intensity;
        colors[3 * m + 1] = color.g * intensity;
        colors[3 * m + 2] = color.b * intensity;
    }
}

const color = new THREE.Color(1, 1, 1);
const pcIndexed = generatePointCloud(color, worldWidth, worldDepth);
pcIndexed.scale.set(100, 40, 200);
pcIndexed.position.set(0, -10, 100);
scene.add(pcIndexed);

// audio visualizer setup

function updateSpectrum(pointCloud) {
    var spectrumLeft = new Uint8Array(bufferLength);
    var spectrumRight = new Uint8Array(bufferLength);
    var spectrum = new Uint8Array(bufferLength * 2);

    analyserLeft.getByteFrequencyData(spectrumLeft);
    analyserRight.getByteFrequencyData(spectrumRight);

    spectrum.set(spectrumRight.reverse());
    spectrum.set(spectrumLeft, spectrumRight.length);

    updatePointCloud(pointCloud, color, worldWidth, worldDepth, spectrum);
}

// animate

let i = 0;

function animate() {
    audioCtx.resume();
    target.x =
        -mouseX * 30 * window.devicePixelRatio +
        Math.sin((Math.PI * i) / 300) * 5;
    target.y = (-mouseY + 1) * 30;
    target.x = Math.sin((Math.PI * i) / 300) * 10;
    i++;
    camera.lookAt(target);
    //controls.update();
    updateSpectrum(pcIndexed);
    pcIndexed.geometry.attributes.position.needsUpdate = true;
    pcIndexed.geometry.attributes.color.needsUpdate = true;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
