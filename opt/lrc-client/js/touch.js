function startup() {
    var el = $("#canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchleave", handleEnd, false);
    el.addEventListener("touchmove", handleMove, false);
    //log("initialized.");
}

var ongoingTouches = new Array;

//New Touch
function handleStart(evt) {
    evt.preventDefault();
    var el = $("#canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        //log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        var color = colorForTouch(touches[i]);
        ctx.beginPath();
        ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function handleMove(evt) {
    evt.preventDefault();
    var el = $("#canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            //log("continuing touch " + idx);
            ctx.beginPath();
            //log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            //log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
            $.get('http://' + host + ':' + port + '/lrc', {cmd: "export DISPLAY=:0; xdotool mousemove ", xy: "" + touches[i].pageX + " " + touches[i].pageY + "", wh: "" + $("#canvas").width() + " " + $("#canvas").height() + ""});
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            //log(".");
        } else {
            //log("can't figure out which touch to continue");
        }
    }
}

function handleEnd(evt) {
    evt.preventDefault();
    //log("touchend/touchleave.");
    var el = $("#canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
            ongoingTouches.splice(i, 1);  // remove it; we're done
        } else {
            //log("can't figure out which touch to end");
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    //log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.splice(i, 1);  // remove it; we're done
    }
}

function colorForTouch() {
    var color = "rgba(0,0,0, 0)";
    return color;
}

function copyTouch(touch) {
    return {identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY};
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1;    // not found
}

//function //log(msg) {
//    var p = document.getElementById('//log');
//    p.innerHTML = msg + "\n" + p.innerHTML;
//}

function onTouch(evt) {
    evt.preventDefault();
    if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
        return;

    var newEvt = document.createEvent("MouseEvents");
    var type = null;
    var touch = null;
    switch (evt.type) {
        case "touchstart":
            type = "mousedown";
            touch = evt.changedTouches[0];
            break;
        case "touchmove":
            type = "mousemove";
            touch = evt.changedTouches[0];
            break;
        case "touchend":
            type = "mouseup";
            touch = evt.changedTouches[0];
            break;
    }
    newEvt.initMouseEvent(type, true, true, evt.originalTarget.ownerDocument.defaultView, 0,
            touch.screenX, touch.screenY, touch.clientX, touch.clientY,
            evt.ctrlKey, evt.altKey, evt.shirtKey, evt.metaKey, 0, null);
    evt.originalTarget.dispatchEvent(newEvt);
}
