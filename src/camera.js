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
    * @param {String} cameraLink
    * @param {Integer} loadingImgId
    * @param {Integer} failedImgId
    */

    constructor(cameraLink) {
        this.stream = cameraLink + '/stream.mjpg';
        this.testPage = cameraLink + '/settings.json';
        this.loadingImg = '../images/spinner.svg';
        this.failedImg = '../images/error.svg';
        this.cameraConnected = false;

        if (cameraLink == 'http://10.14.18.11:5801'){
            this.testPage = cameraLink;
            this.stream = 'http://10.14.18.11:5800';
        }
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
        let response = '';
        try {
            response = await fetch(this.testPage);
        } catch (e) {
            console.log(e);
        }
        console.log(`Response: ${response}`);
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

        console.log('Camera success');

        this.cameraConnected = true;
        this.createImgElement(this.stream);
        setTimeout(() => {
            this.createImgElement(this.stream);
        }, 1000);
        this.crosshair.style.display = 'block';

        return true;
    }

    setParent(parent) {
        this.container = parent.querySelector('.stream');
        this.crosshair = parent.querySelector('.crosshair');
    }

}
