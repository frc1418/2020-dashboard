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

NetworkTables.addKeyListener('/components/launcher/flywheel_rpm', (_, value, __) => {
    launcherRPM.innerText = value + " RPM";
});

function toggleVisiblity(hidden, ...nodes) {
    for (let node of nodes) {
        if (hidden) {
            node.classList.add('hidden');
        } else {
            node.classList.remove('hidden');
        }
    }
}