const cameraLink1 = '10.14.18.2:1181';
const cameraLink2 = '10.14.18.2:1182';

const cameras = [
    new Camera(document.getElementById('camera1'), cameraLink1, '../images/spinner.svg', '../images/error.svg'),
    new Camera(document.getElementById('camera2'), cameraLink2, '../images/spinner.svg', '../images/error.svg')
];

const statusElement = document.getElementById('status');

const status = {
    _status: 'disconnected',
    set state(value) {
        if (this[value]) {
            this._status = value;
            statusElement.style.backgroundColor = this[value] != undefined ? this[value] : this.disconnected;
        }
    },
    get state() {
        return this._status;
    },
    'disconnected': '#D32F2F',
    'connected': 'rgb(255, 217, 0)',
    'loading-failed': '#FF8300',
    'loaded': '#42C752'
}

NetworkTables.addRobotConnectionListener(onRobotConnection, true);

/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
    status.state = connected ? 'connected' : 'disconnected';
    var text = connected ? 'Robot connected!' : 'Robot disconnected.';
    console.log(text);
    
    if (status.state === 'connected') {
        loadComponents();
    }
}

function loadComponents() {
    loadCameras();
}

function loadCameras() {
    let promises = cameras.map(camera => camera.loadCameraStream());

    Promise.all(promises).then(successess => {
        status.state = 'loaded';
        successess.forEach(success => !success ? status.state = 'loading-failed' : '');
    }).catch(_ => status.state = 'loading-failed');  // Component errored out
}
