// LocalStorage ________________________________________________________________
// Stores information about the servers to be controlled
if (localStorage.serverCount === undefined) {
    $("#msg-server").html("Click on 'Add Server'");
}

function server(id, name, ip, status) {
    this.id = id;
    this.name = name;
    this.ip = ip;
    this.status = status;
}

function createNewServer(d, n, i, s) {
    var createdServer = new server(d, n, i, s);
    if (localStorage.serverCount === undefined) {
        localStorage.setItem('serverCount', 0);
    }
    var serverSize = parseInt(localStorage.serverCount) + 1;
    commitToStorage(serverSize, createdServer);
}

function commitToStorage(objectCount, newObject) {
    // The unique key of the object:
    var item = 'server_' + objectCount;
    localStorage.setItem('serverCount', objectCount);

    // Put the object into storage
    localStorage.setItem(item, JSON.stringify(newObject));

    // Create Markup
    createMarkup(newObject);
}

//Add server link to HTML
function createMarkup(server) {
    if (server.status !== "off") {
        $('#servers').append('<a id="' + server.name + '" class="line dark-blue link-menu server" href="javascript:;" data-direction=\'{"from":"right","to":"left"}\'  data-server=\'{"id":"' + server.id + '", "ip":"' + server.ip + '", "name": "' + server.name + '"}\'><span>' + server.name + '</span><div class="w20 arrow right"></div></a>');
    }
}

$(function() {
    $("#save").click(function() {
        if (localStorage.serverCount === undefined) {
            var id = 1;
        } else {
            id = 1 + parseInt(localStorage.getItem('serverCount'));
        }
        var name = $("#name").val();
        var ip = $("#ip").val();
        var status = "on";
        createNewServer(id, name, ip, status);
        //return false;
        location.reload();
    });

    var serverCount = localStorage.getItem('serverCount');
    for (i = 1; i <= serverCount; i++)
    {
        //var number = parseInt(i) + 1;
        var server = jQuery.parseJSON(localStorage.getItem("server_" + i));
        createMarkup(server);
    }
});

// Delete (off) Server
$(function() {
    $("#delete-server").click(function() {
        var svr = JSON.stringify(localStorage.getItem("server_" + id));
        svr = svr.replace("on", "off");
        localStorage.setItem("server_" + id, JSON.parse(svr));
        location.reload();
    });
});

//localStorage.clear();

// Function to convert music time to seconds ___________________________________
function seconds(time) {
    var split = time.split(':');
    if (split.length === 1) {
        var seconds = split[0];
    } else if (split.length === 2) {
        var seconds = ((split[0] * 60) + parseInt(split[1]));
    } else if (split.length === 3) {
        var seconds = ((((split[0] * 60) * 60) + parseInt(split[1] * 60)) + parseInt(split[2]));
    }
    return seconds;
}

// Function to convert elapsed music time to percent ___________________________
function percent(elapsed, duration) {
    var percent = (seconds(elapsed) / seconds(duration)) * 100;
    return percent;
}

// jQuery-UI components ________________________________________________________
$(function() {

    $("#sound-timeline").slider();
    var sound_timeline = $('#sound-timeline');
    sound_timeline.slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100
    });

    $("#video-timeline").slider();
    var video_timeline = $('#video-timeline');
    video_timeline.slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100
    });

});


// Responsive Layout ___________________________________________________________
$(function() {

//Fix Height
    var height = $("#main").height();
    $("#main").css('height', height);
    $("#main > section").css('height', height);
    $('select').on('change', function() {
        $.get('/lrc', {cmd: $(this).val()});
    });
    var line = $(".line").height();
    var line_width = $(".line").width();
    $(".line").css('height', line);
    $(".line").css('line-height', line + "px");

    $(".line .fields").css('width', line_width / 100 * 80 + "px");
    var fields = $(".fields").width();
    $(".line .fields input").css({'width': fields / 100 * 90 + "px", 'padding-top': line / 100 * 20 + 'px', 'padding-bottom': line / 100 * 20 + 'px'});
    $(".line .fields select").css({'width': fields + "px", 'padding': line / 100 * 20 + 'px', 'padding-bottom': line / 100 * 20 + 'px'});

    $(".h20").css('height', line * 2);
    $(".h20").css('line-height', line * 2 + "px");

    $(".h60").css('height', line * 6);
    $(".h60").css('line-height', line * 6 + "px");
    $(".h60 .h50").css('height', line / 2 + "px");
    $(".h60 .h50").css('line-height', line / 2 + "px");

    var w_h70 = $(".h70").width();
    $(".h70").css('height', line * 7);
    $(".h70").css('width', w_h70 + "px");
    $(".h70").css('line-height', line * 7 + "px");

    $(".h90").css('height', line * 9);
    $(".h90").css('line-height', line * 9 + "px");

// Font-size
    $(".line").css('font-size', line / 100 * 40 + "px");
    $("header").css('font-size', line / 100 * 50 + "px");
    $(".artist").css('font-size', line / 100 * 60 + "px");
    $(".album").css('font-size', line / 100 * 40 + "px");
    $(".title").css('font-size', line / 100 * 50 + "px");
    $(".time").css('font-size', line / 100 * 30 + "px");
    $(".h60 .line").css('font-size', line / 100 * 30 + "px");
    $(".h60 .line .w20").css('font-size', line / 100 * 50 + "px");
    $(".h60 .line .w20").css('margin-right', "5%");
    $("#playlists-menu a").css('font-size', line / 100 * 25 + "px");
    //$("#now-playing span .name").css('font-size', line / 100 * 60 + "px");
});

