var express = require("express"),
        app = express(),
        sys = require("sys"),
        exec = require("child_process").exec,
        child;

/**
 * Currently supported drivers : music-on-console (aka moc) & rhythmbox
 */
function Music_Manager() {
    this.drivers = {
        rhythmbox: {
            infos: "rhythmbox-client --print-playing-format='%ta;%at;%tt;%te;%td;'",
            parse_infos: function(stdout) {
                info = stdout.split(";");
                return {artist: escape(info[0]), album: escape(info[1]), title: escape(info[2]), elapsed: info[3], duration: info[4]};
            },
            toggle_play: "export DISPLAY=:0; xdotool key XF86AudioPlay",
            stop: "export DISPLAY=:0; xdotool key XF86AudioStop",
            previous: "export DISPLAY=:0; xdotool key XF86AudioPrev",
            next: "export DISPLAY=:0; xdotool key XF86AudioNext",
            seek: null, // Doesn't seem to be possible with rhythmbox
        },
        moc: {
            infos: "mocp -Q '%artist;%album;%song;%cs;%ts'",
            parse_infos: function(stdout) {
                info = stdout.split(";");
                return {artist: escape(info[0]), album: escape(info[1]), title: escape(info[2]), elapsed: parseInt(info[3]), duration: parseInt(info[4])};
            },
            toggle_play: "mocp -G",
            stop: "mocp -P",
            previous: "mocp -r",
            next: "mocp -f",
            /**
             * proportion is a float, between 0 and 1
             */
            seek: function(driver, args) {
                var self = driver;

                exec(self.infos, function(error, stdout, stderr) {
                    var infos = self.parse_infos(stdout);
                    var proportion = args.proportion || infos.elapsed/infos.duration;
                    var seek_to = infos.duration * proportion;
                    console.log(seek_to);
                    exec("mocp -k " + parseInt(seek_to - infos.elapsed));
                });
            }
        }
    };
    // Default driver
    this.default_driver = 'rhythmbox';
}

var music_manager = new Music_Manager();

// Relative mouse move uses WebSocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3001});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        var values = message.split(';');
        exec('export DISPLAY=:0; xdotool mousemove_relative -- ' + values[0] + ' ' + values[1], function puts(error, stdout, stderr) {});
    });
});

// Route to handle music commands
app.all("/music", function(req, res) {
    var driver_name = req.query.driver;

    if(!(driver_name in music_manager.drivers)) {
        driver_name = music_manager.default_driver;
    }

    var driver  = music_manager.drivers[driver_name];

    if('info' in req.query) {
        exec(driver.infos, function(error, stdout, stderr) {
            var infos = driver.parse_infos(stdout);
            res.send(infos);
        });
    } else if('action' in req.query && req.query.action in driver) {
        var command = driver[req.query.action];

        if(typeof command == 'string') {
            exec(command);
        } else if(typeof command == 'function') {
            command(driver, JSON.parse(req.query.args) || {});
        } else {
            res.send({error: "command not supported by driver " + driver_name});
        }
    } else {
        res.send({error: "undefined action for driver " + driver_name});
    }
});

// Handles arbitrary commands sent from lrc-client
app.all("/lrc", function(req, res) {
    var command = req.query.cmd;
    exec(command, function(err, stdout, stderr) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send({res: stdout});
    });
});


/**
 * handles all requests
 */
app.get(/^\/(.*)/, function(req, res) {
    child = exec("rhythmbox-client --print-playing-format='%ta;%at;%tt;%te;%td;' && amixer sget Master && xbacklight -get", function(error, stdout, stderr) {
        res.header("Content-Type", "text/javascript");
        // error of some sort
        if (error !== null) {
            res.send("0");
        }
        else {
            // info actually requires us returning something useful
            if (req.params[0] == "info") {
                info = stdout.split(";");
                var volume = info[5].split("%]");
                volume = volume[0].split("[");
                volume = volume[1];

                var backlight = info[5].split("[on]");
                backlight = backlight[1].replace(/^\s+|\s+$/g, "");
                backlight = backlight.split(".");
                backlight = backlight[0];
                //console.log(backlight);
                res.send(req.query.callback + "({'artist':'" + escape(info[0]) + "', 'album':'" + escape(info[1]) + "', 'title': '" + escape(info[2]) + "', 'elapsed': '" + info[3] + "', 'duration':'" + info[4] + "', 'volume':'" + volume + "', 'backlight':'" + backlight + "'})");
            }
            else {
                res.send(req.query.callback + "()");
            }
        }
    });
});

app.listen(3000, function () {
//    console.log('Listening on port 3000');
});
