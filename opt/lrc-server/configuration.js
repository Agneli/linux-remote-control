exports.config = {
    // Available drivers : rhythmbox, moc
    music_driver: "rhythmbox",
    port: 3000,
    // Mouse speed multiplicator
    mouse_speed: {
        x: 2,
        y: 2
    },
    // Available drivers : HTTP, WebSocket
    connection_driver: 'HTTP',
    // Indicates if the client app is installed as a certified app
    certified: false
};
