const path = require('path')
const electon = require('electron');
const TimerTray = require('./app/timer_tray.js')
const MainWindow = require('./app/main_window.js')

const { app, ipcMain } = electon;

let mainWindow;
let tray;

app.on('ready', () => {
  mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`)
  tray = new TimerTray(iconPath, mainWindow)
})

ipcMain.on('update-timer', (event, timeLeft) => {
  tray.setTitle(timeLeft)
})