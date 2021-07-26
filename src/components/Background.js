import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import * as THREE from 'three';

let StyledBackground = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// COLOR PALETTE

let mainColor = new THREE.Color(Math.random(), Math.random(), Math.random());
mainColor = mainColor.getHSL(mainColor);
mainColor = mainColor.setHSL(mainColor.h, 0.7, 0.5);

let prevColor = mainColor.clone();
prevColor = prevColor.getHSL(prevColor);

let colorNeedsUpdate = 0;

// THREE COMPONENTS

let scene = new THREE.Scene();
{
    let color = '#000000';
    let density = 0.01;
    scene.fog = new THREE.FogExp2(color, density);
}
scene.background = new THREE.Color('#000000');

let triggerStarFall = 0;

function generateWorld(color, width, depth) {
    let geometry = new THREE.BufferGeometry();
    let numPoints = width * depth;
    let positions = new Float32Array(numPoints * 3);
    let colors = new Float32Array(numPoints * 3);

    let k = 0;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < depth; j++) {
            let u = i / width;
            let v = j / depth;

            let x = v - 0.5;
            let z = u - 0.5;
            let y = 0;

            positions[3 * k] = x;
            positions[3 * k + 1] = y;
            positions[3 * k + 2] = z;

            let intensity = (y + 0.001) * 10;
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

    let material = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
        transparent: true,
    });

    return new THREE.Line(geometry, material);
}

function updateWorld(world, color, width, depth, data) {
    let numPoints = width * depth;
    let positions = world.geometry.attributes.position.array;
    let colors = world.geometry.attributes.color.array;

    let k = numPoints;
    for (let i = width; i > 1; i--) {
        for (let j = depth; j > 0; j--) {
            let y = positions[3 * (k - depth) + 1];
            positions[3 * k + 1] = y;

            let intensity = (y + 0.001) * 6;
            colors[3 * k] = color.r * intensity;
            colors[3 * k + 1] = color.g * intensity;
            colors[3 * k + 2] = color.b * intensity;

            k--;
        }
    }

    for (let m = 0; m < depth; m++) {
        let num = data[m] / 255;

        positions[3 * m + 1] = num / 3.5;
        let y = positions[3 * m + 1];

        let intensity = (y + 0.001) * 6;
        colors[3 * m] = color.r * intensity;
        colors[3 * m + 1] = color.g * intensity;
        colors[3 * m + 2] = color.b * intensity;
    }
}

function generateStarField(num, radius) {
    let geom = new THREE.BufferGeometry();

    let pos = new Float32Array(3 * num);
    let col = new Float32Array(3 * num);

    let color = mainColor.clone();

    for (let i = 0; i < num; i++) {
        let x = 2 * (Math.random() - 0.5) * radius;
        let y = 2 * (Math.random() - 0.5) * radius;
        let z = 2 * (Math.random() - 0.5) * radius;
        let r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

        while (r > radius * 0.2) {
            x = 2 * (Math.random() - 0.5) * radius;
            y = 2 * (Math.random() - 0.5) * radius;
            z = 2 * (Math.random() - 0.5) * radius;
            r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        }

        pos[3 * i] = x;
        pos[3 * i + 1] = y;
        pos[3 * i + 2] = z;

        color = color.getHSL(color);
        let hueOffset = (Math.random() - 0.5) * 0.05;
        if (color.h + hueOffset < 0) {
            hueOffset = -hueOffset;
        } else if (color.h + hueOffset > 1) {
            hueOffset = -hueOffset;
        }

        color = color.offsetHSL(hueOffset, (Math.random() - 0.5) * 0.1, 0);
        color = color.getHSL(color);
        color = color.setHSL(color.h, color.s, 0.5 + Math.random() * 0.3);

        col[3 * i] = color.r;
        col[3 * i + 1] = color.g;
        col[3 * i + 2] = color.b;
    }

    geom.setAttribute(
        'position',
        new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geom.setAttribute(
        'color',
        new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geom.computeBoundingBox();

    let starFieldMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
    });

    return new THREE.Points(geom, starFieldMaterial);
}

