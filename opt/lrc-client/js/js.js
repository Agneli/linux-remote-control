// LocalStorage ________________________________________________________________

// Stores information about the servers to be controlled
if (localStorage.serverCount === undefined) {
    // TODO : This should be translated
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
        localStorage.setItem("serverCount", 0);
    }
    var serverSize = parseInt(localStorage.serverCount) + 1;
    commitToStorage(serverSize, createdServer);
}

function commitToStorage(objectCount, newObject) {
    // The unique key of the object:
    var item = "server_" + objectCount;
    localStorage.setItem("serverCount", objectCount);

    // Put the object into storage
    localStorage.setItem(item, JSON.stringify(newObject));

    // Create Markup
    createMarkup(newObject);
}

//Add server link to HTML
function createMarkup(server) {
    if (server.status !== "off") {
        $("#servers").append('<a id="' + server.name.replace(" ", "-") + '" class="line dark-blue server" data-page="menu" href="#!" data-direction=\'{"from":"right","to":"left"}\' data-server=\'{"id":"' + server.id + '", "ip":"' + server.ip + '", "name": "' + server.name + '"}\'><span>' + server.name + '</span><div class="w20 right"><i class="fa fa-chevron-right"></i></div></a>');
    }
}

$(function() {
    $("#save").click(function() {
        if (localStorage.serverCount === undefined) {
            var id = 1;
        } else {
            id = 1 + parseInt(localStorage.getItem("serverCount"));
        }
        var name = $("#name").val();
        var ip = $("#ip").val();
        var status = "on";
        createNewServer(id, name, ip, status);
        //return false;
        location.reload();
    });

    var serverCount = localStorage.getItem("serverCount");
    for (i = 1; i <= serverCount; i++)
    {
        //var number = parseInt(i) + 1;
        var server = jQuery.parseJSON(localStorage.getItem("server_" + i));
        createMarkup(server);
    }

    // Clear fields
    $("#cancel").click(function() {
        $(".fields input").val("");
    });

});

// Delete (off) Server
$(function() {
    $("#delete-server").click(function() {
        // TODO : This should be translated
        if (confirm("Delete server. Are you sure ?")) {
            var svr = JSON.stringify(localStorage.getItem("server_" + id));
            svr = svr.replace("on", "off");
            localStorage.setItem("server_" + id, JSON.parse(svr));
            location.reload();
        }
    });
});

// Function to convert music time to seconds ___________________________________
function seconds(time) {
    var split = time.split(":");
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

    $("#video-timeline").slider();
    var video_timeline = $("#video-timeline");
    video_timeline.slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100
    });

});


// Responsive Layout ___________________________________________________________
$(function() {
    responsive_layout('#main');
});

function responsive_layout(selector) {

    // Responsive Height
    var height = $("#main").height();
    $("#main").css("height", height);
    $("#main" + " > section").css("height", height);
    var line = $(selector + " .line").height();
    var line_width = $(selector + " .line").width();
    $(selector + " .line").css("height", line);
    $(selector + " .line").css("line-height", line + "px");

    $(selector + " .line .fields").css("width", line_width / 100 * 80 + "px");
    $(selector + " .line .fields").css("height", line);
    $(selector + " .line .fields").css("line-height", line + "px");
    var fields = $(selector + " .fields").width();
    $(selector + " .line .fields input").css({"width": fields / 100 * 90 + "px", "padding-top": line / 100 * 20 + "px", "padding-bottom": line / 100 * 20 + "px", "margin-top": line / 100 * 10 + "px"});
    $(selector + " .line .fields-command input").css({"width": fields / 100 * 70 + "px", "padding-top": line / 100 * 20 + "px", "padding-bottom": line / 100 * 20 + "px", "margin-top": line / 100 * 10 + "px"});
    $(selector + " .line .fields select").css({"width": fields + "px", "padding": line / 100 * 20 + "px", "padding-bottom": line / 100 * 20 + "px"});

    $(selector + " .h20").css("height", line * 2);
    $(selector + " .h20").css("line-height", line * 2 + "px");

    $(selector + " .h30").css("height", line * 3);
    $(selector + " .h30").css("line-height", line * 3 + "px");

    $(selector + " .h40").css("height", line * 4);
    $(selector + " .h40").css("line-height", line * 4 + "px");

    $(selector + " .h50").css("height", line * 5);
    $(selector + " .h50").css("line-height", line * 5 + "px");

    $(selector + " .h60").css("height", line * 6);
    $(selector + " .h60").css("line-height", line * 6 + "px");
    $(selector + " .h60 .h50").css("height", line / 2 + "px");
    $(selector + " .h60 .h50").css("line-height", line / 2 + "px");

    var w_h70 = $(selector + " .h70").width();
    $(selector + " .h70").css("height", line * 7);
    // $(selector + " .h70").css("width", w_h70 + "px");
    $(selector + " .h70").css("line-height", line * 7 + "px");

    $(selector + " .h80").css("height", line * 8);
    $(selector + " .h80").css("line-height", line * 8 + "px");

    $(selector + " .h90").css("height", line * 9);
    $(selector + " .h90").css("line-height", line * 9 + "px");

    // Responsive Font-size
    $(selector + " .line").css("font-size", line / 100 * 40 + "px");
    $(selector + " header").css("font-size", line / 100 * 50 + "px");
    $(selector + " .artist").css("font-size", line / 100 * 60 + "px");
    $(selector + " .album").css("font-size", line / 100 * 40 + "px");
    $(selector + " .title").css("font-size", line / 100 * 50 + "px");
    $(selector + " .time").css("font-size", line / 100 * 30 + "px");
    $(selector + " .h60 .line").css("font-size", line / 100 * 30 + "px");
    $(selector + " .h60 .line .w20").css("font-size", line / 100 * 50 + "px");
    $(selector + " .h60 .line .w20").css("margin-right", "5%");
    $(selector + " #playlists-menu a").css("font-size", line / 100 * 25 + "px");
    //$(selector + " #now-playing span .name").css("font-size", line / 100 * 60 + "px");
}

