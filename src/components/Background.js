import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';
import * as THREE from 'three';

let World = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let Background = () => {
    let mount = useRef(null);

    useEffect(() => {

        // THREE INITIALIZATION
        let winWidth = mount.current.clientWidth;
        let winHeight = mount.current.clientHeight;
        let scene = new THREE.Scene();
        // {
        //     let color = 0x000000;
        //     let density = 0.001;
        //     scene.fog = new THREE.FogExp2(color, density);
        //   }
        let camera = new THREE.PerspectiveCamera(
            100,
            winWidth / winHeight,
            1,
            20000
        );

        let renderer = new THREE.WebGLRenderer();

        renderer.setSize(winWidth, winHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        camera.position.set(0, 5, -5);
        //camera.position.set(0, 100, 100);
        let target = new THREE.Vector3(0 , 0 , 30)
        camera.lookAt(target);

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
        let splitter = audioCtx.createChannelSplitter(2);

        analyserLeft.fftSize = 128;
        analyserLeft.smoothingTimeConstant = 0.1;
        analyserLeft.minDecibels = -110;
        analyserLeft.maxDecibels = -10;

        analyserRight.fftSize = 128;
        analyserRight.smoothingTimeConstant = 0.1;
        analyserRight.minDecibels = -110;
        analyserRight.maxDecibels = -10;

        let bufferLength = analyserLeft.frequencyBinCount;

        Tone.connect(Tone.Master, splitter);

        splitter.connect(analyserLeft, 0);
        splitter.connect(analyserRight, 1);

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
                    colors[3*k] = (color.r * intensity * (width - i)) / width;
                    colors[3*k+1] = (color.g * intensity * (width - i)) / width;
                    colors[3*k+2] = (color.b * intensity * (width - i)) / width;

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

        let worldWidth = 50, worldDepth = bufferLength * 2;
        let color = new THREE.Color(1,1,1);
        let world = generateWorld(color, worldWidth, worldDepth);
        world.scale.set(200, 40, 200);
        world.position.set(0, -10, 100);
        scene.add(world);

        // STAR FIELD

        let numField = 2000;
        let starFieldradius = 200;

        function generateStarField(num, radius) {
            let starFieldGeom = new THREE.BufferGeometry();

            let starFieldpos = new Float32Array(3*num);
            let starFieldcol = new Float32Array(3*num);
    
    
            for(let i=0; i<num; i++) {
                starFieldpos[3*i] = radius*2*(Math.random()-0.5);
                starFieldpos[3*i+1] = radius*2*(Math.random()-0.5);
                starFieldpos[3*i+2] = radius*2*(Math.random()-0.5);
                starFieldcol[3*i] = 1;
                starFieldcol[3*i+1] = 1;
                starFieldcol[3*i+2] = 1;
            }
    
            starFieldGeom.setAttribute('position', new THREE.BufferAttribute( starFieldpos, 3 ).setUsage(THREE.DynamicDrawUsage));
            starFieldGeom.setAttribute( 'color', new THREE.BufferAttribute( starFieldcol, 3 ));
            starFieldGeom.computeBoundingBox();
    
            let starFieldMaterial = new THREE.PointsMaterial({
                size: 0.03,
                vertexColors: true
            });

            return new THREE.Points(starFieldGeom, starFieldMaterial);
        }

        let starField = generateStarField(numField, starFieldradius)
        scene.add(starField);

        // let cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
        // let cubeMat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        // let cube1 = new THREE.Mesh( cubeGeo, cubeMat );
        // let cube2 = cube1.clone();
        // scene.add(cube1);
        // scene.add(cube2);
        // cube2.translateZ(50);

        // FALLING STARS

        let starFallradius = 10;

        function generateStar(radius) {

            let timer = new THREE.Clock();

            let starGeom = new THREE.BufferGeometry();

            let position = new Float32Array(6);
            let color = new Float32Array(3);
            let velocity = new Float32Array(6);

            let targetX = 0;
            let targetY = 0;
            let targetZ = 50;

            // line start
            position[0] = radius*2*(Math.random()-0.5);
            position[1] = radius*Math.random();
            position[2] = radius*2*(Math.random()-0.5);
            // line end
            position[3] = position[0];
            position[4] = position[1];
            position[5] = position[2];

            let directionX = targetX-position[0];
            let directionY = targetY-position[1];
            let directionZ = targetZ-position[2];

            velocity[0] = directionX*0.03;
            velocity[1] = directionY*0.03;
            velocity[2] = directionZ*0.03;
            // velocity end
            velocity[3] = directionX*0.02;
            velocity[4] = directionY*0.02;
            velocity[5] = directionZ*0.02;

            color[0] = 1;
            color[1] = 1;
            color[2] = 1;

            starGeom.setAttribute('position', new THREE.BufferAttribute( position, 3 ).setUsage(THREE.DynamicDrawUsage));
            starGeom.setAttribute('velocity', new THREE.BufferAttribute( velocity, 3 ).setUsage(THREE.DynamicDrawUsage));
            starGeom.computeBoundingBox();

            let starMaterial = new THREE.LineBasicMaterial({color: 0xfffff});

            return [new THREE.Line(starGeom, starMaterial), timer];
        }

        function resetStar (star, timer, radius) {
            let position = star.geometry.attributes.position.array;
            let velocity = star.geometry.attributes.velocity.array;

            // line start
            position[0] = radius*4*(Math.random()-0.5);
            position[1] = 20+(Math.random()-0.5)*5;
            position[2] = -radius*Math.random();
            // line end
            position[3] = position[0];
            position[4] = position[1];
            position[5] = position[2];

            let targetX = (Math.random()-0.5)*100;
            let targetY = (Math.random()+0.5)*5;
            let targetZ = (Math.random()+0.5)*100;

            let directionX = targetX-position[0];
            let directionY = targetY-position[1];
            let directionZ = targetZ-position[2];

            // velocity start
            velocity[0] = directionX*0.015;
            velocity[1] = directionY*0.015;
            velocity[2] = directionZ*0.015;
            // velocity end
            velocity[3] = directionX*0.010;
            velocity[4] = directionY*0.010;
            velocity[5] = directionZ*0.010;

            star.material.color = new THREE.Color(0xFFFFFF);

            timer.start();
            

        }

        function updateStar (star, timer, radius, num) {

            let positions = star.geometry.attributes.position.array;
            let velocity = star.geometry.attributes.velocity.array;

            let life = timer.getElapsedTime();
            let resetTime = 2.5;
            let progress = life / resetTime;

            if (progress < 0.75) {
                // line start
                positions[0] += velocity[0];
                positions[1] += velocity[1];
                positions[2] += velocity[2];
            }
            let tresh = 0.1;
            if (progress > tresh) {
                star.material.color = new THREE.Color(1, (1-progress)/(1-tresh), (1-progress)+0.2);
            }
            // line end
            positions[3] += velocity[3];
            positions[4] += velocity[4];
            positions[5] += velocity[5];

            if (progress > 1) {
                console.log(num, timer);
                resetStar(star, timer, radius);
            }

        }

        let starFall1 = generateStar(starFallradius);
        let star1 = starFall1[0];
        let timer1 = starFall1[1];
        scene.add(star1);

        // let starFall2 = generateStar(starFallradius);
        // let star2 = starFall2[0];
        // let timer2 = starFall2[1];
        // scene.add(star2);
        

        // FLOOR

        let floorGeom = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
        let floorMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        let floor = new THREE.Mesh(floorGeom, floorMat);
        floor.rotateX( - Math.PI / 2);
        floor.position.set(0, -10, 0);

        scene.add(floor);

        // audio visualizer setup

        function updateSpectrum(world) {
            let spectrumLeft = new Uint8Array(bufferLength);
            let spectrumRight = new Uint8Array(bufferLength);
            let spectrum = new Uint8Array(bufferLength*2);

            analyserLeft.getByteFrequencyData(spectrumLeft);
            analyserRight.getByteFrequencyData(spectrumRight);

            spectrum.set(spectrumRight.reverse());
            spectrum.set(spectrumLeft, spectrumRight.length);

            updateWorld(
                world,
                color,
                worldWidth,
                worldDepth,
                spectrum
            );
        }

        // animate

        mount.current.appendChild(renderer.domElement);
        window.addEventListener('resize', handleResize);

        var time = new THREE.Clock();

        function animate() {
            audioCtx.resume();
            camera.lookAt(target);

            updateSpectrum(world);
            updateStar(star1, timer1, starFallradius);
            // updateStar(star2, timer2, starFallradius);

            starField.rotation.x = starField.rotation.x - mouseY*0.0005;
            starField.rotation.y = starField.rotation.y + mouseX*0.0005;
            starField.rotation.z = starField.rotation.z + (mouseX)*0.0005;
            
            world.geometry.attributes.position.needsUpdate = true;
            world.geometry.attributes.color.needsUpdate = true;
            starField.geometry.attributes.position.needsUpdate = true;

            star1.geometry.attributes.position.needsUpdate = true;
            star1.geometry.attributes.velocity.needsUpdate = true;
            star1.material.color.needsUpdate = true;

            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }, []);

    return <World ref={mount} />;
};

export default Background;
