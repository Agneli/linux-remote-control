var CLICK_PREFIX = 'c';
var MOUSEUP_PREFIX = 'u';
var MOUSEDOWN_PREFIX = 'd';
var MOVE_PREFIX = 'm';
var SCROLL_PREFIX = 's';

var activeTouch, touchCount, scrolling, socket, startTime, touchHoldTime, touchHold;

function startup() {
    var el = $('#Touchpad-canvas')[0];
    el.addEventListener('touchstart', handleTouchstart, false);
    el.addEventListener('touchend', handleTouchend, false);
    el.addEventListener('touchmove', handleTouchmove, false);
    var al = $('#Slideshow-canvas')[0];
    al.addEventListener('touchstart', handleTouchstart, false);
    al.addEventListener('touchend', handleTouchend, false);
    al.addEventListener('touchmove', handleTouchmove, false);
    activeTouch = null;
    touchHoldTime = 0;
    touchHold = false;
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
        startTime = +new Date();
    }
    touchCount += evt.changedTouches.length;
    scrolling = touchCount > 1;
    console.log((startTime - touchHoldTime) +"<"+ 400)
    if(startTime - touchHoldTime < 400) {
        socket.send(MOUSEDOWN_PREFIX + 1);
        console.log(MOUSEDOWN_PREFIX + 1);
        touchHoldTime = 0;
        touchHold = true;
        console.log("touchHold", touchHold)
    }
}

function handleTouchend(evt) {
    touchCount -= evt.changedTouches.length;
    var time = (+new Date()) - startTime;
    if(time < 100) {
        socket.send(CLICK_PREFIX + 1);
        touchHoldTime = +new Date();
    }
    if(touchHold) {
        touchHold = false;
        socket.send(MOUSEUP_PREFIX + 1);
        console.log(MOUSEUP_PREFIX + 1);
    }
    
    scrolling = touchCount != 0;
}

function handleTouchmove(evt) {
    var deltaX, deltaY;
    var time = (+new Date()) - startTime;
    if (!scrolling) {
        var deltaX = (evt.changedTouches[0].clientX - activeTouch.clientX) / time * 300;
        var deltaY = (evt.changedTouches[0].clientY - activeTouch.clientY) / time * 300;
        if(Math.abs(deltaX) < 1 || Math.abs(deltaY) < 1) {
            deltaX = evt.changedTouches[0].clientX - activeTouch.clientX;
            deltaY = evt.changedTouches[0].clientY - activeTouch.clientY;
        }
        
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
