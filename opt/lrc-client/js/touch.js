var activeTouch, socket;

function startup() {
    var el = $('#canvas')[0];
    el.addEventListener('touchstart', handleTouchstart, false);
    el.addEventListener('touchend', handleTouchend, false);
    el.addEventListener('touchmove', handleTouchmove, false);
    activeTouch = null;
    socket = null;
}

function handleTouchstart(evt) {
    //check if socket is connected
    if (socket === null || socket.readyState != WebSocket.OPEN) {
        socket = new WebSocket('ws://' + host + ':' + websocketPort);
    }
    if (activeTouch === null) {
        evt.preventDefault();
        activeTouch = evt.changedTouches[0];
    }
}

function handleTouchend(evt) {
    if (evt.changedTouches[0].identifier == activeTouch.identifier) {
        activeTouch = null;
    }
}

function handleTouchmove(evt) {
    if (evt.changedTouches[0].identifier == activeTouch.identifier) {
        var deltaX = parseInt((evt.changedTouches[0].clientX - activeTouch.clientX) * 3);
        var deltaY = parseInt((evt.changedTouches[0].clientY - activeTouch.clientY) * 3);
        activeTouch = evt.changedTouches[0];
        socket.send(deltaX + ';' + deltaY);
    }
}
