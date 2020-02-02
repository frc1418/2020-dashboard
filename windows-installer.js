const electronInstaller = require('electron-winstaller');

electronInstaller.createWindowsInstaller({
    appDirectory: `${__dirname}/src`,
    outputDirectory: '.',
    authors: 'Team 1418',
    exe: 'windows-installer.exe'
}).then(() => {
    console.log('Working!');
    process.exit(0);
}).catch((e) => {
    console.log(`Error: ${e.message}`);
    process.exit(1);
});
