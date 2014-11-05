/**
 * Driver to connect to a server via HTTP requests
 * (slower and more memory-consuming than WebSocket)
 */
function Connection_HTTP(server) {
    Connection.apply(this);

    refresh_rate = server.refresh_rate || 1000;

    this.url = "http://" + server.host + ":" + server.port + '/';

    var that = this;
    this.refresh_interval = setInterval(function() {
        that.refresh();
    }, refresh_rate);
}

// Extends Connection
Connection_HTTP.prototype = new Connection();

/**
 * Sends a command to the server via HTTP GET
 */
Connection_HTTP.prototype.send = function(fct, arguments, callback) {
    callback = callback || function() {};
    arguments = arguments || {};

    $.get(this.url + fct, arguments).done(callback);
};

Connection_HTTP.prototype.delete = function() {
    clearInterval(this.refresh_interval);
};

/**
 * Called every `refresh_rate` miliseconds to fetch useful data from the server,
 * including volume, backlight and music infos.
 */
Connection_HTTP.prototype.refresh = function() {
    var requests = ['info', 'music_info'];
    for(var index in requests) {
        // Callback function refreshes every HTML tag that
        // has a [data-watch] that is a key in data.
        $.get(this.url + requests[index]).done(function(data) {
            for(object in data) {
                if(data[object] instanceof Object) {
                    for(key in data[object]) {
                        var watch_selector = '[data-watch="' + object + '.' + key + '"]';
                        $(watch_selector + ':not(.slider ' + watch_selector + ')').html(unescape(data[object][key]));
                        $('.slider ' + watch_selector).slider("value", unescape(data[object][key]));
                    }
                } else {
                    var watch_selector = '[data-watch="' + object + '"]';
                    $(watch_selector + ':not(.slider ' + watch_selector + ')').html(unescape(data[object]));
                    $('.slider ' + watch_selector).slider("value", unescape(data[object]));
                }
            }
        });
    }
};
