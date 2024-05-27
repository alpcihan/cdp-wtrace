var PROTO_PATH = __dirname + '/cdp-api.proto';

// imports
var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

// create cdp.api client
var cdp_proto = grpc.loadPackageDefinition(
  protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
  )
).CDP.API;

function connect(address, getSceneDataStreamCallback) {
  // connect to CDP server
  var client = new cdp_proto.CdpService(address, grpc.credentials.createInsecure());

  // send an example GetSceneDataStream request
  client.GetSceneDataStream({}, function (err, response) {
    getSceneDataStreamCallback(response);
  });
}

module.exports = {
  connect
}