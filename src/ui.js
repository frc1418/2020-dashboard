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
    } else {
        NetworkTables.putValue('/components/launcher/flywheel_rpm', 100);
        setInterval(() => {
            let current = NetworkTables.getValue('/components/launcher/flywheel_rpm');
            NetworkTables.putValue('/components/launcher/flywheel_rpm', current + 1);
        }, 10);
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
    var target = 1000;
    var redDistance = 500;
    launcherRPM.textContent = value + " RPM";

    //sets text color to a color on an hsv gradient between red (0, 100, 90) and green (120, 100, 94)
    let [r, g, b] = sampleHSVGradient(target, redDistance, value)
    launcherRPM.style.color = 'rgb(' + r + ' , ' + g + ' , ' + b + ')'
});

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