function updateStarField(num, radius, field) {
    let pos = field.geometry.attributes.position.array;
    let col = field.geometry.attributes.color.array;

    let color = mainColor.clone();

    for (let i = 0; i < num; i++) {
        let x = (Math.random() - 0.5) * radius;
        let y = (Math.random() - 0.5) * radius;
        let z = (Math.random() - 0.5) * radius;
        let r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

        while (radius - r < 200) {
            x = (Math.random() - 0.5) * radius;
            y = (Math.random() - 0.5) * radius;
            z = (Math.random() - 0.5) * radius;
            r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        }

        pos[3 * i] = x;
        pos[3 * i + 1] = y;
        pos[3 * i + 2] = z;

        color = color.getHSL(color);
        let hueOffset = (Math.random() - 0.5) * 0.05;
        if (color.h + hueOffset < 0) {
            hueOffset = -hueOffset;
        } else if (color.h + hueOffset > 1) {
            hueOffset = -hueOffset;
        }

        color = color.offsetHSL(hueOffset, (Math.random() - 0.5) * 0.1, 0);
        color = color.getHSL(color);
        color = color.setHSL(color.h, color.s, 0.5 + Math.random() * 0.3);

        col[3 * i] = color.r;
        col[3 * i + 1] = color.g;
        col[3 * i + 2] = color.b;
    }
}

