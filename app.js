
var gameport = process.env.PORT || 4004,
  io = require('socket.io'),
  express = require('express'),
  http = require('http'),
  UUID = require('node-uuid'),
  verbose = false,
  expressApp = express(),
  app = http.createServer(expressApp);

// express

app.listen(gameport);

console.log('\t :: Express :: Ecoute du port '+gameport);

expressApp.get('/', function(req, res) {
  
  res.sendfile(__dirname + '/index.html');
  
});

expressApp.get('/*', function(req, res, next) {
  
  var file = req.params[0];
  
  if(verbose) console.log('\t :: Express :: fichier demande : ' + file);
  
  res.sendfile(__dirname + '/' + file);
  
});



// socket.io

var sio = io.listen(app);

// configuration
sio.configure(function() {
  
  sio.set('log level', 0);
  
  sio.set('authorization', function (handshakeData, callback) {
    callback(null, true); // error first callback style 
  });
  
});

// client connect
sio.sockets.on('connection', function (client) {
    
    //Generate a new UUID, looks something like 
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
    client.userid = UUID();

    //tell the player they connected, giving them their id
    client.emit('onconnected', { id: client.userid } );

    //Useful to know when someone connects
    console.log('\t :: socket.io :: player ' + client.userid + ' connected');

    //When this client disconnects
    client.on('disconnect', function () {

        //Useful to know when someone disconnects
        console.log('\t :: socket.io :: client disconnected ' + client.userid );
        
    }); //client.on disconnect
    
}); //sio.sockets.on connection
