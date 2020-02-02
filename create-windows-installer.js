const electronInstaller = require('electron-winstaller');

electronInstaller.createWindowsInstaller({
    appDirectory: `${__dirname}\\dist\\1418-dashboard-2020-win32-x64`,
    outputDirectory: '.',
    authors: 'Team 1418',
    exe: '1418-dashboard-2020.exe',
	iconUrl: `${__dirname}\\images\\icon.ico`,
	setupIcon: `${__dirname}\\images\\icon.ico`,
	version: '1.0.0',
	setupExe: 'Dashboard-Setup.exe',
	noMsi: true
}).then(() => {
    console.log('Working!');
    process.exit(0);
}).catch((e) => {
    console.log(`Error: ${e.message}`);
    process.exit(1);
});
