const electron = require('electron');

const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
  constructor(url){
    super({
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: false,
      },
      skipTaskbar: true,
      height: 500,
      width: 300,
      frame: false,
      resizable: false,
      show: false,
    })

    this.loadURL(url)
    this.on('blur', this.onBlur.bind(this))
  }

  onBlur(){
    this.hide()
  }
}

module.exports = MainWindow;

