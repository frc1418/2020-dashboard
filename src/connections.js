const cameraLink1 = '10.14.18.2:1181';
const cameraLink2 = '10.14.18.2:1182';

const cameras = [
  new Camera(document.getElementById('camera1'), cameraLink1, '../images/spinner.svg', '../images/error.svg'),
  new Camera(document.getElementById('camera2'), cameraLink2, '../images/spinner.svg', '../images/error.svg')
];

NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// ipc.send('connect', '127.0.0.1');
/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
  var state = connected ? 'Robot connected!' : 'Robot disconnected.';
  console.log(state);
  loadCameras();
}

function loadCameras() {
  for (let camera of cameras) {
    camera.loadCameraStream().then((success) => {
      if (success) {
        console.log('Camera: ' + (cameras.indexOf(camera)) + ' loaded successfully');
      }
    });
  }
}
