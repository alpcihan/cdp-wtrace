import "../style.css";

import * as THREE from "three";
import * as wt from "wtrace";
import { io } from 'socket.io-client'
import { SceneData } from './types';
import {
    createDefaultCubeScene,
    loadLatestRequestedScene,
    loadNewSceneFlag,
    processCDPMessage_NewScene,
} from './utils';
import { CDP_TEST_SCENE_DATA } from "./test-data";

// camera
let cameraController: wt.CameraController;
let camera: THREE.Camera;

async function main() {
    // init wtrace application
    {
        // get the target canvas
        const canvas: HTMLCanvasElement = document.getElementById("wt_canvas-webgpu") as HTMLCanvasElement;

        await wt.Application.init(canvas);

        // load default scene (currently, wtrace crashes if there is no scene)
        let defaultScene: wt.Scene = await createDefaultCubeScene();

        // create camera and camera controller
        camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
        cameraController = new wt.CameraController({ camera: camera });
        defaultScene.camera = camera;

        // load the scene
        wt.SceneManager.loadScene(defaultScene);
    }

    // init cdp wtrace server connection
    {
        // connect to the wtrace cdp web server and listen scene updates
        const socket = io("http://localhost:3000");
        socket.on('message', (message: SceneData) => processCDPMessage_NewScene(message));
    }

    // application loop
    animate();
}

async function animate() {
    // call the camera controller's update function and set the refresh flag if a change occurs
    if (cameraController.update(wt.Application.deltaTime)) {
        wt.Application.refresh();
    }

    if (loadNewSceneFlag) {
        await loadLatestRequestedScene(camera);
    }

    // render the scene
    wt.Application.onNextFrame();

    // get the next frame
    requestAnimationFrame(animate);
}

main();