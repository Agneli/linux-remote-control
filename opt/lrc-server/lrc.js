var express = require("express"),
        app = express(),
        sys = require("sys"),
        exec = require("child_process").exec,
        music_manager = require("Music_Manager.js").driver,
        child;

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
    if('info' in req.query) {
        exec(music_manager.infos, function(error, stdout, stderr) {
            var infos = music_manager.parse_infos(stdout);
            res.send(infos);
        });
    } else if('action' in req.query && req.query.action in music_manager) {
        var command = music_manager[req.query.action];

        if(typeof command == 'string') {
            exec(command);
            res.send({state: 0});
        } else if(typeof command == 'function') {
            command(music_manager, exec, JSON.parse(req.query.args) || {});
            res.send({state: 0});
        } else {
            res.send({state: 1, error: "command not supported by driver " + music_manager.name});
        }
    } else {
        res.send({state: 1, error: "undefined action for driver " + music_manager.name});
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