function generateStar(radius) {
    let timer = new THREE.Clock({ autoStart: false });

    let geom = new THREE.BufferGeometry();

    let position = new Float32Array(6);
    let velocity = new Float32Array(6);

    // line start
    position[0] = radius * 2 * (Math.random() - 0.5);
    position[1] = radius * Math.random();
    position[2] = radius * 2 * (Math.random() - 0.5);
    // line end
    position[3] = position[0];
    position[4] = position[1];
    position[5] = position[2];

    // velocity start
    velocity[0] = 0;
    velocity[1] = 0;
    velocity[2] = 0;
    // velocity end
    velocity[3] = 0;
    velocity[4] = 0;
    velocity[5] = 0;

    geom.setAttribute(
        'position',
        new THREE.BufferAttribute(position, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geom.setAttribute(
        'velocity',
        new THREE.BufferAttribute(velocity, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geom.computeBoundingBox();

    let material = new THREE.LineBasicMaterial({ color: mainColor });

    return [new THREE.Line(geom, material), timer];
}

function resetStar(star, timer, radius) {
    let position = star.geometry.attributes.position.array;
    let velocity = star.geometry.attributes.velocity.array;

    // line start
    position[0] = radius * 4 * (Math.random() - 0.5);
    position[1] = 20 + (Math.random() - 0.5) * 5;
    position[2] = -radius * Math.random();
    // line end
    position[3] = position[0];
    position[4] = position[1];
    position[5] = position[2];

    let targetX = (Math.random() - 0.5) * 100;
    let targetY = (Math.random() + 0.5) * 5;
    let targetZ = (Math.random() + 0.5) * 100;

    let directionX = targetX - position[0];
    let directionY = targetY - position[1];
    let directionZ = targetZ - position[2];

    // velocity start
    velocity[0] = directionX * 0.015;
    velocity[1] = directionY * 0.015;
    velocity[2] = directionZ * 0.015;
    // velocity end
    velocity[3] = directionX * 0.01;
    velocity[4] = directionY * 0.01;
    velocity[5] = directionZ * 0.01;

    star.material.color = new THREE.Color(mainColor);

    timer.start();
}

function updateStar(star, timer, radius) {
    let positions = star.geometry.attributes.position.array;
    let velocity = star.geometry.attributes.velocity.array;

    let life = timer.getElapsedTime();
    let resetTime = 2;
    let progress = life / resetTime;

    if (progress < 0.75) {
        // line start
        positions[0] += velocity[0];
        positions[1] += velocity[1];
        positions[2] += velocity[2];
    }

    let color = mainColor.clone();
    let deathColor = mainColor.clone();
    deathColor = deathColor.getHSL(deathColor);
    deathColor = deathColor.setHSL(deathColor.h, 1, 0.8);
    color = color.lerp(deathColor, progress);
    star.material.color = color;

    // line end
    positions[3] += velocity[3];
    positions[4] += velocity[4];
    positions[5] += velocity[5];

    if (progress > 1) {
        resetStar(star, timer, radius);
    }
}

// REACTIVE AUDIO

let sound = require('./Sound.js');
let audioCtx = sound.context;

let analyserLeft = audioCtx.createAnalyser();
let analyserRight = audioCtx.createAnalyser();

analyserLeft.fftSize = 256;
analyserLeft.smoothingTimeConstant = 0.7;
analyserLeft.minDecibels = -150;
analyserLeft.maxDecibels = -10;

analyserRight.fftSize = 256;
analyserRight.smoothingTimeConstant = 0.7;
analyserRight.minDecibels = -150;
analyserRight.maxDecibels = -10;

let bufferLength = analyserLeft.frequencyBinCount;

Tone.connect(sound.busLeft, analyserLeft);
Tone.connect(sound.busRight, analyserRight);



// AUDIO VISUALIZER UPDATE

function updateSpectrum(world, width, depth) {
    let spectrumLeft = new Uint8Array(bufferLength);
    let spectrumRight = new Uint8Array(bufferLength);
    let spectrum = new Uint8Array(bufferLength * 2);

    analyserLeft.getByteFrequencyData(spectrumLeft);
    analyserRight.getByteFrequencyData(spectrumRight);

    spectrum.set(spectrumRight.reverse());
    spectrum.set(spectrumLeft, spectrumRight.length);

    updateWorld(world, mainColor, width, depth, spectrum);
}

const Background = (props) => {
    let mount = useRef(null);

    // INITIALIZATION
    useEffect(() => {
        // THREE RENDERER

        let winWidth = mount.current.clientWidth;
        let winHeight = mount.current.clientHeight;

        let camera = new THREE.PerspectiveCamera(
            100,
            winWidth / winHeight,
            1,
            20000
        );
        camera.position.set(0, 5, -5);
        let target = new THREE.Vector3(0, 0, 30);
        camera.lookAt(target);

        let renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(winWidth, winHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        let handleResize = () => {
            winWidth = mount.current.clientWidth;
            winHeight = mount.current.clientHeight;
            renderer.setSize(winWidth, winHeight);
            camera.aspect = winWidth / winHeight;
            camera.updateProjectionMatrix();
        };

        //CONTROLS

        let mouseX = 0;
        let mouseY = 0;

        let windowHalfX = winWidth / 2;
        let windowHalfY = winHeight / 2;

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        function onDocumentMouseMove(event) {
            mouseX = ((event.clientX - windowHalfX) / winWidth) * 2; //-1 to 1
            mouseY = ((event.clientY - windowHalfY) / winHeight) * 2; //-1 to 1
        }

        // WORLD

        let worldWidth = 50;
        let worldDepth = bufferLength * 2;

        let world = generateWorld(mainColor, worldWidth, worldDepth);
        world.scale.set(200, 40, 200);
        world.position.set(0, -10, 100);

        scene.add(world);

        // STAR FIELD

        let numField = 250;
        let starFieldRadius = 300;

        let starField = generateStarField(numField, starFieldRadius);
        scene.add(starField);

        // FALLING STARS

        let starFallRadius = 10;

        let starFall1 = generateStar(starFallRadius);
        let star1 = starFall1[0];
        let timer1 = starFall1[1];

        let starFall2 = generateStar(starFallRadius);
        let star2 = starFall2[0];
        let timer2 = starFall2[1];

        let starFall3 = generateStar(starFallRadius);
        let star3 = starFall3[0];
        let timer3 = starFall3[1];

        // FLOOR

        let floorGeom = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
        let floorMat = new THREE.MeshBasicMaterial({
            //! floor color
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        let floor = new THREE.Mesh(floorGeom, floorMat);
        floor.rotateX(-Math.PI / 2);
        floor.position.set(0, -7, 0);

        scene.add(floor);

        // ANIMATE

        mount.current.appendChild(renderer.domElement);
        window.addEventListener('resize', handleResize);

        function animate() {
            audioCtx.resume();
            camera.lookAt(target);

            updateSpectrum(world, worldWidth, worldDepth);

            if (triggerStarFall == 1) {
                async function startStarFall() {
                    timer1.start();
                    scene.add(star1);
                    await sleep(1200);
                    timer2.start();
                    scene.add(star2);
                    await sleep(1800);
                    timer3.start();
                    scene.add(star3);
                }
                startStarFall();
                triggerStarFall = 0;
            } else if (triggerStarFall == -1) {
                async function endStarFall() {
                    await sleep(2600);
                    scene.remove(star1);
                    scene.remove(star2);
                    scene.remove(star3);
                    resetStar(star1, timer1, starFallRadius);
                    resetStar(star2, timer2, starFallRadius);
                    resetStar(star3, timer3, starFallRadius);
                }
                endStarFall();

                timer1.stop();
                timer2.stop();
                timer3.stop();
                triggerStarFall = 0;
            } else {
                updateStar(star1, timer1, starFallRadius);
                updateStar(star2, timer2, starFallRadius);
                updateStar(star3, timer3, starFallRadius);
            }

            if (colorNeedsUpdate == 1) {
                updateStarField(numField, starFieldRadius, starField);
                colorNeedsUpdate = 0;
            }

            if (mouseY > 0) {
                starField.rotation.x =
                    starField.rotation.x - mouseY * 0.0002 + 0.0001;
            } else {
                starField.rotation.x =
                    starField.rotation.x - mouseY * 0.0002 - 0.0001;
            }
            if (mouseX > 0) {
                starField.rotation.y =
                    starField.rotation.y + mouseX * 0.0002 + 0.0001;
                starField.rotation.z =
                    starField.rotation.z + mouseX * 0.0002 + 0.0001;
            } else {
                starField.rotation.y =
                    starField.rotation.y + mouseX * 0.0002 - 0.0001;
                starField.rotation.z =
                    starField.rotation.z + mouseX * 0.0002 - 0.0001;
            }

            world.geometry.attributes.position.needsUpdate = true;
            world.geometry.attributes.color.needsUpdate = true;

            starField.geometry.attributes.position.needsUpdate = true;
            starField.geometry.attributes.color.needsUpdate = true;

            star1.geometry.attributes.position.needsUpdate = true;
            star1.geometry.attributes.velocity.needsUpdate = true;
            star1.material.color.needsUpdate = true;

            star2.geometry.attributes.position.needsUpdate = true;
            star2.geometry.attributes.velocity.needsUpdate = true;
            star2.material.color.needsUpdate = true;

            star3.geometry.attributes.position.needsUpdate = true;
            star3.geometry.attributes.velocity.needsUpdate = true;
            star3.material.color.needsUpdate = true;

            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }, []); // never update

    // COLOR PALETTE MANAGEMENT
    useEffect(() => {
        prevColor = mainColor;
        mainColor = mainColor.getHSL(mainColor);
        mainColor = mainColor.setHSL((props.color + 0.1) / 360, 0.7, 0.5);
        colorNeedsUpdate = 1;
    }, [props.color]); // update when prop changes

    // TRIGGER STAR FALL
    useEffect(() => {
        if (props.isPlaying == 0) {
            triggerStarFall = -1;
        } else if (props.isPlaying == 1) {
            triggerStarFall = 1;
        }
    }, [props.isPlaying]); // update when prop changes

    return <StyledBackground className={props.className} ref={mount} />;
};

export default Background;