// Select server from localStorage _____________________________________________
var host = "", server_name = "";
$(function() {
    $(".server").click(function() {
        id = $(this).data("server").id;
        host = $(this).data("server").ip;
        server_name = $(this).data("server").name;
        $("#server-name").html(server_name);
        $("#delete-server").attr("data-id", '{"id":"' + id + '"}');
    });
});
var port = "3000";
var websocketPort = "3001";

//Clear server to back to index
$(function() {
    $("#clear-server").click(function() {
        id = "";
        host = "";
        server_name = "";
        $("#server-name").html("");
    });
});

// Musics ______________________________________________________________________

// Volume
$(".sound-volume").slider();
var sound_volume = $(".sound-volume");
sound_volume.slider({
    range: "min",
    value: 0,
    min: 0,
    max: 100,
    change: function(event, ui) {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd + ui.value + "%"});
    }
});

// Timeline
$("#music-timeline").slider();
var music_timeline = $("#music-timeline");
music_timeline.slider({
    range: "min",
    value: 0,
    min: 0,
    max: 100,
    change: function(event, ui) {
        $.get("http://" + host + ":" + port + "/music", {action: "seek", args: {proportion: ui.value / 100}});
    }
});

// Music Controls
$(function() {

    $("section#musics .sound-min").click(function() {
        var volume = $("section#musics .sound-volume").slider("value");
        $("section#musics .sound-volume").slider("value", parseInt(volume - $(this).data("command").step));
    });

    $("section#musics .sound-max").click(function() {
        var volume = $("section#musics .sound-volume").slider("value");
        $("section#musics .sound-volume").slider("value", parseInt($(this).data("command").step) + volume);
    });

    $("#music-controls a").click(function() {
        $.get("http://" + host + ":" + port + "/music", {action: $(this).data("action")});
    });
});

// Videos ______________________________________________________________________

$(function() {

    $("section#videos .sound-min").click(function() {
        var volume = $("section#videos .sound-volume").slider("value");
        $("section#videos .sound-volume").slider("value", parseInt(volume - $(this).data("command").step));
    });

    $("section#videos .sound-max").click(function() {
        var volume = $("section#videos .sound-volume").slider("value");
        $("section#videos .sound-volume").slider("value", parseInt($(this).data("command").step) + volume);
    });

    $("#video-controls #video-play-pause").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });

    $("#video-controls *:not(#video-play-pause)").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

// Alt-tab ____________________________________________________________________

$(function() {
    $("#alt-tab a").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});


// Controls ____________________________________________________________________

