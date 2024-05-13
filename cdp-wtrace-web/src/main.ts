import './styles/style.css'
import { Scene } from "wtrace"
import * as THREE from "three"
import { io } from 'socket.io-client'

import WtraceApplication from "./wtrace-application"

const WTRACE_CDP_WEB_SERVER_ADDRESS = "http://localhost:3000";
const WTRACE_CANVAS_ELEMENT_ID = "wt_canvas-webgpu"

function main() {
    // connect to the Wtrace CDP Web Server
    const socket = io(WTRACE_CDP_WEB_SERVER_ADDRESS);
    socket.on('message', (data) => {
        updateScene(data);
    });

    // run wtrace app 
    WtraceApplication.get().run(WTRACE_CANVAS_ELEMENT_ID);
}

function updateScene(data) {

}

main();