const electronInstaller = require('electron-winstaller');

let version;
if (process.argv[2]) {
    version = process.argv[2].replace('v', '');
} else {
    process.exitCode = 1;
    throw new Error('Application version not specified.');
}

electronInstaller.createWindowsInstaller({
    appDirectory: `${__dirname}\\dist\\1418-dashboard-2020-win32-x64`,
    outputDirectory: '.',
    authors: 'Team 1418',
    exe: '1418-dashboard-2020.exe',
	iconUrl: `${__dirname}\\images\\icon.ico`,
	setupIcon: `${__dirname}\\images\\icon.ico`,
	version: version,
	setupExe: 'Dashboard-Setup.exe',
	noMsi: true
}).then(() => {
    console.log('Working!');
    process.exit(0);
}).catch((e) => {
    console.log(`Error: ${e.message}`);
    process.exit(1);
});
