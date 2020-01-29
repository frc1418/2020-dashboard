const extrasPanel = document.getElementById('extras')
const extrasButton = document.getElementById('extras-button');
const colorBox = document.getElementById('color-box');

extrasButton.addEventListener('click', () => {
    if (!NetworkTables.isRobotConnected()) {
        extrasPanel.classList.remove('visible')
        alert('Error: Robot is not connected!');
        return;
    }

    showPanel(extrasPanel, 'extras');
});

NetworkTables.addKeyListener('/robot/color', (_, value, __) => {
    if (extrasPanel.classList.contains('visible')) {
        colorBox.style.backgroundColor = `rgb(${value})`;
    }
});