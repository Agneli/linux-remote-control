exports.parse_cmd = function(command) {
    command = command.toString().trim();

    var arguments = '';
    var action = command.substr(0, command.indexOf(' ')) || command;

    if(command.indexOf(' ') !== -1) {
        arguments = command.substr(command.indexOf(' ') + 1);
    }

    if(action in actions) {
        actions[action](arguments.split(' '));
    } else if(action) {
        console.log(action + ': unknown command');
    }
}

var actions = {
    help: function(arguments) {
        if(arguments.length && arguments[0].length) {
            if(arguments[0] in help) {
                output(help[arguments[0]]);
            } else {
                output("No documentation found for " + arguments[0]);
            }
            return;
        }

        output('Available commands are :');
        for(action in actions) {
            output('- ' + action);
        }
        output('Type `help command` for more informations');
    },
    send: function(arguments) {
        output('Not implemented yet. Come back later.');
    },
    list: function(arguments) {
        output('Not implemented yet. Come back later.');
    }
};

var help = {
    help: "You are kidding, right ? That's the command you are using.",
    send: "Usage : send NUMBER MESSAGE",
    list: "Usage : list [NUMBER]\n" +
          "Lists all the sms messages received (optionnally from NUMBER only).\n" +
          "NUMBER might be a number or a regex to filter phone numbers."
};

function output(string) {
    strings = string.split('\n');
    for(index in strings) {
        console.log('> ' + strings[index]);
    }
}
