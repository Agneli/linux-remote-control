/**
 * Driver to connect to a server via a WebSocket
 */
function Connection_WebSocket(server) {
    Connection.apply(this);

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    this.websocket = new WebSocket("ws://" + server.host + ":" + server.port + '/');

    // Log about the WebSocket connection
    this.websocket.onopen = function () { console.log('WebSocket connection opened'); };
    this.websocket.onclose = function () {
        console.log('WebSocket connection closed');
        if(confirm('Connection to the server lost ! Reload app ?')) {
            window.location.reload();
        }
    };
    this.websocket.onerror = function (error) { console.error('WebSocket error : ' + error); };

    var that = this;
    this.websocket.onmessage = function (message) {
        that.refresh(message.data);
    };
}

// Extends Connection
Connection_WebSocket.prototype = new Connection();

Connection_WebSocket.prototype.delete = function() {
    this.websocket.onclose = null;
    this.websocket.close();
};

/**
 * Sends a command to the server via HTTP GET
 */
Connection_WebSocket.prototype.send = function(fct, arguments, callback) {
    this.websocket.send(fct + '/' + JSON.stringify(arguments));
    // TODO : Deal with the callback
};

/**
 * Callback used to refresh the view when a WebSocket message is received
 */
Connection_WebSocket.prototype.refresh = function(data) {
    if(!data) {
        return;
    }

    try {
        data = $.parseJSON(data);
    } catch(json_error) {
        // Ignore parse errors
        console.error(json_error);
        return
    }
    for(object in data) {
        if(data[object] instanceof Object) {
            for(key in data[object]) {
                var watch_selector = '[data-watch="' + object + '.' + key + '"]';
                $(watch_selector + ':not(.slider ' + watch_selector + ')').html(unescape(data[object][key]));
                // FIXME : Attributting a value to a slider may trigger events
                // leading to infinite loops (such as music.elapsed-percent, that
                // updates the server, that updates the app, that updates the server...
                //$('.slider ' + watch_selector).slider("value", unescape(data[object][key]));
            }
        } else {
            var watch_selector = '[data-watch="' + object + '"]';
            $(watch_selector + ':not(.slider ' + watch_selector + ')').html(unescape(data[object]));
            // FIXME : see previous fixme
            //$('.slider ' + watch_selector).slider("value", unescape(data[object]));
        }
    }
};
