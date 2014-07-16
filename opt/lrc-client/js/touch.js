var CLICK_PREFIX = 'c';
var MOVE_PREFIX = 'm';
var SCROLL_PREFIX = 's';

var activeTouch, touchCount, scrolling, socket;

function startup() {
    var el = $('#canvas')[0];
    el.addEventListener('touchstart', handleTouchstart, false);
    el.addEventListener('touchend', handleTouchend, false);
    el.addEventListener('touchmove', handleTouchmove, false);
    activeTouch = null;
    touchCount = 0;
    scrolling = false;
    socket = null;
}

function handleTouchstart(evt) {
    //check if socket is connected
    if (socket === null || socket.readyState != WebSocket.OPEN) {
        socket = new WebSocket('ws://' + navigator.host + ':' + websocketPort);
    }
    evt.preventDefault();
    if (touchCount == 0) {
        activeTouch = evt.changedTouches[0];
    }
    touchCount += evt.changedTouches.length;
    scrolling = touchCount > 1;
}

function handleTouchend(evt) {
    touchCount -= evt.changedTouches.length;
    scrolling = touchCount != 0;
}

function handleTouchmove(evt) {
    var deltaX, deltaY;
    if (!scrolling) {
        deltaX = evt.changedTouches[0].clientX - activeTouch.clientX;
        deltaY = evt.changedTouches[0].clientY - activeTouch.clientY;
        activeTouch = evt.changedTouches[0];
        socket.send(MOVE_PREFIX + deltaX + ';' + deltaY);
    } else if (touchCount == 2) {
        deltaY = evt.changedTouches.identifiedTouch(activeTouch.identifier).clientY - activeTouch.clientY;
        if (deltaY != 0) {
            activeTouch = evt.changedTouches.identifiedTouch(activeTouch.identifier);
            socket.send(SCROLL_PREFIX + deltaY);
        }
    }
}