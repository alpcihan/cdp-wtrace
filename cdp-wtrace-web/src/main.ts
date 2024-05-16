/*
import './styles/style.css'
import { io } from 'socket.io-client'
import WtraceApplication from "./wtrace-application"
import { PreloadedModelInfo } from './types';

// constants
const CDP_WTRACE_WEB_SERVER_ADDRESS = "http://localhost:3000";
const WTRACE_CANVAS_ELEMENT_ID = "wt_canvas-webgpu";
const PRELOADED_MODELS: PreloadedModelInfo[] = [
    {
        path: "xyz_dragon.obj",
        material: {
            baseMapName: "body_base.jpg",
            metallicRoughnessMapName: "body_metallic_roughness.jpg"
        }
    },
    {
        path: "body.obj",
        material: {
            baseMapName: "body_base.jpg",
            metallicRoughnessMapName: "body_metallic_roughness.jpg"
        }
    },
    {
        path: "head.obj",
        material: {
            baseMapName: "head_base.jpg",
            metallicRoughnessMapName: "head_metallic_roughness.jpg"
        }
    }
];

async function main() {
    // pre load the meshes that are going to be used
    // TODO: send preload data from the cdp-wtrace-server
    await WtraceApplication.get().preLoadModels(PRELOADED_MODELS);

    // connect to the Wtrace CDP Web Server and listen scene updates
    const socket = io(CDP_WTRACE_WEB_SERVER_ADDRESS);
    socket.on('message', (data) => WtraceApplication.get().processNewSceneMessage(data));

    // run wtrace app 
    WtraceApplication.get().run(WTRACE_CANVAS_ELEMENT_ID);
}

main();
*/

import "../style.css";
import * as wt from "wtrace";
import * as test from "./test-scenes";
import * as THREE from "three";

// camera controller
let cameraController: wt.CameraController;

async function init() {
    // get the target canvas
    const canvas: HTMLCanvasElement = document.getElementById("wt_canvas-webgpu") as HTMLCanvasElement;

    // init the wtrace application
    await wt.Application.init(canvas);

    let scene = await test.createMeetManScene();

    // create camera and camera controller
    scene.camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
    cameraController = new wt.CameraController({ camera: scene.camera });

    // load the scene
    wt.SceneManager.loadScene(scene);

    // application loop
    animate();
} 

function animate() {
    // get the next frame
    requestAnimationFrame(animate);

    // call the camera controller's update function and set the refresh flag if a change occurs
    if (cameraController.update(wt.Application.deltaTime)) {
        wt.Application.refresh();
    }

    // render the scene
    wt.Application.onNextFrame();
}

init();