var CLICK_PREFIX = 'c';
var MOUSEUP_PREFIX = 'u';
var MOUSEDOWN_PREFIX = 'd';
var MOVE_PREFIX = 'm';
var SCROLL_PREFIX = 's';
// Tableau de combinaison
var buttonStatus = {};

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

    // Keyboard combined
    $(function(){
        //----------------SIMULATION MULTITOUCH----------------
        // En fonction de la touche courante verifier les combinaisons possibles associées
        
        //  TOUCHE 'CTRL'
        $(".combined-keyboard #ctrl").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
                buttonStatus.alt = false;
                $(".combined-keyboard #alt").html("Alt");

            if(buttonStatus.v == true){
                $("#keypressed").html("You are pressing : v + ctrl");
                command = "xdotool keydown ctrl key v";// ou xdotool key ctrl+v
            }else if(buttonStatus.c == true){
                $("#keypressed").html("You are pressing : c + ctrl");
                command = "xdotool keydown ctrl key c";
            }else if(buttonStatus.a == true){
                $("#keypressed").html("You are pressing : a + ctrl");
                command = "xdotool keydown ctrl key a";
            }else if(buttonStatus.x == true){
                $("#keypressed").html("You are pressing : x + ctrl");
                command = "xdotool keydown ctrl key x";
            }else if(buttonStatus.i == true){
                $("#keypressed").html("You are pressing : i + ctrl");
                command = "xdotool keydown ctrl key i";
            }else if(buttonStatus.u == true){
                $("#keypressed").html("You are pressing : u + ctrl");
                command = "xdotool keydown ctrl key u";
            }else if(buttonStatus.b == true){
                $("#keypressed").html("You are pressing : b + ctrl");
                command = "xdotool keydown ctrl key b";
            }else{
                $("#keypressed").html("You are pressing : ctrl"); 
            }
            buttonStatus.ctrl = true;
            $(".combined-keyboard #ctrl").html( $(".combined-keyboard #ctrl").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #ctrl").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.ctrl = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #ctrl").html("Ctrl");
            //$("#keypressed").html("");
        });

        //  TOUCHE 'ALT'
        $(".combined-keyboard #alt").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.ctrl = false;
            $(".combined-keyboard #ctrl").html("Ctrl");

            if(buttonStatus.v == true){
                $("#keypressed").html("You are pressing : v + alt");
                command = "xdotool keydown alt key v";
            }else if(buttonStatus.c == true){
                $("#keypressed").html("You are pressing : c + alt");
                command = "xdotool keydown alt key c";
            }else if(buttonStatus.a == true){
                $("#keypressed").html("You are pressing : a + alt");
                command = "xdotool keydown alt key a";
            }else if(buttonStatus.x == true){
                $("#keypressed").html("You are pressing : x + alt");
                command = "xdotool keydown alt key x";
            }else if(buttonStatus.i == true){
                $("#keypressed").html("You are pressing : i + alt");
                command = "xdotool keydown alt key i";
            }else if(buttonStatus.u == true){
                $("#keypressed").html("You are pressing : u + alt");
                command = "xdotool keydown alt key u";
            }else if(buttonStatus.b == true){
                $("#keypressed").html("You are pressing : b + alt");
                command = "xdotool keydown alt key b";
            }else{
                $("#keypressed").html("You are pressing : alt"); 
            }
            buttonStatus.alt = true;
            $(".combined-keyboard #alt").html( $(".combined-keyboard #alt").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #alt").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.alt = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #alt").html("Alt");
            //$("#keypressed").html("");
        });

        //  TOUCHE 'V'
        $(".combined-keyboard #v").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.c = false;
            $(".combined-keyboard #c").html("C");
            buttonStatus.b = false;
            $(".combined-keyboard #b").html("B");
            buttonStatus.u = false;
            $(".combined-keyboard #u").html("U");
            buttonStatus.i = false;
            $(".combined-keyboard #i").html("I");
            buttonStatus.x = false;
            $(".combined-keyboard #x").html("X");
            buttonStatus.a = false;
            $(".combined-keyboard #a").html("A");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + v");
                command = "xdotool keydown ctrl key v";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + v");
                command = "xdotool keydown alt key v";
            }else{
                $("#keypressed").html("You are pressing : v");
            }
            buttonStatus.v = true;
            $(".combined-keyboard #v").html( $(".combined-keyboard #v").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #v").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.v = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #v").html("V");
            //$("#keypressed").html("");
        });
        // END 'V'

        //  TOUCHE 'C'
        $(".combined-keyboard #c").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.v = false;
            $(".combined-keyboard #v").html("V");
            buttonStatus.b = false;
            $(".combined-keyboard #b").html("B");
            buttonStatus.u = false;
            $(".combined-keyboard #u").html("U");
            buttonStatus.i = false;
            $(".combined-keyboard #i").html("I");
            buttonStatus.x = false;
            $(".combined-keyboard #x").html("X");
            buttonStatus.a = false;
            $(".combined-keyboard #a").html("A");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + c");
                command = "xdotool keydown ctrl key c";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + c");
                command = "xdotool keydown alt key c";
            }else{
                $("#keypressed").html("You are pressing : c");
            }
            buttonStatus.c = true;
            $(".combined-keyboard #c").html( $(".combined-keyboard #c").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #c").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.c = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #c").html("C");
            //$("#keypressed").html("");
        });
        // END 'C'

        //  TOUCHE 'A'
        $(".combined-keyboard #a").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.c = false;
            $(".combined-keyboard #c").html("C");
            buttonStatus.b = false;
            $(".combined-keyboard #b").html("B");
            buttonStatus.u = false;
            $(".combined-keyboard #u").html("U");
            buttonStatus.i = false;
            $(".combined-keyboard #i").html("I");
            buttonStatus.x = false;
            $(".combined-keyboard #x").html("X");
            buttonStatus.v = false;
            $(".combined-keyboard #v").html("V");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + a");
                command = "xdotool keydown ctrl key a";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + a");
                command = "xdotool keydown alt key a";
            }else{
                $("#keypressed").html("You are pressing : a");
            }
            buttonStatus.a = true;
            $(".combined-keyboard #a").html( $(".combined-keyboard #a").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #a").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.a = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #a").html("A");
            //$("#keypressed").html("");
        });
        // END 'A'

        //  TOUCHE 'X'
        $(".combined-keyboard #x").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.c = false;
            $(".combined-keyboard #c").html("C");
            buttonStatus.b = false;
            $(".combined-keyboard #b").html("B");
            buttonStatus.u = false;
            $(".combined-keyboard #u").html("U");
            buttonStatus.i = false;
            $(".combined-keyboard #i").html("I");
            buttonStatus.a = false;
            $(".combined-keyboard #a").html("A");
            buttonStatus.v = false;
            $(".combined-keyboard #v").html("V");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + x");
                command = "xdotool keydown ctrl key x";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + x");
                command = "xdotool keydown alt key x";
            }else{
                $("#keypressed").html("You are pressing : x");
            }
            buttonStatus.x = true;
            $(".combined-keyboard #x").html( $(".combined-keyboard #x").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #x").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.x = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #x").html("X");
            //$("#keypressed").html("");
        });
        // END 'X'

        //  TOUCHE 'I'
        $(".combined-keyboard #i").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.c = false;
            $(".combined-keyboard #c").html("C");
            buttonStatus.b = false;
            $(".combined-keyboard #b").html("B");
            buttonStatus.u = false;
            $(".combined-keyboard #u").html("U");
            buttonStatus.a = false;
            $(".combined-keyboard #a").html("A");
            buttonStatus.x = false;
            $(".combined-keyboard #x").html("X");
            buttonStatus.v = false;
            $(".combined-keyboard #v").html("V");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + i");
                command = "xdotool keydown ctrl key i";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + i");
                command = "xdotool keydown alt key i";
            }else{
                $("#keypressed").html("You are pressing : i");
            }
            buttonStatus.i = true;
            $(".combined-keyboard #i").html( $(".combined-keyboard #i").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #i").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.i = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #i").html("I");
            //$("#keypressed").html("");
        });
        // END 'I'

        //  TOUCHE 'U'
        $(".combined-keyboard #u").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.c = false;
            $(".combined-keyboard #c").html("C");
            buttonStatus.b = false;
            $(".combined-keyboard #b").html("B");
            buttonStatus.a = false;
            $(".combined-keyboard #a").html("A");
            buttonStatus.i = false;
            $(".combined-keyboard #i").html("I");
            buttonStatus.x = false;
            $(".combined-keyboard #x").html("X");
            buttonStatus.v = false;
            $(".combined-keyboard #v").html("V");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + u");
                command = "xdotool keydown ctrl key u";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + u");
                command = "xdotool keydown alt key u";
            }else{
                $("#keypressed").html("You are pressing : u");
            }
            buttonStatus.u = true;
            $(".combined-keyboard #u").html( $(".combined-keyboard #u").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #u").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.u = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #u").html("U");
            //$("#keypressed").html("");
        });
        // END 'U'

        //  TOUCHE 'B'
        $(".combined-keyboard #b").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            //$(".combined-keyboard").css("background","#696969");
            buttonStatus.c = false;
            $(".combined-keyboard #c").html("C");
            buttonStatus.a = false;
            $(".combined-keyboard #a").html("A");
            buttonStatus.u = false;
            $(".combined-keyboard #u").html("U");
            buttonStatus.i = false;
            $(".combined-keyboard #i").html("I");
            buttonStatus.x = false;
            $(".combined-keyboard #x").html("X");
            buttonStatus.v = false;
            $(".combined-keyboard #v").html("V");
            
            if(buttonStatus.ctrl == true){
                $("#keypressed").html("You are pressing : ctrl + b");
                command = "xdotool keydown ctrl key b";
            }else if(buttonStatus.alt == true){
                $("#keypressed").html("You are pressing : alt + b");
                command = "xdotool keydown alt key b";
            }else{
                $("#keypressed").html("You are pressing : b");
            }
            buttonStatus.b = true;
            $(".combined-keyboard #b").html( $(".combined-keyboard #b").html() + " <i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        $(".combined-keyboard #b").on("touchend", function(e) { // A decommenter hors emulateur
            //buttonStatus.b = false;
            //$(".combined-keyboard").css("background","#808080");
            //$(".combined-keyboard #b").html("B");
            //$("#keypressed").html("");
        });
        // END 'B'

        //  RESET Status Array and combined keyboard locks
        $(".combined-keyboard #hide").on("touchend", function(e) {
            buttonStatus = {};
            $("#keypressed").html("");

            $(".combined-keyboard #ctrl").html("Ctrl");
            $(".combined-keyboard #alt").html("Alt");
            $(".combined-keyboard #v").html("V");
            $(".combined-keyboard #c").html("C");
            $(".combined-keyboard #b").html("B");
            $(".combined-keyboard #u").html("U");
            $(".combined-keyboard #i").html("I");
            $(".combined-keyboard #x").html("X");
            $(".combined-keyboard #a").html("A");
        });
    });

    // Click+movingmouse
    $(function(){
        $("#mouseclick .left-click").on("touchstart", function(e) {
            e.preventDefault();
            var command = "";

            buttonStatus.leftclick = true;
            $("#mouseclick .left-click").html("<i class=\"fa fa fa-lock\" style=\"font-size:10px; position:absolute;\"></i>");
            command = "xdotool mousedown 1";
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });

        /* A decommenter hors emulateur
            $("#mouseclick .left-click").on("touchend", function(e) {
            e.preventDefault();
            var command = "";

            buttonStatus.leftclick = false;
            command = "xdotool mouseup 1";
            
            $.get("http://" + navigator.host + ":" + port + "/lrc",
                {cmd: command}
            );
        });*/
    });
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

    if(buttonStatus.leftclick == true)
        $("#Slideshow-canvas").html("Left click + start");
    else
        $("#Slideshow-canvas").html( " start " );
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
    $("#Slideshow-canvas").html( "" );
    $("#mouseclick .left-click").html("");
    buttonStatus.leftclick = false; // a commenter hors emulateur
}

function handleTouchmove(evt) {
    
    if(buttonStatus.leftclick == true)
        $("#Slideshow-canvas").html("Left click + move");
    else
        $("#Slideshow-canvas").html( " move " );

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
