import React, { useEffect, useRef, useState } from 'react';
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

let mainColor = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
);
mainColor = mainColor.getHSL(mainColor);


const Background = (props) => {

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let mount = useRef(null);

    useEffect(() => {
        // THREE INITIALIZATION
        let winWidth = mount.current.clientWidth;
        let winHeight = mount.current.clientHeight;
        let scene = new THREE.Scene();
        // {
        //     let color = '#000000';
        //     let density = 0.01;
        //     scene.fog = new THREE.FogExp2(color, density);
        // }
        let camera = new THREE.PerspectiveCamera(
            100,
            winWidth / winHeight,
            1,
            20000
        );
        // background
        scene.background = new THREE.Color('#000000');
        // camera
        camera.position.set(0, 5, -5);
        let target = new THREE.Vector3(0, 0, 30);
        camera.lookAt(target);

        let renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(winWidth, winHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

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

        let handleResize = () => {
            winWidth = mount.current.clientWidth;
            winHeight = mount.current.clientHeight;
            renderer.setSize(winWidth, winHeight);
            camera.aspect = winWidth / winHeight;
            camera.updateProjectionMatrix();
        };

        // REACTIVE AUDIO

        let sound = require('./Sound.js');
        let audioCtx = sound.context;

        let analyserLeft = audioCtx.createAnalyser();
        let analyserRight = audioCtx.createAnalyser();
        let analyserSplitter = audioCtx.createChannelSplitter(2);

        analyserLeft.fftSize = 128;
        analyserLeft.smoothingTimeConstant = 0.7;
        analyserLeft.minDecibels = -110;
        analyserLeft.maxDecibels = -10;

        analyserRight.fftSize = 128;
        analyserRight.smoothingTimeConstant = 0.7;
        analyserRight.minDecibels = -110;
        analyserRight.maxDecibels = -10;

        let bufferLength = analyserLeft.frequencyBinCount;

        Tone.connect(sound.bus, analyserSplitter);

        analyserSplitter.connect(analyserLeft, 0);
        analyserSplitter.connect(analyserRight, 1);

        // WORLD

        function generateWorld(color, width, length) {
            let geometry = new THREE.BufferGeometry();
            let numPoints = width * length;
            let positions = new Float32Array(numPoints * 3);
            let colors = new Float32Array(numPoints * 3);

            let k = 0;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < length; j++) {
                    let u = i / width;
                    let v = j / length;

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
                new THREE.BufferAttribute(positions, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            geometry.setAttribute(
                'color',
                new THREE.BufferAttribute(colors, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            geometry.computeBoundingBox();

            let material = new THREE.PointsMaterial({
                size: 0.01,
                vertexColors: true,
                transparent: true,
            });

            return new THREE.Line(geometry, material);
        }

        function updateWorld(world, color, width, length, data) {
            let numPoints = width * length;
            let positions = world.geometry.attributes.position.array;
            let colors = world.geometry.attributes.color.array;

            let k = numPoints;
            for (let i = width; i > 1; i--) {
                for (let j = length; j > 0; j--) {
                    let y = positions[3 * (k - length) + 1];
                    positions[3 * k + 1] = y;

                    let intensity = (y + 0.001) * 6;
                    colors[3 * k] = color.r * intensity;
                    colors[3 * k + 1] = color.g * intensity;
                    colors[3 * k + 2] = color.b * intensity;

                    k--;
                }
            }

            for (let m = 0; m < length; m++) {
                let num = data[m] / 255;

                positions[3 * m + 1] = num / 3.5;
                let y = positions[3 * m + 1];

                let intensity = (y + 0.001) * 6;
                colors[3 * m] = color.r * intensity;
                colors[3 * m + 1] = color.g * intensity;
                colors[3 * m + 2] = color.b * intensity;
            }
        }

        let worldWidth = 50;
        let worldDepth = bufferLength * 2;
        let world = generateWorld(mainColor, worldWidth, worldDepth);
        world.scale.set(200, 40, 200);
        world.position.set(0, -10, 100);
        scene.add(world);

        // STAR FIELD

        let numField = 500;
        let starFieldradius = 350;

        function generateStarField(baseColor) {
            let starFieldGeom = new THREE.BufferGeometry();

            let starFieldpos = new Float32Array(3 * numField);
            let starFieldcol = new Float32Array(3 * numField);

            for (let i = 0; i < numField; i++) {
                let x = (Math.random() - 0.5) * starFieldradius;
                let y = (Math.random() - 0.5) * starFieldradius;
                let z = (Math.random() - 0.5) * starFieldradius;
                let r = Math.sqrt(
                    Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)
                );

                while (starFieldradius - r < 200) {
                    x = (Math.random() - 0.5) * starFieldradius;
                    y = (Math.random() - 0.5) * starFieldradius;
                    z = (Math.random() - 0.5) * starFieldradius;
                    r = Math.sqrt(
                        Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)
                    );
                }

                starFieldpos[3 * i] = x;
                starFieldpos[3 * i + 1] = y;
                starFieldpos[3 * i + 2] = z;

                let color = baseColor.clone();
                color = color.getHSL(color);

                let hueOffset = (Math.random() - 0.5) * 0.5; // +/- 0.15
                if (color.h + hueOffset < 0) {
                    color.h = color.h - hueOffset;
                } else if (color.h + hueOffset > 1) {
                    color.h = color.h - hueOffset;;
                }

                color = color.offsetHSL(
                    0,
                    (Math.random() - 0.5) * 0.2,
                    0
                );
                color = color.setHSL(
                    color.h,
                    color.s,
                    0.5 + Math.random() * 0.2
                );

                starFieldcol[3 * i] = color.r;
                starFieldcol[3 * i + 1] = color.g;
                starFieldcol[3 * i + 2] = color.b;
            }

            starFieldGeom.setAttribute(
                'position',
                new THREE.BufferAttribute(starFieldpos, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            starFieldGeom.setAttribute(
                'color',
                new THREE.BufferAttribute(starFieldcol, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            starFieldGeom.computeBoundingBox();

            let starFieldMaterial = new THREE.PointsMaterial({
                size: 0.3,
                vertexColors: true,
            });

            return new THREE.Points(starFieldGeom, starFieldMaterial);
        }

        function updateStarField(starField, baseColor) {
            let colors = starField.geometry.attributes.color.array;

            for (let i = 0; i < numField; i++) {

                let color = baseColor.clone();
                color = color.getHSL(color);
                
                let hueOffset = (Math.random() - 0.5) * 0.5; // +/- 0.15
                if (color.h + hueOffset < 0) {
                    color.h = color.h - hueOffset;
                } else if (color.h + hueOffset > 1) {
                    color.h = color.h - hueOffset;;
                }

                color = color.offsetHSL(
                    0,
                    (Math.random() - 0.5) * 0.2,
                    0
                );
                color = color.setHSL(
                    color.h,
                    color.s,
                    0.5 + Math.random() * 0.2
                );

                colors[3 * i] = color.r;
                colors[3 * i + 1] = color.g;
                colors[3 * i + 2] = color.b;
            }

        }

        let starField = generateStarField(mainColor);
        scene.add(starField);

        // FALLING STARS

        let starFallradius = 10;

        function generateStar(baseColor) {
            let timer = new THREE.Clock();

            let starGeom = new THREE.BufferGeometry();

            let position = new Float32Array(6);
            let color = new Float32Array(3);
            let velocity = new Float32Array(6);

            let targetX = 0;
            let targetY = 0;
            let targetZ = 50;

            // line start
            position[0] = starFallradius * 2 * (Math.random() - 0.5);
            position[1] = starFallradius * Math.random();
            position[2] = starFallradius * 2 * (Math.random() - 0.5);
            // line end
            position[3] = position[0];
            position[4] = position[1];
            position[5] = position[2];

            let directionX = targetX - position[0];
            let directionY = targetY - position[1];
            let directionZ = targetZ - position[2];

            velocity[0] = directionX * 0.03;
            velocity[1] = directionY * 0.03;
            velocity[2] = directionZ * 0.03;
            // velocity end
            velocity[3] = directionX * 0.02;
            velocity[4] = directionY * 0.02;
            velocity[5] = directionZ * 0.02;

            starGeom.setAttribute(
                'position',
                new THREE.BufferAttribute(position, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            starGeom.setAttribute(
                'velocity',
                new THREE.BufferAttribute(velocity, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            starGeom.computeBoundingBox();

            let starMaterial = new THREE.LineBasicMaterial({ color: baseColor });

            return [new THREE.Line(starGeom, starMaterial), timer];
        }

        function resetStar(star, timer, baseColor) {
            let position = star.geometry.attributes.position.array;
            let velocity = star.geometry.attributes.velocity.array;

            // line start
            position[0] = starFallradius * 4 * (Math.random() - 0.5);
            position[1] = 20 + (Math.random() - 0.5) * 5;
            position[2] = -starFallradius * Math.random();
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

            star.material.color = new THREE.Color(baseColor);

            timer.start();
        }

        function updateStar(star, timer, baseColor) {
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
            let tresh = 0.1;

            let color = baseColor.clone();

            let deathColor = baseColor.clone();
            deathColor = deathColor.getHSL(deathColor);
            deathColor = deathColor.setHSL(0, 1, 0.2);

            color = color.lerp(deathColor, progress);
            star.material.color = color;

            // line end
            positions[3] += velocity[3];
            positions[4] += velocity[4];
            positions[5] += velocity[5];

            if (progress > 1) {
                resetStar(star, timer, baseColor);
            }
        }

        let starFall1 = generateStar(mainColor);
        let star1 = starFall1[0];
        let timer1 = starFall1[1];

        let starFall2 = generateStar(mainColor);
        let star2 = starFall2[0];
        let timer2 = starFall2[1];

        let starFall3 = generateStar(mainColor);
        let star3 = starFall3[0];
        let timer3 = starFall3[1];

        async function starFall() {
            timer1.start();
            scene.add(star1);

            await sleep(1800);
            timer2.start();
            scene.add(star2);

            await sleep(11200);
            timer3.start();
            scene.add(star3);
        }

        starFall();

        // FLOOR

        let floorGeom = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
        let floorMat = new THREE.MeshBasicMaterial({
            //! floor color
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        let floor = new THREE.Mesh(floorGeom, floorMat);
        floor.rotateX(-Math.PI / 2);
        floor.position.set(0, -10, 0);

        scene.add(floor);

        // AUDIO VISUALIZER UPDATE

        function updateSpectrum(world) {
            let spectrumLeft = new Uint8Array(bufferLength);
            let spectrumRight = new Uint8Array(bufferLength);
            let spectrum = new Uint8Array(bufferLength * 2);

            analyserLeft.getByteFrequencyData(spectrumLeft);
            analyserRight.getByteFrequencyData(spectrumRight);

            spectrum.set(spectrumRight.reverse());
            spectrum.set(spectrumLeft, spectrumRight.length);

            updateWorld(world, mainColor, worldWidth, worldDepth, spectrum);
        }

        // ANIMATE

        mount.current.appendChild(renderer.domElement);
        window.addEventListener('resize', handleResize);

        function animate() {
            audioCtx.resume();
            camera.lookAt(target);

            updateSpectrum(world);
            updateStar(star1, timer1, mainColor);
            updateStar(star2, timer2, mainColor);
            updateStar(star3, timer3, mainColor);
            updateStarField(starField, mainColor);

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

    useEffect(() => {
        mainColor = mainColor.getHSL(mainColor);
        mainColor = mainColor.setHSL((props.color +0.1)/ 360, 0.7, 0.5);
        
    }, [props.color]); // update when prop changes

    return <StyledBackground className={props.className} ref={mount} />;
};

export default Background;
