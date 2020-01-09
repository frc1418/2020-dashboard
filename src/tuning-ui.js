
const ntEdit = {
    keyInput: document.getElementById('nt-key-editor'),
    valueInput: document.getElementById('nt-value-editor'),
    outputValue: document.getElementById('output-value'),
    setButton: document.getElementById('set-value'),
    getButton: document.getElementById('get-value'),
    hiddenKey: document.getElementById('hidden-key')
}

const tuningButton = document.getElementById('tuning-button');
const table = document.getElementById('nt-table');
const tuningTab = document.getElementById('tuning');

let ntloaded = false;

tuningButton.addEventListener('click', () => {
    if (!NetworkTables.isRobotConnected()) {
        tuningTab.classList.remove('visible')
        alert('Error: Robot is not connected!');
        return;
    }

    if (!ntloaded) {
        ntloaded = true;
        for (let key of NetworkTables.getKeys()) {
            createLivedataKey(key);
        }

        // Create rows for any network tables keys that were not sent immediately 
        // after connecting to the robot
        NetworkTables.addGlobalListener((key, _, isNew) => {
            if (isNew) {
                createLivedataKey(key);
            }
        })
    }

    tuningTab.classList.toggle('visible');
});

function createLivedataKey(key) {
    let row = createRow(key);
        
    NetworkTables.addKeyListener(key, function tuningTable(_, value, _) {
        row.value.textContent = value;
    }, true);
    
    table.append(row.elem);
}

ntEdit.setButton.addEventListener('click', () => {
    if (ntEdit.keyInput.value.length === 0) return;
    NetworkTables.removeKeyListener(ntEdit.hiddenKey.textContent, 'tuning');

    NetworkTables.putValue(ntEdit.keyInput.value, ntEdit.valueInput.value);
    ntEdit.outputValue.textContent = NetworkTables.getValue(ntEdit.keyInput.value);
})

ntEdit.getButton.addEventListener('click', () => {
    if (ntEdit.keyInput.value.length === 0) return;
    NetworkTables.removeKeyListener(ntEdit.hiddenKey.textContent, 'tuning');

    NetworkTables.addKeyListener(ntEdit.keyInput.value, function tuning(key, value, _) {
        ntEdit.outputValue.textContent = value;
        ntEdit.hiddenKey.textContent = key;
    }, true)
})

function createRow(keyText) {
    let row = document.createElement('tr');
    let key = document.createElement('td');
    key.textContent = keyText;

    let value = document.createElement('td');

    row.append(key, value);

    return { elem: row, key, value };
}