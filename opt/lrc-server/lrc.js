// Required stuff
var     app = require("express")(),
        sys = require("sys"),
        exec = require("child_process").exec,
        config = require("./configuration.js").config,
        music_manager = require("./lib/music.js").drivers[config.music_driver],
        cmd = require("./lib/cmd.js"),
        connection = require("./lib/connection.js").drivers[config.connection_driver],
        WebSocketServer = require('ws').Server;

var actions = {
    info: function(parameters, callback) {
        exec("amixer sget Master | grep '%]' && xbacklight -get", function(error, stdout, stderr) {
            var volume = stdout.split("%]");
            volume = volume[0].split("[");
            volume = volume[1];

            var backlight = stdout.split(/\[o(?:n|ff)\]/); // Matches [on] or [off]

            // Unmute the speakers if necessary
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

            callback(data);
        });
    },
    music_info: function(parameters, callback) {
        exec(music_manager.infos, function(error, stdout, stderr) {
            var infos = music_manager.parse_infos(stdout);
            if(!isNaN(infos.elapsed) && !isNaN(infos.duration)) {
                infos["elapsed-formatted"] = Math.floor(infos.elapsed/60) + ':' + (infos.elapsed % 60 < 10 ? '0' : '') + (infos.elapsed % 60);
                infos["duration-formatted"] = Math.floor(infos.duration/60) + ':' + (infos.duration % 60 < 10 ? '0' : '') + (infos.duration % 60);
                infos["elapsed-percent"] = infos.elapsed/infos.duration*100;
            }
            callback({music: infos});
        });
    },
    music: function(parameters, callback) {
        if ('action' in parameters && parameters.action in music_manager) {
            var command = music_manager[parameters.action];

            if (typeof command == 'string') {
                exec(command);
                callback(null)
            } else if (typeof command == 'function') {
                command(music_manager, exec, parameters.args || {});
                callback(null);
            } else {
                callback({error: "command not supported by driver " + music_manager.name});
            }
        } else {
            callback({error: "undefined action for driver " + music_manager.name});
        }
    },
    // Execute an arbitrary command line
    lrc: function(parameters, callback) {
        var command = parameters.cmd || '';
        exec(command, function(err, stdout, stderr) {
            callback({stdout: stdout, error: err, stderr: stderr});
        });
    },
    /*
     * Mouse click, short prefix for performence issues
     * parameters.b: {1: left click, 2: middle click, 3: right click}
     */
    c: function(parameters, callback) {
        exec('xdotool click ' + parameters.b, new Function);
        callback(null);
    },
    // Mouse move
    m: function(parameters, callback) {
        x = parseInt(parameters.x) * config.mouse_speed.x;
        y = parseInt(parameters.y) * config.mouse_speed.y;
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
        exec('xdotool mousemove_relative -- ' + x + ' ' + y, new Function);
        callback(null);
    },
    // Mouse scroll
    s: function(parameters, callback) {
        var button = parameters.s < 0 ? 4 : 5;
        exec('xdotool click ' + button, new Function);
        callback(null);
    },
};

// Init the connection with the right server object
var servers = {
    HTTP: app,
    WebSocket: WebSocketServer,
    Bluetooth: null
};
connection(servers, actions, config);

/**
 * Handles all other requests by sending informations about the server
 */
app.get(/.*/, function(req, res) {
    res.header("Content-Type", "text/javascript");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send({status: 'Running', driver: config.connection_driver, port: config.port});
});

/**
 * If certified mode is enabled, we can use the command line as an
 * interpreter manage SMS on the client device
 */
if(config.certified) {
    console.log('> SMS command line, type `help` for more information.');

    // Command line listener
    process.openStdin().addListener("data", cmd.parse_cmd);
}
