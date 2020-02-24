const EventEmitter = require('events');

class Connection extends EventEmitter {
    states = ['disconnected', 'connected', 'loading-failed', 'loaded', 'camera-failure']

    _status = 'disconnected';

    set status(value) {
        if (this.states.includes(value)) {
            let old = this._status;
            this._status = value;
            this.emit('status-change', this.status, old, old !== value);
        }
    }

    get status() {
        return this._status;
    }
}

const connection = new Connection();

const cameraLink1 = 'http://10.14.18.2:1181';
const cameraLink2 = 'http://10.14.18.2:1182';
const limelightLink = 'http://10.14.18.11:5801';

const cameras = [
    new Camera(cameraLink1),
    new Camera(cameraLink2),
    new Camera(limelightLink)
];

let initialLoad = true;
NetworkTables.addRobotConnectionListener(onRobotConnection, true);

/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
    if (connection.status == 'connected'){
        return;
    }

    connection.status = connected ? 'connected' : 'disconnected';
    var text = connected ? 'Robot connected!' : 'Robot disconnected.';
    console.log(text);
    
    if (connection.status === 'connected' || initialLoad) {
        initialLoad = false;
        
        loadComponents();
        
    }
}

function loadComponents() {
    loadCameras();
}

function loadCameras() {
    let promises = cameras.map(camera => camera.loadCameraStream());

    Promise.all(promises).then(successess => {
        successess = successess.map(success => !success ? connection.status = 'loading-failed' : 'success');

        if (successess.every(elem => elem)) connection.status = 'loaded';
    }).catch(_ => connection.status = 'loading-failed');  // Component errored out
}
