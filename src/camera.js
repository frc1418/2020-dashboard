/**
 * Return a promise which resolves after a certain amount of time
 * @param {Integer} millis 
 */
async function sleep(millis) {
    return new Promise((resolve, _) => setTimeout(resolve, millis));
}

class Camera {
    /**
    * Function to be called when robot connects
    * @param {HTMLElement} parent
    * @param {String} cameraLink
    * @param {Integer} loadingImgId
    * @param {Integer} failedImgId
    */
    constructor(parent, cameraLink, loadingImgId, failedImgId) {
        this.container = parent.querySelector('.stream');
        this.crosshair = parent.querySelector('.crosshair');
        this.stream = cameraLink + '/?action=stream';
        this.testPage = cameraLink + '/program.json';
        this.loadingImg = loadingImgId;
        this.failedImg = failedImgId;
        this.cameraConnected = false;
    }

    createImgElement(link, icon=false) {
        this.container.innerHTML = '';
        let img = document.createElement('img');
        img.src = link;
        if (icon) {
            img.classList.add('icon');
        }
        this.container.appendChild(img);
    }

    async fetchTestPage() {
        let response = await fetch(this.testPage);
        if (!response.ok) {
            throw new Error('Camera is not yet available');
        }
    }

    /**
     * Attempt to connect to the camera stream.
     * @param {Integer} delay
     */
    async connectCamera(delay) {
        if (NetworkTables.getValue('/robot/is_simulation')) {
            this.stream = '../images/camera_default.jpg';
            return;
        }

        try {
            await this.fetchTestPage();
            return;
        } catch (e) {
            console.log('Retrying Camera Id: ' + this.container.id);
        }

        await sleep(delay);
        await this.connectCamera(Math.min(5000, delay + 1000));
    }

    /**
     * Load the camera stream linked to this camera into the container element. 
     * Returns true if successful and false if the connection could not be made.
     * @returns {Boolean} Whether the cameras were successfully loaded.
     */
    async loadCameraStream() {
        // Hide crosshair
        this.crosshair.style.display = 'none';
        // Set container SVG to "loading"
        this.createImgElement(this.failedImg, true);
        // Wait for Robot to connect
        if (!NetworkTables.isRobotConnected()) {
            return false;
        }

        this.createImgElement(this.loadingImg, true);

        // Wait for Camera to connect
        try {
            await this.connectCamera(1000); // Reconnect delay of 1 second
        } catch (e) { // Too much recursion, if the camera stream fails multiple times.
            this.createImgElement(this.failedImg, true);
            return false;
        }

        this.cameraConnected = true;
        this.createImgElement(this.stream);
        this.crosshair.style.display = 'block';

        return true;
    }
}
