const http = require('http');
const { Server } = require('socket.io');

let _clientSocket = null;

function clientSocket() {
    return _clientSocket;
}

function run(port) {
    const server = http.createServer();
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Wtrace CDP Web Server: A user connected');

        _clientSocket = socket;
    });

    server.listen(port, () => {
        console.log(`'Wtrace CDP Web Server listening on port ${port}`);
    });
} 

module.exports = {
    run,
    clientSocket
}