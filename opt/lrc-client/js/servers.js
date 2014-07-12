// LocalStorage ________________________________________________________________

// Stores information about the servers to be controlled
if (localStorage.serverCount === undefined) {
    // TODO : This should be translated
    $("#msg-server").html("Click on 'Add Server'");
}

function server(id, name, ip, status) {
    this.id = id;
    this.name = name;
    this.ip = ip;
    this.status = status;
}

function createNewServer(d, n, i, s) {
    var createdServer = new server(d, n, i, s);
    if (localStorage.serverCount === undefined) {
        localStorage.setItem("serverCount", 0);
    }
    var serverSize = parseInt(localStorage.serverCount) + 1;
    commitToStorage(serverSize, createdServer);
}

function commitToStorage(objectCount, newObject) {
    // The unique key of the object:
    var item = "server_" + objectCount;
    localStorage.setItem("serverCount", objectCount);

    // Put the object into storage
    localStorage.setItem(item, JSON.stringify(newObject));

    // Create Markup
    createMarkup(newObject);
}

//Add server link to HTML
function createMarkup(server) {
    if (server.status !== "off") {
        $("#servers").append('<a id="' + server.name.replace(" ", "-") + '" class="line dark-blue server" data-page="menu" href="#!" data-direction=\'{"from":"right","to":"left"}\' data-server=\'{"id":"' + server.id + '", "ip":"' + server.ip + '", "name": "' + server.name + '"}\'><span>' + server.name + '</span><div class="w20 right"><i class="fa fa-chevron-right"></i></div></a>');
    }
}

$(function() {
    $("#save").click(function() {
        if (localStorage.serverCount === undefined) {
            var id = 1;
        } else {
            id = 1 + parseInt(localStorage.getItem("serverCount"));
        }
        var name = $("#name").val();
        var ip = $("#ip").val();
        var status = "on";
        createNewServer(id, name, ip, status);
        //return false;
        location.reload();
    });

    var serverCount = localStorage.getItem("serverCount");
    for (i = 1; i <= serverCount; i++)
    {
        //var number = parseInt(i) + 1;
        var server = jQuery.parseJSON(localStorage.getItem("server_" + i));
        createMarkup(server);
    }

    // Clear fields
    $("#cancel").click(function() {
        $(".fields input").val("");
    });

});

// Delete (off) Server
$(function() {
    $("#delete-server").click(function() {
        // TODO : This should be translated
        if (confirm("Delete server. Are you sure ?")) {
            var svr = JSON.stringify(localStorage.getItem("server_" + id));
            svr = svr.replace("on", "off");
            localStorage.setItem("server_" + id, JSON.parse(svr));
            location.reload();
        }
    });
});
