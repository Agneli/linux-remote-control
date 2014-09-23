//CONSTANTS
var CLICK_PREFIX = 'c';
var MOVE_PREFIX = 'm';
var SCROLL_PREFIX = 's';

var express = require("express"),
        app = express(),
        sys = require("sys"),
        exec = require("child_process").exec,
        child = null,
        config = require("./configuration.js").config,
        music_manager = require("music.js").drivers[config.music_driver],
        cmd = require("cmd.js"),
        child;

// Relative mouse move uses WebSocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: config.websocket_port});
var values, x, y;
var handleMessage = function(message) {
    var prefix = message[0];
    message = message.substr(1);
    switch (prefix) {
        case CLICK_PREFIX:
            //Clicks are not yet sent over websocket
        break;
        case MOVE_PREFIX:
            values = message.split(';');
            x = parseInt(values[0]) * config.mouse_speed.x;
            y = parseInt(values[1]) * config.mouse_speed.y;
            if (Math.abs(x) > 10) {
                if (Math.abs(x) > 20) {
                    x = x * 2;
                }
                x = x * 2;
            }
            if (Math.abs(y) > 10) {
                if (Math.abs(y) > 20) {
                    y = y * 2;
                }
                y = y * 2;
            }
            exec('xdotool mousemove_relative -- ' + x + ' ' + y, function puts(error, stdout, stderr) {});
        break;
        case SCROLL_PREFIX:
            var button = message < 0 ? 4 : 5;
            exec('xdotool click ' + button, function puts(error, stdout, stderr) {});
        break;
        default:
            console.log('WebSocket received : ' + message);
        break;
    }
};
wss.on('connection', function(ws) {
    ws.on('message', handleMessage);
    setInterval(function() {
        wss.broadcast(JSON.stringify({status: 'Running', driver: config.connection_driver, port: config.port}));
    }, 3000);
});

// WebSocket test
wss.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

// Route to handle music commands
app.all("/music", function(req, res) {
    if ('info' in req.query) {
        exec(music_manager.infos, function(error, stdout, stderr) {
            var infos = music_manager.parse_infos(stdout);
            if(!isNaN(infos.elapsed) && !isNaN(infos.duration)) {
                infos["elapsed-formatted"] = Math.floor(infos.elapsed/60) + ':' + (infos.elapsed % 60 < 10 ? '0' : '') + (infos.elapsed % 60);
                infos["duration-formatted"] = Math.floor(infos.duration/60) + ':' + (infos.duration % 60 < 10 ? '0' : '') + (infos.duration % 60);
                infos["elapsed-percent"] = infos.elapsed/infos.duration*100;
            }
            res.send(req.query.callback + '(' + JSON.stringify({music: infos}) + ')');
        });
    } else if ('action' in req.query && req.query.action in music_manager) {
        var command = music_manager[req.query.action];

        if (typeof command == 'string') {
            exec(command);
            res.send({state: 0});
        } else if (typeof command == 'function') {
            command(music_manager, exec, req.query.args || {});
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
        res.send({stdout: stdout, error: err, stderr: stderr});
    });
});

app.all("/info", function(req, res) {
    child = exec("amixer sget Master | grep '%]' && xbacklight -get", function(error, stdout, stderr) {
        res.header("Content-Type", "text/javascript");
        var volume = stdout.split("%]");
        volume = volume[0].split("[");
        volume = volume[1];

        var backlight = stdout.split(/\[o(?:n|ff)\]/); // Matches [on] or [off]

        // Unmute the speakers
        if(stdout.indexOf("[off]") != -1) {
            exec("amixer sset Master unmute");
        }

        backlight = backlight[backlight.length-1].trim();
        backlight = backlight.split(".");
        backlight = backlight[0] || 0;

        var data = {
            volume: volume,
            backlight: backlight,
        };

        res.send(req.query.callback + '(' + JSON.stringify(data) + ')');
    });
});

/**
 * Handles all other requests by sending informations about the server
 */
app.get(/^\/(.*)/, function(req, res) {
    res.header("Content-Type", "text/javascript");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send({status: 'Running', driver: config.connection_driver, port: config.port});
});

app.listen(config.port, function () {
    console.log('Listening on port ' + config.port);

    /**
     * If certified mode is enabled, we can use the command line as an
     * interpreter manage SMS on the client device
     */
    if(config.certified) {
        console.log('> SMS command line, type `help` for more information.');

        // Command line listener
        process.openStdin().addListener("data", cmd.parse_cmd);
    }
});
