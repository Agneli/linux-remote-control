function Connection() {}

// Send a request to the server
Connection.prototype.send = function(fct, arguments, callback) {};

Connection.factory = function(server) {
    var types = {
        HTTP: Connection_HTTP,
        WebSocket: Connection_WebSocket
    };
    return new types[server.type](server);
};
