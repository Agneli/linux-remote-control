$(document).ready(function() {
    navigator.custom_commands = new Custom_Commands();
    navigator.custom_commands.refresh_view();
});

/*
 * Custom commands are stored as strignified JSON object in localStorage.
 */
function Custom_Commands() {
    Local_Storage.apply(this);
    this.localStorage_key = 'custom_commands';
}

Custom_Commands.prototype = new Local_Storage();

Custom_Commands.prototype.refresh_view = function() {
    // Load custom commands into the HTML view
    var custom_commands = this.all();
    var self = this;

    $('#custom-commands .custom-commands .scroll').empty();

    for (var index in custom_commands) {
        var custom_command = custom_commands[index];
        $('#custom-commands .custom-commands .scroll')
                .append('<div class="line color1-dark">' +
                    '<a href="#!" class="left link-custom-command" data-command="' + encodeURI(custom_command.cmd) + '">' + custom_command.name + '</a>' +
                    '<a href="#!" class="w20 right trash" data-index="' + index + '"><i class="fa fa-trash-o"></i></a>' +
                '</div>');
    }

    // Refresh events
    $("#custom-commands .custom-commands a[data-command]").click(function() {
        $.get(
            "http://" + navigator.host + ":" + port + "/lrc",
            {cmd: decodeURI($(this).data("command"))},
            function(response) {
                if(response.stdout !== '') {
                    alert(response.stdout);
                }
            }
        );
    });

    $("#custom-commands .custom-commands a.trash").click(function() {
        // TODO : This should be translated
        if (confirm("Delete command. Are you sure ?")) {
            self.remove($(this).data('index'));
            self.refresh_view();
            responsive_layout('#custom-commands');
        }
    });
};

Custom_Commands.prototype.add = function(name, command) {
    var custom_command = {
        name: name,
        cmd: command
    };

    this.append(custom_command);
};