// Select server from localStorage _____________________________________________
var host = "", server_name = "";
$(function() {
    $(".server").click(function() {
        id = $(this).data("server").id;
        host = $(this).data("server").ip;
        server_name = $(this).data("server").name;
        $("#server-name").html(server_name);
        $("#delete-server").attr('data-id', '{"id":"' + id + '"}');
    });
});
var port = '3000';

// Musics ______________________________________________________________________

// Volume
$(".sound-volume").slider();
var sound_volume = $('.sound-volume');
sound_volume.slider({
    range: "min",
    value: 0,
    min: 0,
    max: 100,
    change: function(event, ui) {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd + ui.value + "%"});
    }
});


// Music Controls
$(function() {

    $(".sound-min").click(function() {
        var volume = $(".sound-volume").slider("value");
        $(".sound-volume").slider("value", parseInt(volume - $(this).data("command").step));
    });
    $(".sound-max").click(function() {
        var volume = $(".sound-volume").slider("value");
        $(".sound-volume").slider("value", parseInt($(this).data("command").step) + volume);
    });

    $("#music-controls *:not(#music-play-pause)").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });

    $("#music-controls #music-play-pause").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });

});

// Videos ______________________________________________________________________
$(function() {

    $("#video-controls #video-play-pause").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });

    $("#video-controls *:not(#video-play-pause)").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });
});

// Controls ____________________________________________________________________

$(function() {
    $("#send-command").click(function() {
        var command = $("#command").val();
        $.get('http://' + host + ':' + port + '/lrc', {cmd: command});
    });
});

// Backlight
$("#backlight").slider();
var screen_brightness = $('#backlight');
screen_brightness.slider({
    range: "min",
    value: 0,
    min: 0,
    max: 100,
    change: function(event, ui) {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd + ui.value});
    }
});

$(function() {
    $("#controls-controls a").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });
});

$(function() {
    $(".dark-screen").click(function() {
        var brightness = $("#backlight").slider("value");
        $("#backlight").slider("value", parseInt(brightness - $(this).data("command").step));
    });
    $(".light-screen").click(function() {
        var brightness = $("#backlight").slider("value");
        $("#backlight").slider("value", parseInt($(this).data("command").step) + brightness);
    });
});

// Touchpad ___________________________________________________________________

$(function() {
    $("#mouse-controls a").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });
});

// Slideshow ___________________________________________________________________

$(function() {
    $("#slideshow-controls a").click(function() {
        $.get('http://' + host + ':' + port + '/lrc', {cmd: $(this).data("command").cmd});
    });
});

// Pages animations
$(function() {

    var speed = 300;

    //Index
    $(".link-index").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#index").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Add Server
    $(".link-add-server").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#add-server").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Help
    $(".link-help").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#help").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Server
    $(".link-server").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#server").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Install
    $(".link-install").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#install").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Contribute
    $(".link-contribute").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#contribute").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //FAQ
    $(".link-faq").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#faq").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Install
    $(".link-bugs").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#bugs").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Install
    $(".link-feedback").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#feedback").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Install
    $(".link-about").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#about").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Install
    $(".link-credits").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#credits").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Menu
    $(".link-menu").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#menu").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Musics
    $(".link-musics").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#musics").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Playlists
    $(".link-playlists").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#playlists").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Videos
    $(".link-videos").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#videos").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Controls
    $(".link-controls").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#controls").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Touchpad
    $(".link-touchpad").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#touchpad").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Slideshow
    $(".link-slideshow").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#slideshow").show('slide', {direction: $(this).data("direction").from}, speed);
    });

    //Settings
    $(".link-settings").click(function() {
        $("section").hide('slide', {direction: $(this).data("direction").to}, speed);
        $("#settings").show('slide', {direction: $(this).data("direction").from}, speed);
    });

});

// _____________________________________________________________________________

var second, artist, album, title, elapsed, duration, volume, backlight;


// My own spiffy ajax wrapper
// Because cache should always be false for this kind of stuff
function pajax(u, cb) {
    $.ajax({
        url: 'http://' + host + ':' + port + '/' + u,
        dataType: 'jsonp',
        cache: false,
        jsonpCallback: cb});
}

// Callback functions for jsonp
function init() {
    pajax('info', 'setInit');
    setTimeout("pajax('info', 'checkTime')", 950);
}

// Set some globals to use in checkTime
function setInit(data) {
    artist = unescape(data.artist);
    album = unescape(data.album);
    title = unescape(data.title);
    elapsed = unescape(data.elapsed);
    duration = unescape(data.duration);
    volume = unescape(data.volume);
    backlight = unescape(data.backlight);
}

// Checks to see if times are different (time has increased by 1 second)
// If not, assumes paused, set state to paused
function checkTime(data) {
    if (data != 0) {
        second = data.elapsed;

        if (second > elapsed) {
            // song is playing
            $(function() {
                $('.artist').text(artist);
                $('.album').text(album);
                $('.title').text(title);
                $('.elapsed').text(elapsed);
                $('.duration').text(duration);
                $('.sound-volume').slider("value", volume);
                $('.test').text(backlight);

                $('.paused').text('');

                // Sound-timeline
                $("#sound-timeline").slider("value", percent(elapsed, duration));

                $('#music-play-pause').addClass("pause");
                $('#music-play-pause').removeClass("play");
            });
        }
        else {
            // is paused
            $(function() {
                $('.paused').text('Paused');
                $('#music-play-pause').addClass("play");
                $('#music-play-pause').removeClass("pause");
            });
        }
    }
    else {
        $('.title').text('An Error Occurred').fadeIn('fast');
    }
}

// Interval to check and see which song is still playing (if at all)
setInterval("init()", 1000); // 1 second
init();
