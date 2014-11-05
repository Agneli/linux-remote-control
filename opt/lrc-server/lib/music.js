exports.drivers = {};

// Rhythmbox Driver
exports.drivers.rhythmbox = {
    name: "Rhythmbox",
    infos: "rhythmbox-client --print-playing-format='%ta;%at;%tt;%te;%td;'",
    parse_infos: function(stdout) {
        info = stdout.split(";");
        return {
            artist: escape(info[0]),
            album: escape(info[1]),
            title: escape(info[2]),
            elapsed: info[3],
            duration: info[4],
            state: "unknown",
            play_symbol: escape('<i class="fa fa-play"></i>')
        };
    },
    toggle_play: "export DISPLAY=:0; xdotool key XF86AudioPlay",
    stop: "export DISPLAY=:0; xdotool key XF86AudioStop",
    previous: "export DISPLAY=:0; xdotool key XF86AudioPrev",
    next: "export DISPLAY=:0; xdotool key XF86AudioNext",
    seek: null // Doesn't seem to be possible with rhythmbox
};

// moc
exports.drivers.moc = {
    name: "moc",
    infos: "mocp -Q '%artist;%album;%song;%cs;%ts;%state;'",
    parse_infos: function(stdout) {
        info = stdout.split(";");
        return {
            artist: escape(info[0]),
            album: escape(info[1]),
            title: escape(info[2]),
            elapsed: parseInt(info[3]),
            duration: parseInt(info[4]),
            state: escape((info[5] || '').toLowerCase()),
            play_symbol: escape(info[5] == 'PAUSE' ? '<i class="fa fa-play"></i>' : '<i class="fa fa-pause"></i>')
        };
    },
    toggle_play: "mocp -G",
    stop: "mocp -P",
    previous: "mocp -r",
    next: "mocp -f",
    // proportion is a float, between 0 and 1
    seek: function(driver, exec, args) {
        var self = driver;

        exec(self.infos, function(error, stdout, stderr) {
            var infos = self.parse_infos(stdout);
            var proportion = args.proportion || infos.elapsed/infos.duration;
            var seek_to = infos.duration * proportion;
            //console.log(seek_to);
            exec("mocp -k " + parseInt(seek_to - infos.elapsed));
        });
    }
};
