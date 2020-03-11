const Split = require('split.js');

let sizes = localStorage.getItem('split-sizes');
let cameraStream1 = localStorage.getItem('camera-stream-1');
let cameraStream2 = localStorage.getItem('camera-stream-2');

if (sizes) {
    sizes = JSON.parse(sizes);
} else {
    sizes = [50, 50]; // default sizes
}

if (cameraStream1) {
    cameraStream1 = JSON.parse(cameraStream1);
    cameraStream2 = JSON.parse(cameraStream2);
} else {
    cameraStream1 = 0;
    cameraStream2 = 1;
}

const split = Split(['#camera1', '#camera2'], {
    sizes: sizes,
    gutterAlign: 'center',
    gutterSize: 5,
    onDragEnd: function(sizes) {
         localStorage.setItem('split-sizes', JSON.stringify(sizes));
    }
});

const panels = Array.from(document.getElementsByClassName('panel'));

const tuningPanelButton = document.getElementById('tuning-button');
const autoPanelButton = document.getElementById('auto-button');
const extrasPanelButton = document.getElementById('extras-button');
const refreshButton = document.getElementById('refresh');
const eye = document.getElementById('eye');
const statusElement = document.getElementById('status');
const launcherRPM = document.getElementById('launcher-rpm');
const targetMessage = document.getElementById('target-message');
const gyroArm = document.getElementById('gyro-arm');
const controlPanelImg = document.getElementById('controlPanelImg');
const cameraRefresh1 = document.getElementById('camera1-refresh');
const cameraRefresh2 = document.getElementById('camera2-refresh');
const ballsIndicatorBar = document.getElementsByClassName("balls-bar");
const messageButton = document.getElementById("message-button");
const messageText = document.getElementById("message-text");
const pitchAngleText = document.getElementById('target-pitch-angle');
const camera1OptionSelect = document.getElementById("camera1-options-select");
const camera2OptionSelect = document.getElementById("camera2-options-select");
const compressorStatus = document.getElementById('compressor-status');

cameras[cameraStream1].setParent(document.getElementById('camera1'));
cameras[cameraStream2].setParent(document.getElementById('camera2'));

const indicatorColors = {
    'disconnected': '#D32F2F',
    'connected': 'rgb(255, 217, 0)',
    'loading-failed': '#FF8300',
    'loaded': '#42C752'
}

function showPanel(elem, id) {
    // Hide other panels first
    panels.filter((elem) => elem.id !== id).forEach((elem) => elem.classList.remove('visible'));
    elem.classList.toggle('visible');
}

connection.on('status-change', (status, _, __) => {
    statusElement.style.backgroundColor = indicatorColors[status];

    if (status === 'disconnected') {
        panels.forEach(panel => panel.classList.remove('visible'));
    }
});

function refreshCamera(camera) {
    if (!NetworkTables.isRobotConnected()) {
        alert('Error: Robot is not connected!');
        return;
    }
    cameras[camera].loadCameraStream();
}

cameraRefresh1.addEventListener('click', () => {
    refreshCamera(camera1OptionSelect.selectedIndex);
});

cameraRefresh2.addEventListener('click', () => {
    refreshCamera(camera2OptionSelect.selectedIndex);
});

camera1OptionSelect.selectedIndex = cameraStream1;
//if preset camera is intake, dull camera
if (cameraStream1 == 0) {
    camera1.classList.add('back-camera');
}
camera1OptionSelect.addEventListener('change', () => {
    cameras[camera1OptionSelect.selectedIndex].setParent(document.getElementById('camera1'));
    cameras[camera1OptionSelect.selectedIndex].loadCameraStream();
    localStorage.setItem('camera-stream-1', JSON.stringify(camera1OptionSelect.selectedIndex));
    console.log(camera1OptionSelect.selectedIndex);
    if (camera1OptionSelect.selectedIndex == 0) {
        camera1.classList.add('back-camera');
    } else {
        camera1.classList.remove('back-camera');
    }
});

