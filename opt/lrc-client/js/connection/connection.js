function Connection() {}

// Send a request to the server
Connection.prototype.send = function(fct, arguments, callback) {};

// Query to get the server status
Connection.server_status = function(server, onsuccess, onfail) {
    $.get('http://' + server.host + ':' + server.port + '/').always(function(response) {
        if(response.statusText == 'OK') {
            onsuccess(server, response);
        } else {
            onfail(server, response);
        }
    });
};
