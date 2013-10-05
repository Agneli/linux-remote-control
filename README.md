# Linux Remote Control
Turn any device into a complete remote control for your GNU/Linux.


### How to Install

1. Download this repository and unzip
```bash
unzip linux-remote-control-master.zip
```

2. Make a .deb package of the project
```bash
dpkg-deb -b linux-remote-control-master/ lrc.deb
```

3. Install .deb package
```bash
sudo dpkg -i lrc.deb
```

4. Move /opt/lrc-client directory to your device or to directory of your choice (if you prefer you can leave here)
```bash
sudo mv /opt/lrc-client your-directory
```

5. Start lrc-server
```bash
node /opt/lrc-server/lrc.js
```

6. Open the index.html of your-directory/lrc-client in a browser, add your server and have fun

### Bugs
The project still has some bugs that you can fix.

- Improvements in english texts;
- Forward and backward music from the slider;
- Click by tapping the touchpad;
- Move mouse relative to current cursor position;
- Fix bug of the crazy volume in slider;
- Fix bug of the crazy backlight in slider;
- Organize and modularize my dirty Javascript =/;
- Start lrc-server (node /opt/lrc-server/lrc.js) with computer boot;
- Get screen resolution of the server with node.js.

### License
GNU GPL