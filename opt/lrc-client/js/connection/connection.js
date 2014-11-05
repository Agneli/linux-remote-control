function Connection() {}

// Functions to implement with each driver
Connection.prototype.send = function(fct, arguments, callback) { throw new Error("Not implemented yet"); };
Connection.prototype.delete = function() { throw new Error("Not implemented yet"); };

/**
 * Returns a new Connection_Driver based on the type of
 * the server passed in parameter
 */
Connection.factory = function(server) {
    var types = {
        HTTP: Connection_HTTP,
        WebSocket: Connection_WebSocket
    };
    return new types[server.type](server);
};
