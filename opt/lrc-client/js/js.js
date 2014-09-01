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
    var line = $(selector + " .line").first().height();
    var line_width = $(selector + " .line").first().width();
    $(selector + " .line").css("height", line);
    $(selector + " .line").css("line-height", line + "px");

    $(selector + " .line .fields").css("width", line_width / 100 * 80 + "px");
    $(selector + " .line .fields").css("height", line);
    $(selector + " .line .fields").css("line-height", line + "px");
    var fields = $(selector + " .fields").width();
    $(selector + " .line .fields input").css({"width": fields / 100 * 90 + "px", "padding-top": line / 100 * 20 + "px", "padding-bottom": line / 100 * 20 + "px", "margin-top": line / 100 * 10 + "px"});
    $(selector + " .line .fields-command input").css({"width": fields / 100 * 70 + "px", "padding-top": line / 100 * 20 + "px", "padding-bottom": line / 100 * 20 + "px", "margin-top": line / 100 * 10 + "px"});
    $(selector + " .line .fields select").css({"width": fields + "px", "padding": line / 100 * 20 + "px", "padding-bottom": line / 100 * 20 + "px"});

    $(selector + " .theme a").css("height", line * 0.8);
    $(selector + " .theme a").css("border", "1px solid #fff");
    $(selector + " .theme a").css("border-radius", "5px");

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

navigator.host = "";
var port = "3000";
var websocketPort = "3001";