$(function() {
    $("#send-command").click(function() {
        var command = $("#command").val();
        var dangerous_commands = new Array("rm", "rm -r", "rm -rf", "rm -rf /", "rm -rf .", "rm -rf *", "rm -r .[^.]* ", "rm -rf ~ / &", "mkfs", "mkfs.ext3", "mkfs.", "mkfs.ext3 /dev/sda", "> /dev/sda", "/dev/sda", "fork while fork", ":(){:|:&};:", "- chmod -R 777 /");
        for (var i = 0; i < dangerous_commands.length; i++) {
            if (command.search(dangerous_commands[i]) != -1) {
                alert("The command '" + dangerous_commands[i] + "' is considered dangerous. So it was blocked.");
            } else {
                $.get("http://" + host + ":" + port + "/lrc", {cmd: command});
            }
        }
    });
});

// Backlight
$("#backlight").slider();
var screen_brightness = $("#backlight");
screen_brightness.slider({
    range: "min",
    value: 0,
    min: 0,
    max: 100,
    change: function(event, ui) {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd + ui.value});
    }
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

$(function() {
    $("#controls-controls a:not(#reboot, #shutdown)").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

//Reboot
$(function() {
    $("#controls-controls a#reboot").click(function() {
        var _confirm = confirm("Reboot. Are you sure ?");
        if (_confirm) {
            $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
        }
    });
});

//Shutdown
$(function() {
    $("#controls-controls a#shutdown").click(function() {
        var _confirm = confirm("Shut Down. Are you sure ?");
        if (_confirm) {
            $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
        }
    });
});

// Touchpad ____________________________________________________________________

$(function() {
    $("#mouse-controls a:not(.play-slideshow)").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

// Slideshow ___________________________________________________________________

$(function() {
    $(".slideshow-controls a:not(.mouse)").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

// Custom Commands _____________________________________________________________
$(function() {
    // Existing commands are loaded in custom-commands.js
    $('#add-custom-command a.save').click(function() {
        var name = $('#add-custom-command input[name=name]').val();
        var cmd = $('#add-custom-command input[name=cmd]').val();
        navigator.custom_commands.add(name, cmd);
        navigator.custom_commands.refresh_view();
        responsive_layout('#custom-commands');
    });
});

// Settings ____________________________________________________________________

$(function() {

    if (localStorage.language === undefined) {
        localStorage.setItem("language", "en-US");
    }

    $("#save-settings").click(function() {
        var lang = $("#language").val();
        localStorage.setItem("language", lang);
        location.reload();
    });

    // Translation
    language = localStorage.getItem("language");
    i18n.init({lng: language, debug: false}, function() {
        $("#main").i18n();
    });
});

// Pages animations ____________________________________________________________
$(function() {

    var speed = 300;

    // Index
    $("a[data-page]").click(function() {
        var name = '#' + $(this).data("page");
        $("section").hide("slide", {direction: $(this).data("direction").to}, speed);
        $(name).show("slide", {direction: $(this).data("direction").from}, speed);
    });

    // Message to update lrc-server
    if (localStorage.update03 === undefined) {
        alert("You need to install/upgrade lrc-server. Learn how to: Help > How to install on GNU/Linux.");
        localStorage.setItem("update03", "ok");
        $("section").hide("slide", {direction: "left"}, speed);
        $("#install").show("slide", {direction: "right"}, speed);
    }

});

// Ajax ________________________________________________________________________

var second, artist, album, title, elapsed, duration, volume, backlight;


// My own spiffy ajax wrapper
// Because cache should always be false for this kind of stuff
function pajax(u, cb) {
    $.ajax({
        url: "http://" + host + ":" + port + "/" + u,
        dataType: "jsonp",
        cache: false,
        jsonpCallback: cb});
}

// Callback functions for jsonp
function init() {
    pajax("info", "setInit");
    setTimeout("pajax('info', 'checkTime')", 1000);
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
                $(".artist").text(artist);
                $(".album").text(album);
                $(".title").text(title);
                $(".elapsed").text(elapsed);
                $(".duration").text(duration);
                $(".sound-volume").slider("value", volume);
                $("#backlight").slider("value", backlight);

                // Music-timeline
                $("#music-timeline").slider("value", percent(elapsed, duration));

                $(".paused").text("");
                $("#music-play-pause").addClass("pause");
                $("#music-play-pause").removeClass("play");
            });
        }
        else {
            // is paused
//            $(function() {
//                $(".paused").text("Paused");
//                $("#music-play-pause").addClass("play");
//                $("#music-play-pause").removeClass("pause");
//            });
        }
    }
    else {
        $(".paused").text("An Error Occurred").fadeIn("fast");
    }
}

// Interval to check and see which song is still playing (if at all)
setInterval("init()", 950); // 1 second
