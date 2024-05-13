// constants
const cdp_server_address = 'localhost:9009';
const cdp_web_server_port = 3000;

var cdp_client = require("./cdp_client/cdp_client");
var wtrace_cdp_web_server = require("./wtrace-cdp-web-server/wtrace-cdp-web-server");

// cdp callbacks
function cdp_getSceneDataStreamCallback(response) {
    // try to get the wtrace cdp web socket
    const socket = wtrace_cdp_web_server.clientSocket();
    // return if the wtrace cdp web is not connected
    if (!socket) {
        return
    };

    // prepare data
    let customData = {
        position: { x: 0, y: 1, z: 0 },
    };

    // send the data to wtrace cdp web
    socket.emit("message", customData);
}

function main() {
    // run wtrace cdp web server
    wtrace_cdp_web_server.run(cdp_web_server_port);

    setInterval(() => {
        // try to get the wtrace cdp web socket
        const socket = wtrace_cdp_web_server.clientSocket();
        // return if the wtrace cdp web is not connected
        if (!socket) {
            return
        };

        let customData = {
            position: { x: 0, y: 1, z: 0 },
        };

        socket.emit("message", customData);
    }, 10000);

    // connect to the cdp server
    // cdp_client.connect(cdp_server_address, cdp_getSceneDataStreamCallback);
}

main();