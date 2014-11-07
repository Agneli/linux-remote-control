# Linux Remote Control
Turn any device into a complete remote control for your GNU/Linux.

## How to install lrc-client

### Firefox OS ![alt tag](http://linuxremotecontrol.com/img/firefox-icon.png)

1 - Visit the app page on Firefox Marketplace for your device.

[https://marketplace.firefox.com/app/linux-remote-control](https://marketplace.firefox.com/app/linux-remote-control "Linux Remote Control")

2 - Click on Install button.

3 - [Install lrc-server](#how-to-install-lrc-server)

### Android ![alt tag](http://linuxremotecontrol.com/img/android-icon.png)

1 - Install Firefox 29 or higher on your Android.

[https://play.google.com/store/apps/details?id=org.mozilla.firefox](https://play.google.com/store/apps/details?id=org.mozilla.firefox "Firefox to Android")

2 - Visit the app page on Firefox Marketplace for your Android with Firefox.

[https://marketplace.firefox.com/app/linux-remote-control](https://marketplace.firefox.com/app/linux-remote-control "Linux Remote Control")

3 - Click on Install button.

4 - [Install lrc-server](#how-to-install-lrc-server)

## How to install lrc-server

1 - Download the lrc.deb package onto you GNU/Linux system.
```bash
wget http://www.linuxremotecontrol.com/lrc-ffos.deb
```

2 - Install .deb package.
```bash
sudo dpkg -i lrc-ffos.deb
```

3 - Start lrc-server.
```bash
node /opt/lrc-server/lrc.js
```
or
```bash
nodejs /opt/lrc-server/lrc.js
```

If an error occurs during installation of the package, run the following command.
```bash
sudo apt-get install -f
```
Or open .deb package by graphic interface (double click on the lrc-ffos.deb file)

## Developers

To test the developer version follow the steps below:

1 - Download this repository and unzip
```bash
unzip linux-remote-control-master.zip
```

2 - Open folder that the project was unzipped
```bash
cd linux-remote-control-master
```

3 - Move linux-remote-control-master/opt/lrc-client directory to your device or to directory of your choice (if you prefer you can leave here)
```bash
sudo mv linux-remote-control-master/opt/lrc-client your-directory/lrc-client
```

4 - Move linux-remote-control-master/opt/lrc-server directory to directory of your choice (we recommend /opt)
```bash
sudo mv linux-remote-control-master/opt/lrc-server /opt/lrc-server
```

5 - Install the dependences
```bash
sudo apt-get install nodejs xdotool xbacklight
```

6 - Start lrc-server
```bash
node /opt/lrc-server/lrc.js
```
or
```bash
nodejs /opt/lrc-server/lrc.js
```

7 - Open the index.html of your-directory/lrc-client in a browser (or in the browser of your device), add your server and have fun

### Configuration

Linux-remote-control will work out-of-the-box in most cases. However, if you wish to change the default settings (for instance, if you wish to use another music player than Rhythmbox), just modify the configuration file in /opt/lrc-server/node_modules/configuration.js

### Start the server on computer boot

If you wish to have the Linux Remote Control server to be always available, just add a cron job on reboot :

```bash
$ crontab -e
# Add this cron job
@reboot node /opt/lrc-server/lrc.js
```

### Firewall issues

The default ports for the server are 3000 for HTTP requests and 3001 for WebSockets. You might want to open those ports (at least when you are not on a public network) with tools such as `firewall-config`.

## Dependences

The Linux Remote Control depends on some softwares to work correctly. Bellow is a list of this softwares.

Installed with lrc.

- Node.js (Express) (to execute commands on GNU/Linux)
- Xdotool (to execute most commands, like play, pause, mute, etc.)
- Xbacklight (to control backlight)

Usually already installed on GNU/Linux.

- Totem Movie Player (to control the video)

One of the following music players.

- Rhythmbox
- moc

## Bugs
The project still has some bugs that you can fix.

- Click by tapping the touchpad;
- Organize and modularize my dirty Javascript =/;

## License
GNU GENERAL PUBLIC LICENSE V3
