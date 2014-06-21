$(document).ready(function() {
    navigator.custom_commands = new Custom_Commands();
    navigator.custom_commands.refresh_view();
});

/*
 * Custom commands are stored as strignified JSON object in localStorage.
 */
function Custom_Commands() {
    this.localStorage_key = 'custom_commands';
}

Custom_Commands.prototype.refresh_view = function() {
    // Load custom commands into the HTML view
    var custom_commands = this.all();
    var self = this;

    $('#custom-commands .custom-commands .scroll').empty();

    for(var index in custom_commands) {
        var custom_command = custom_commands[index];
        $('#custom-commands .custom-commands .scroll')
            .append('<div class="line dark-blue">' +
                '<a href="#!" style="width: 70%" class="left" data-command="' + encodeURI(custom_command.cmd) + '">' + custom_command.name + '</a>' +
                '<a href="#!" class="trash w20 right" data-index="' + index + '"></a>' +
            '</div>');
    }

    // Refresh events
    $("#custom-commands .custom-commands a[data-command]").click(function() {
        $.get("http://" + host + ":" + port + "/lrc", {cmd: decodeURI($(this).data("command"))});
    });

    $("#custom-commands .custom-commands a.trash").click(function() {
        self.remove($(this).data('index'));
        self.refresh_view();
        responsive_layout('#custom-commands');
    });
};

Custom_Commands.prototype.add = function(name, command) {
    var custom_command = {
        name: name,
        cmd: command
    };
    custom_commands = this.all();

    custom_commands.push(custom_command);

    this.save(custom_commands);
};

/**
 * Returns a list of custom commands
 */
Custom_Commands.prototype.all = function() {
    return jQuery.parseJSON(localStorage.getItem(this.localStorage_key) || '[]');
};

Custom_Commands.prototype.save = function(custom_commands) {
    localStorage.setItem(this.localStorage_key, JSON.stringify(custom_commands));
};

Custom_Commands.prototype.remove = function(index) {
    var custom_commands = this.all();

    custom_commands.splice(index, 1);

    this.save(custom_commands);
};
