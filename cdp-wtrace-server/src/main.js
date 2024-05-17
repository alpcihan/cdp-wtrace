// see cdp-wtrace-web/src/types.ts for the data formats

// imports
var cdp_client = require("./cdp_client/cdp_client");
var cdp_wtrace_web_server = require("./cdp-wtrace-web-server/cdp-wtrace-web-server");
var mock = require("./mock")

// constants
const cdp_server_address = 'localhost:9009';
const cdp_web_server_port = 3000;


// cdp callback (GetSceneDataStream)
function cdp_getSceneDataStreamCallback(response) {
    sendExampleData();
}

// cdp mock callback
function cdp_mockCallback() {
    setInterval(() => sendExampleData(), 10000); // send every 10 seconds
}

// data sending example
function sendExampleData() {
    // try to get the cdp-wtrace-web socket
    const socket = cdp_wtrace_web_server.clientSocket();
    // return if the cdp-wtrace-web is not connected yet
    if (!socket) {
        return
    };

    socket.emit("message", mock.data);
    console.log("Sent data to user.")
}

function main() {
    // run wtrace cdp-wtrace-server
    cdp_wtrace_web_server.run(cdp_web_server_port);

    // send mock test data
    cdp_mockCallback();

    // connect to the cdp server
    // cdp_client.connect(cdp_server_address, cdp_getSceneDataStreamCallback);
}

main();