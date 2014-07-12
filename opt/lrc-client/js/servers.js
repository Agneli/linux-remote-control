$(document).ready(function() {
    navigator.servers = new Servers();
    navigator.servers.refresh_view();
});

function Servers() {
    Local_Storage.apply(this);
    this.localStorage_key = 'servers';
}
Servers.prototype = new Local_Storage();

Servers.prototype.refresh_view = function() {
    $("#servers").empty()
                 .append('<div class="line center" id="msg-server"></div>');

    if(this.all().length) {
        for(var index in this.all()) {
            var server = this.all()[index];
            server.index = index;
            $("#servers").append('<a class="line dark-blue server" data-page="menu" href="#!" data-direction=\'{"from":"right","to":"left"}\' data-server=\'' + JSON.stringify(server) + '\'><span>' + server.name + '</span><div class="w20 right"><i class="fa fa-chevron-right"></i></div></a>');
        }

        // Refresh server click events
        $(".server").unbind('click').click(function() {
            navigator.host = $(this).data("server").ip;
            $("#server-name").html($(this).data("server").name);
            $("#delete-server").data("index", $(this).data("server").index);
        });

        pages_animations('#servers');
    } else {
        // TODO : This should be translated
        $("#msg-server").html("Click on 'Add Server'");
    }
    
    responsive_layout('#index');
};

// Events
$(function() {
    $("#save").click(function() {
        navigator.servers.append({
            name: $('#name').val(),
            ip: $("#ip").val(),
        });
        navigator.servers.refresh_view();
    });

    // Clear fields
    $("#cancel, #save").click(function() {
        $(".fields input").val("");
    });

    // Delete Server (removes it from localStorage)
    $("#delete-server").click(function() {
        // TODO : This should be translated
        if (confirm("Delete server. Are you sure ?")) {
            navigator.servers.remove($(this).data('index'));
            navigator.servers.refresh_view();
        }
    });
});
