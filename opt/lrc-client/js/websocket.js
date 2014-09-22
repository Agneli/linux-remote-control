function setup_websocket() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://' + navigator.host + ':' + websocketPort);

    connection.onopen = function () {
        console.log('WebSocket connection opened');
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
        console.error('WebSocket error : ' + error);
    };

    connection.onmessage = function (message) {
        console.log(message.data);
    };
}
