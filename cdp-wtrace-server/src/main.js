// constants
const cdp_server_address = 'localhost:9009';
const cdp_web_server_port = 3000;

var cdp_client = require("./cdp_client/cdp_client");
var wtrace_cdp_web_server = require("./cdp-wtrace-web-server/cdp-wtrace-web-server");

var mock = require("./mock")

// cdp callback (GetSceneDataStream)
function cdp_getSceneDataStreamCallback(response) {
    sendExampleData();
}

// cdp mock callback
function cdp_mockCallback() {
    setInterval(() => sendExampleData(), 5000);
}

// data sending example
function sendExampleData() {
    // try to get the wtrace cdp web socket
    const socket = wtrace_cdp_web_server.clientSocket();
    // return if the wtrace cdp web is not connected
    if (!socket) {
        return
    };

    socket.emit("message", mock.getMockData());
    console.log("Sent data to user.")
}

function main() {
    // run wtrace cdp web server
    wtrace_cdp_web_server.run(cdp_web_server_port);

    cdp_mockCallback();

    // connect to the cdp server
    // cdp_client.connect(cdp_server_address, cdp_getSceneDataStreamCallback);
}

main();