//Clear server to back to index
$(function() {
    $("#clear-server").click(function() {
        navigator.host = "";
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
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd + ui.value + "%"});
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
        $.get("http://" + navigator.host + ":" + port + "/music", {action: "seek", args: {proportion: ui.value / 100}});
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
        $.get("http://" + navigator.host + ":" + port + "/music", {action: $(this).data("action")});
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
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });

    $("#video-controls *:not(#video-play-pause)").click(function() {
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

// Alt-tab ____________________________________________________________________
$(function() {
    $("#alt-tab a").click(function() {
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});


// Controls ____________________________________________________________________
$(function() {
    $("#send-command").click(function() {
        var command = $("#command").val();
        var dangerous_commands = new Array(/^rm .*/, /^mkfs(\..{,8})? .*/, /> \/dev\/sd.*$/, "fork while fork", ":(){:|:&};:", /^chmod -R 777 \//);
        var dangerous = false;
        for (var index in dangerous_commands) {
            dangerous = dangerous || command.search(dangerous_commands[index]) != -1;
        }
        if (!dangerous) {
            $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: command}).done(function(response) {
                if (response.error) {
                    alert('An error occured');
                    console.log(response.error);
                }
                if (response.stdout !== '') {
                    alert(response.stdout);
                }
            });
        } else {
            // TODO : Should be translated
            alert("The command '" + command + "' is considered dangerous, so it was blocked.");
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
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd + ui.value});
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
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

//Reboot
$(function() {
    $("#controls-controls a#reboot").click(function() {
        var _confirm = confirm("Reboot. Are you sure ?");
        if (_confirm) {
            $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
        }
    });
});

//Shutdown
$(function() {
    $("#controls-controls a#shutdown").click(function() {
        var _confirm = confirm("Shut Down. Are you sure ?");
        if (_confirm) {
            $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
        }
    });
});

// Touchpad ____________________________________________________________________

$(function() {
    $("#mouse-controls a:not(.slideshow)").click(function() {
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
    });
});

// Slideshow ___________________________________________________________________

$(function() {
    $(".slideshow-controls a:not(.mouse)").click(function() {
        $.get("http://" + navigator.host + ":" + port + "/lrc", {cmd: $(this).data("command").cmd});
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

// Keyboard input
$(function() {
    $(".keyboard").click(function() {
        $("input.keyboard-input").focus();
    });

    $("input.keyboard-input").each(function() {
        $(this).keypress(function(e) {
            e.preventDefault();
            var char = String.fromCharCode(e.charCode);
            var escaped_chars = /['&><;(){}\\~#*`"]/;

            if (char.match(escaped_chars)) {
                char = "\\" + char;
            }

            var command = "xdotool type " + char;

            // Special characters
            if (e.keyCode == 8) {
                char = 'BackSpace';
                command = "xdotool keydown " + char + " keyup " + char;
            } else if (e.keyCode == 13) {
                char = 'Return';
                command = "xdotool keydown " + char + " keyup " + char;
            } else if (char === ' ') {
                char = 'space';
                command = "xdotool keydown " + char + " keyup " + char;
            }

            $.get("http://" + navigator.host + ":" + port + "/lrc",
                    {cmd: command}
            );
        });
    });
});

// Settings ____________________________________________________________________

$(function() {

    if (localStorage.language === undefined) {
        localStorage.setItem("language", "en-US");
    }

    var default_theme = JSON.stringify($(".theme a:first-of-type").data("theme"));

    if (localStorage.theme === undefined) {
        localStorage.setItem("theme", default_theme);
    }

    var theme = JSON.parse(localStorage.theme);
    var color1_dark = theme.color1_dark;
    var color1_light = theme.color1_light;
    var color2_dark = theme.color2_dark;
    var color2_light = theme.color2_light;

    $("#save-settings").click(function() {
        var lang = $("#language").val();

		if(typeof theme_save!=="undefined")
			localStorage.setItem("theme", theme_save);

		if(language!=lang) {
        	localStorage.setItem("language", lang);
			i18n.init({lng: lang, debug: false}, function() {
				$("#main").i18n();
			});
			language=lang;
        	//location.reload();
		}
    });

    $("#cancel-settings").click(function() {
        changeTheme(color1_dark, color1_light, color2_dark, color2_light);
    });

    // Translation
    language = localStorage.getItem("language");
    i18n.init({lng: language, debug: false}, function() {
        $("#main").i18n();
    });

    // Preview Theme
    $(".theme a").each(function() {

        var theme = $(this).data("theme");
        var color1_dark = theme.color1_dark;
        var color1_light = theme.color1_light;
        var color2_dark = theme.color2_dark;
        var color2_light = theme.color2_light;

        $(this).css("background-image", "linear-gradient(" + color1_dark + " 0, " + color1_dark + " 25%, " + color1_light + " 25%, " + color1_light + " 50%, " + color2_light + " 50%, " + color2_light + " 75%, " + color2_dark + " 75%, " + color2_dark + " 100%)");

        $(this).click(function() {
            theme_save = JSON.stringify($(this).data("theme"));
            changeTheme(color1_dark, color1_light, color2_dark, color2_light);
        });
    });

    // Change Theme
    function changeTheme(color1_dark, color1_light, color2_dark, color2_light) {
        $("*.color1-dark, *.color1-light .ui-slider-handle, #main").css("background-color", color1_dark);
        $("*.color1-light, *.color1-dark .ui-slider-handle").css("background-color", color1_light);
        $("*.color2-dark, *.color2-light .ui-slider-handle").css("background-color", color2_dark);
        $("*.color2-light, *.color2-dark .ui-slider-handle").css("background-color", color2_light);

        $("*.text-color1-dark").css("color", color1_dark);
        $("*.text-color1-light, .text a").css("color", color1_light);
        $("*.text-color2-dark").css("color", color2_dark);
        $("*.text-color2-light").css("color", color2_light);
    }

    // Apply changes
    changeTheme(color1_dark, color1_light, color2_dark, color2_light);

});


// Pages animations ____________________________________________________________
var speed = 300;
function pages_animations(context) {
    context = context || '';

    // Index
    $(context + " a[data-page]").click(function() {
        var name = '#' + $(this).data("page");
		if($(this).data("direction")=="left") {
			$(this).parents("section").animate({left:"-"+ $("section").width() +"px"}, speed);
			$(name).css({left:$("section").width() +"px"})
				.show()
				.animate({left:0}, speed);
		}else if($(this).data("direction")=="right") {
			$(this).parents("section").animate({left:$("section").width() +"px"}, speed);
			$(name).css({left:"-"+$("section").width() +"px"})
				.show()
				.animate({left:0}, speed);
		}else if($(this).data("direction")=="down") {
			$(this).parents("section").animate({top:$("section").height() +"px"}, speed);
			$(name).css({top:"-"+$("section").height() +"px"})
				.show()
				.animate({top:0}, speed);
		}else if($(this).data("direction")=="up") {
			$(this).parents("section").animate({top:"-"+$("section").height() +"px"}, speed);
			$(name).css({top:$("section").height() +"px"})
				.show()
				.animate({top:0}, speed);
		}
    });
}

$(function() {
    pages_animations();
    navigator.servers.refresh_view();

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
        url: "http://" + navigator.host + ":" + port + "/" + u,
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
