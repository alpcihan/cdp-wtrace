import "../style.css";

import * as THREE from "three";
import * as wt from "wtrace";
import { io } from 'socket.io-client'
import { SceneData } from './types';
import {
    createDefaultScene,
    loadLatestRequestedScene,
    loadNewSceneFlag,
    processCDPMessage_NewScene,
} from './utils';

// constants
const cdp_web_server_address: string = "http://localhost:3000";

// camera
let cameraController: wt.CameraController;
let camera: THREE.Camera;

async function main() {
    // init wtrace application
    {
        // get the target canvas
        const canvas: HTMLCanvasElement = document.getElementById("wt_canvas-webgpu") as HTMLCanvasElement;

        await wt.Application.init(canvas);

        // create camera and camera controller
        camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
        cameraController = new wt.CameraController({ camera: camera });

        // load default scene (currently, wtrace crashes if there is no scene)
        let defaultScene: wt.Scene = await createDefaultScene("assets/models/cube.obj", camera);

        // load the scene
        wt.SceneManager.loadScene(defaultScene);
    }

    // init cdp wtrace server connection
    {
        // connect to the wtrace cdp web server and listen scene updates
        const socket = io(cdp_web_server_address);
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

    // load new scene when received from cdp-wtrace-server
    if (loadNewSceneFlag) {
        await loadLatestRequestedScene(camera);
    }

    // render the scene
    wt.Application.onNextFrame();

    // get the next frame
    requestAnimationFrame(animate);
}

main();