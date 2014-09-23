/**
 * Driver to connect to a server via HTTP requests
 * (slower and more memory-consuming than WebSocket)
 */
function Connection_HTTP(host, port, refresh_rate) {
    Connection.apply(this);

    port = port || 3000;
    refresh_rate = refresh_rate || 1000;

    this.url = "http://" + host + ":" + port + '/';

    var that = this;
    setInterval(function() {
        that.refresh();
    }, refresh_rate);
}

// Extends Connection
Connection_HTTP.prototype = new Connection();

/**
 * Sends a command to the server via HTTP GET
 */
Connection_HTTP.prototype.send = function(fct, arguments, callback) {
    $.get(this.url + fct, arguments).done(callback);
};

/**
 * Called every `refresh_rate` miliseconds to fetch useful data from the server,
 * including volume, backlight and music infos.
 */
Connection_HTTP.prototype.refresh = function() {
    var requests = ['info', 'music?info'];
    for(var index in requests) {
        $.ajax({
            url: this.url + requests[index],
            dataType: "jsonp",
            cache: false,
            jsonpCallback: 'Connection_HTTP.jsonp_return_value'
        });
    }
};

/**
 * Callback for jsonp calls triggered by Connection_HTTP.prototype.refresh.
 * It refreshes every HTML tag that has a [data-watch] that is a key in data.
 */
Connection_HTTP.jsonp_return_value = function(data) {
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
