// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ freeboard.io-node.js                                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2014 Hugo Sequeira (https://github.com/hugocore)       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Simple node.js and sockets.io server to test the node.js plugin.   │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

/*
 * Configurations and helpers
 */
var namespace = '/shows';
var room = 'got';
var refreshTimer = 1000; 
var connectionscounter = 0;
var eventNames = ['diversify.bipartite.dead', 'diversify.bipartite.retry', 'diversify.bipartite.service', 'diversify.bipartite.pausedplatforms', 'diversify.bipartite.initialclients', 'diversify.bipartite.initialplatforms', 'diversify.bipartite.initialservices', 'diversify.bipartite.monkey'];
var serverport = 8181;

/*
 * Project dependencies
 */
var io = require('socket.io')(serverport);
var WebSocket = require('ws');

/*
 * Collects data
 */

// Implement the methods to handle the new events
function newEventCallback(eventName, message) {

	// Construct the json object to be propagated
	var json = {
		value: message.value,
		time_stamp: message.time_stamp,
	};
	
	// Invokes propagation
	propagatesEvent(eventName, JSON.stringify(json));
}

// Connection to external data sources
function connectToExternalSources() {
  	ws = new WebSocket('ws://localhost:8099');
	ws.on('open', function() {
    		ws.send('dashboard_node_server');
	});
	ws.on('message', function(message) {
		console.log('received: %s', message);
    	if(message.indexOf("dead") > -1) {
			var jsonMsg = JSON.parse(message);
			var msgDead = {
					value: jsonMsg.dead * 100,
					time_stamp: jsonMsg.tick//new Date().getTime()
				};
			newEventCallback(eventNames[0], msgDead);
			var msgRetry = {
					value: jsonMsg.retry,
					time_stamp: jsonMsg.tick//new Date().getTime()
				};
			newEventCallback(eventNames[1], msgRetry);
			var msgService = {
					value: jsonMsg.service,
					time_stamp: jsonMsg.tick//new Date().getTime()
				};
			newEventCallback(eventNames[2], msgService);
			var msgPausedPlatforms = {
					value: jsonMsg.pausedplatforms,
					time_stamp: jsonMsg.tick
				};
			newEventCallback(eventNames[3], msgPausedPlatforms);
			var msgInitialClients = {
					value: jsonMsg.initialclients,
					time_stamp: jsonMsg.tick
				};
			newEventCallback(eventNames[4], msgInitialClients);
			var msgInitialPlatforms = {
					value: jsonMsg.initialplatforms,
					time_stamp: jsonMsg.tick
				};
			newEventCallback(eventNames[5], msgInitialPlatforms);
			var msgInitialServices = {
					value: jsonMsg.initialservices,
					time_stamp: jsonMsg.tick
				};
			newEventCallback(eventNames[6], msgInitialServices);
			var msgMonkey = {
					value: jsonMsg.monkey,
					time_stamp: jsonMsg.tick
				};
			newEventCallback(eventNames[7], msgMonkey);
		}
	});


//	 Simulate the connection and new messages with a timer function
	/*setInterval(function() {
		for (var i=0; i<eventNames.length; i++) {
			
			// construct message
			var oneHourInMilis = 3600000;
			var message = {
				value: Math.floor(Math.random()*101),
				time_stamp: new Date().getTime()
			};
			
			
			newEventCallback(eventNames[i], message);
			
		}
	}, refreshTimer);*/
	
}

/*
 * Data propagation
 */

// Propagates event through all the connected clients
function propagatesEvent(eventName, event) {
	if (connectionscounter>0) {
		io.of(namespace).to(room).emit(eventName, event);
		console.log("New event propagated in: Namespace='%s' Room='%s' EventName='%s' Event='%s'", namespace, room, eventName, event);
	}
}

/*
 * Handle Sockets.io connections
 */

// Event handlers
io.of(namespace).on('connection', function(socket) {
	
	console.log("New client connected.");
	
	// Do some logic for every new connection
	connectionscounter++;
	
	// On subscribe events join client to room
    socket.on('subscribe', function(room) {
    	socket.join(room);
    	console.log("Client joined room: " + room);
    });
        
    // On disconnect events
    socket.on('disconnect', function(socket) {
    	console.log("Client disconnect from rooms.");
    	connectionscounter--;
    });
    
});

function puts(message) {
	console.log(message);
}

/*
 *  Run
 */
console.log("Starting Node.js server with namespace='%s' and room='%s'", namespace, room);


connectToExternalSources();
