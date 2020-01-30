const Split = require('split.js');

let sizes = localStorage.getItem('split-sizes');

if (sizes) {
    sizes = JSON.parse(sizes);
} else {
    sizes = [50, 50]; // default sizes
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

const indicatorColors = {
    'disconnected': '#D32F2F',
    'connected': 'rgb(255, 217, 0)',
    'loading-failed': '#FF8300',
    'loaded': '#42C752'
}

connection.on('status-change', (status, _, __) => {
    statusElement.style.backgroundColor = indicatorColors[status];

    if (status === 'disconnected') {
        panels.forEach(panel => panel.classList.remove('visible'));
    }
});

NetworkTables.addKeyListener('/robot/mode', (_, value, __) => {
    toggleVisiblity(
        value != 'disabled', 
        refreshButton, eye
    );

    // TODO: Decide whether or not to hide extras and tuning buttons in enabled
}, true);

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
    console.log(value)
    let stateInfo = targetStates[value];
    targetMessage.textContent =  stateInfo.description; //stateInfo.description;
    targetMessage.style.fill = stateInfo.color;
    targetMessage.style.stroke = stateInfo.color;
    for (let element of document.getElementsByClassName('target')) {
        element.style.stroke = stateInfo.color;
    }
    if(value != 1){
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

NetworkTables.addKeyListener('/components/launcher/flywheel_rpm', (_, value, __) => {
    launcherRPM.innerText = value + " RPM";
});

function displayClass(classname, visible){
    if(visible){
        for (let element of document.getElementsByClassName(classname)) {
            element.style.visibility = 'visible'
        }
    } else{
        for (let element of document.getElementsByClassName(classname)) {
            element.style.visibility = 'hidden'
        }
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