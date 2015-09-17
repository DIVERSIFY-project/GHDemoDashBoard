# GHDemoDashBoard

## Launching the client side in a web browser

1. To run the Dashboard, you need to launch the index.html file in your favourite browser (chrome recommended if you want to save the dashboard).
2. Hit load FreeBoard and choose the file board.json located in the SavedBoard folder.
3. You're done but you need the server to send some events to this Dashboard

## Launching the server side in node.js
1. You need to install node.js on your machine
2. Install socket.io ''' npm install socket.io'''
3. Install ws ''' npm install ws'''
4. launch the file located in the nodeServer folder ''' node plugin_node_sample_server.js'''
5. You're done.
6. Currently the server is connecting to a web socket to rerieve data and then send it to the dashboard. For test purpose you may want to directly generate random data on the server. Go on the plugin_node_sample_server.js file and modify the function called connetToExternalSources by commenting the first part of the function and uncommenting the second part ;)
