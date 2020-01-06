# 2020 Dashboard
[Robot Code](https://github.com/frc1418/2020-robot) | **Dashboard** | [Vision](https://github.com/frc1418/2020-vision)

> 1418's 2020 driving dashboard, built off of the [FRC Dashboard](https://github.com/FRCDashboard/FRCDashboard) web driving dashboard framework.

## Setup
### Dependencies
If you're going to be using the preferred method of using the dashboard (as an application through Electron), you'll also need:
* [`nodejs`](https://nodejs.org) & [`npm`](https://npmjs.com)
    * If you don't have permission to install these, see [this gist](https://gist.github.com/isaacs/579814) for a workaround.
* Node dependencies (to install, `cd` into dashboard directory and run `npm install`)

### Configuration
* The code for updating the UI with networktables values is in `ui.js`. Our NetworkTables key names are used, but you'll need to change them to match those used in your team's robot code for them to affect anything on your robot.

#### Configuring Camera feed
In order to run the camera, you must start an `mjpg-streamer` server on the RoboRIO. To install `mjpg-streamer`:

1. Download [this installer script](https://raw.githubusercontent.com/robotpy/robotpy-wpilib/master/installer/installer.py) from GitHub. This script is for downloading and installing packages to the RoboRIO.
2. While in the directory where you downloaded the installer script, run:

    Windows:

        py -3 installer.py download-opkg mjpg-streamer
        py -3 installer.py install-opkg mjpg-streamer

    Mac/Linux (using bash):

        python3 installer.py download-opkg mjpg-streamer
        python3 installer.py install-opkg mjpg-streamer

3. Update `style.css` to use the IP of your live camera feed. Usually this is something like `roborio-XXXX-frc.local:5800/?action=stream`, where `XXXX` is your team's number.

You can also use wpilib's [cscore](https://github.com/wpilibsuite/allwpilib/tree/master/cscore) library to host a camera stream from the robot. The bindings that we use for python exist in [robotpy-cscore](https://github.com/robotpy/robotpy-cscore).

## Running
1. Connect to your robot's network if you haven't already. (If you're just testing the dashboard and don't currently need to use it with your robot, you can skip this step.)
2. If you are able to use node/npm, use the section below labeled "Using dashboard as Application." If not, use the section titled "Using dashboard through web browser."

### Using dashboard as Application
The preferred method of using the dashboard is to run it using the [Electron](http://electron.atom.io) framework. Your dashboard will be its own application, and will be easy to manipulate.

While in the dashboard directory, run:

    npm start

This will start a NodeJS server and open the dashboard application. Note that you don't have to close and reopen the application every time you make a change, you can just press `Ctrl+R` (`Cmd+R` on Mac) to refresh the application.

## Authors
* Team 1418

## Modifying
In-season, use of this software is restricted by the FRC rules. After the season ends, the [MIT License](LICENSE) applies instead.