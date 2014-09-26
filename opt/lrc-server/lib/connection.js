exports.drivers = {};

// HTTP driver
exports.drivers.HTTP = function(servers, actions, config) {
    var app = servers.HTTP;
    app.all(/\/(.+)/, function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        if(req.params[0] in actions) {
            actions[req.params[0]](req.query, function(result) {
                res.send(result);
            });
        } else {
            console.log("Invalid command : " + req.params[0]);
            res.send(null);
        }
    });

    app.listen(config.port, function () {
        console.log('Listening for HTTP requests on port ' + config.port);
    });
};

// WebSocket driver
exports.drivers.WebSocket = function(servers, actions, config) {
    var WebSocketServer = servers.WebSocket;

    var wss = new WebSocketServer({port: config.port});
    wss.on('connection', function(ws) {
        /**
         * Messages sent to the websocket server look like :
         * action/json_arguments, ex.:
         *
         *      'info/{"argument1": 123, "argument2": "asc2", ...}'
         *
         */
        ws.on('message', function(message) {
            var action = message.substr(0, message.indexOf('/'));

            try {
                var parameters = action && action.length + 1 != message.length ? JSON.parse(message.substr(message.indexOf('/') + 1)) : {};
            } catch (json_error) {
                console.log('Bad JSON request : ' + message);
                return;
            }

            if(action in actions) {
                actions[action](parameters, function(result) {
                    if(result) {
                        wss.broadcast(result);
                    }
                });
            } else {
                wss.broadcast("Error !");
            }
        });

        // Broadcast informations to the clients
        setInterval(function() {
            var infos = ['info', 'music_info'];
            for(var info in infos) {
                actions[infos[info]](null, function(result) {
                    wss.broadcast(JSON.stringify(result));
                });
            }
        }, 3000);
    });

    wss.broadcast = function(data) {
        for(var i in this.clients) {
            this.clients[i].send(data);
        }
    };

    console.log('Listening for WebSocket requests on port ' + config.port);
};

// Bluetooth driver ~ Requires a certified app
exports.drivers.Bluetooth = function(servers, actions, config) {
    throw new Error('Not implemented yet');
};