camera2OptionSelect.selectedIndex = cameraStream2;
//if preset camera is intake, dull camera
if (cameraStream2 == 0) {
    camera2.classList.add('back-camera');
}
camera2OptionSelect.addEventListener('change', () => {
    cameras[camera2OptionSelect.selectedIndex].setParent(document.getElementById('camera2'));
    cameras[camera2OptionSelect.selectedIndex].loadCameraStream();
    localStorage.setItem('camera-stream-2', JSON.stringify(camera2OptionSelect.selectedIndex));
    //dulls camera element if selected stream is intake camera
    if (camera2OptionSelect.selectedIndex == 0) {
        camera2.classList.add('back-camera');
    } else {
        camera2.classList.remove('back-camera');
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

messageButton.addEventListener('click', () => {
    var messages = [
        "You're doing great!",
        "I think we're winning!",
        "Go 1418!",
        "Our robot is the best!",
        "I think I love you",
        "Detroit, here we come!",
        "Use the force and win!",
        "Do, there is neither do not nor try",
        "Robotics is fun!",
        "Robotics IS a sport!",
        "Victory we most certainly have!",
        "History goes to the (vae) Victors!",
        "Sarah is totally the best captain!",
        "Sofia is totally the best captain!",
        "Tahaseen is totally the best captain!",
        "Steven is our Knight is shining armor!",
        "Jesus loves you",
        "You're a terrible driver!",
        "Andrew is the only real programmer",
        "It's not my fault the cameras don't work",
        "This message is brought to you by Cyclebar!",
        "This message is brought to you by Pizzaria Orso!",
        "This message is brought to you by Flippn' Pizza!",
        "This message is brought to you by Baroody Camps!",
        "This message is brought to you by Dixie!",
        "Our robot is more structurally sound than our school!",
        "The librarians hate us, but that's okay!",
        "Yahweh loves you",
        "The Fitness Gram Pacer Test is a multistage aerobic capacity test...",
        "This dashboard has been invaded by goose!",
        "iBoss knows where you live!",
        "Shrek is love, Shrek is life.",
        "614's autonomous is awesome!"
    ]
    messageText.textContent = messages[getRandomInt(0, messages.length-1)];
    messageButton.style.visibility = "hidden"
    setTimeout(() => {
        messageText.textContent = "";
        messageButton.style.visibility = "visible"
    }, 1000)

});

NetworkTables.addKeyListener('/robot/mode', (_, value, __) => {
    toggleVisiblity(
        value != 'disabled', 
        refreshButton, eye, cameraRefresh1, cameraRefresh2
    );

    // TODO: Decide whether or not to hide extras and tuning buttons in enabled
}, true);

NetworkTables.addKeyListener('/align/angle', (_, value, __) => {
    value = Math.round(parseInt(value));
    if (NetworkTables.getValue('/robot/flipped') == true) {
        if (value >= 180) {
            value = parseInt(value) - 180;
        } else{
            value = parseInt(value) + 180;
        }
    }
    gyroArm.style.transform = 'rotate(' + value + 'deg)';
    document.getElementById('gyro-number').textContent = value + "º";
});

const targetStates = {
    0: {
        description: "No target",
        color: 'rgb(230, 0, 0)',
        displayID: 'target-X'
    },
    1: {
        description: 'Target Located',
        color: 'rgb(235, 215, 0)',
        displayID: ''
    },
    2: {
        description: 'Target Locked',
        color: 'rgb(0, 235, 0)',
        displayID: 'target-check'
    }
}

NetworkTables.addKeyListener('/limelight/target_state', (_, value, __) => {
    let stateInfo = targetStates[value];
    targetMessage.textContent =  stateInfo.description;
    targetMessage.style.fill = stateInfo.color;
    targetMessage.style.stroke = stateInfo.color;
    for (let element of document.getElementsByClassName('target')) {
        element.style.stroke = stateInfo.color;
    }
    if(value != 1) {
        displayClass(stateInfo.displayID, true)
    } else{
        displayClass(targetStates["0"].displayID, false)
        displayClass(targetStates["2"].displayID, false)
    }
    if (value == 0) {
        displayClass(targetStates["2"].displayID, false)
    } else if (value == 2) {
        displayClass(targetStates['0'].displayID, false)
    }

});

NetworkTables.addKeyListener('/components/launcher/filtered_rpm', (_, value, __) => {
    value = Math.round(parseInt(value));
    
    var target = NetworkTables.getValue('/components/launcher/target_rpm');
    var redDistance = 500;
    launcherRPM.textContent = value + " RPM";

    //sets text color to a color on an hsv gradient between red (0, 100, 90) and green (120, 100, 94)
    let [r, g, b] = sampleHSVGradient(target, redDistance, value)
    launcherRPM.style.color = 'rgb(' + r + ' , ' + g + ' , ' + b + ')'
});

NetworkTables.addKeyListener('/Controllers/panelSpinner/isSpinningRotation', (_, value, __) => {
    if (value) {
        controlPanelImg.classList.add('spinningRot');
    } else {
        controlPanelImg.classList.remove('spinningRot');
    }
});

NetworkTables.addKeyListener('/Controllers/panelSpinner/isSpinningPosition', (_, value, __) => {
    if (value) {
        controlPanelImg.classList.add('spinningPos');
    } else {
        controlPanelImg.classList.remove('spinningPos');
    }
});

NetworkTables.addKeyListener('/robot/ntSolenoid_state', (_, value, __) => {
    if (value == true) {
        controlPanelImg.classList.add('expandPanel');
        setTimeout(() => {
            controlPanelImg.style.transform = 'scale(1, 1)';
            controlPanelImg.classList.remove('expandPanel');
        }, 1000)
    } else {
        controlPanelImg.classList.add('shrinkPanel');
        setTimeout(() => {
            controlPanelImg.style.transform = 'scale(0.1, 0.1)';
            controlPanelImg.classList.remove('shrinkPanel');
        }, 1000)
    }
});

NetworkTables.addKeyListener('/components/intake/ballsCollected', (_, value, __) => {
    for (let element of ballsIndicatorBar) {
        var height = 7.5 * value;
        var yValue = 37.5 - height;
        element.setAttribute('height', `${height}vw`);
        element.setAttribute('y', `${yValue}vw`)
    }
});

NetworkTables.addKeyListener('/limelight/ty', (_, value, __) => {
    value = ~~(parseFloat(value) * 1000) / 1000;
    
    //var target = NetworkTables.getValue('/components/launcher/target_rpm');
    var target = 2.2;
    var redDistance = 2;
    pitchAngleText.textContent = value + "˚";

    //sets text color to a color on an hsv gradient between red (0, 100, 90) and green (120, 100, 94)
    let [r, g, b] = sampleHSVGradient(target, redDistance, value)
    pitchAngleText.style.fill = 'rgb(' + r + ' , ' + g + ' , ' + b + ')'
});

NetworkTables.addKeyListener('/robot/compressor_status', (_, value, __) => {
    if (value) {
        compressorStatus.classList.remove('off');
        compressorStatus.textContent = 'Compressor: ON';
    } else {
        compressorStatus.classList.add('off');
        compressorStatus.textContent = 'Compressor: OFF';
    }
});

function displayClass(classname, visible) {
    if(visible) {
        for (let element of document.getElementsByClassName(classname)) {
            element.style.visibility = 'visible'
        }
    } else{
        for (let element of document.getElementsByClassName(classname)) {
            element.style.visibility = 'hidden'
        }
    }
}

function sampleHSVGradient(target, redDistance, value) {
    let h = Math.min(350, (120 + ((-120 / redDistance) * Math.abs(target - value))));
    let v = Math.min(94, (90 + Math.abs(4 + ((4 * Math.abs(target - value)) / -redDistance))));
    var [r, g, b] = hsvToRgb(h / 360, 1, v / 100)
    if (Math.abs(target - value) <= redDistance) {
        return [r, g, b];
    } else {
        return [255, 0, 0];
    }
}

function toggleVisiblity(hidden, ...nodes) {
    for (let node of nodes) {
        if (hidden) {
            node.classList.add('hidden');
        } else {
            node.classList.remove('hidden');
        }
    }
}

function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}
