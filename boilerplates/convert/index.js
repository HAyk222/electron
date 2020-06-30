const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg')
const _ = require('lodash');
const { result } = require('lodash');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
    },
    height: 600,
    width: 800,
  })
  mainWindow.loadURL(`file://${__dirname}/src/index.html`)
})

ipcMain.on('videos:add', (event, videos) => {
  
  const promises = _.map(videos, video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        video.duration = metadata.format.duration
        video.format = 'avi'
        resolve(video)
      })
    })
  })

  Promise.all(promises)
    .then(result => {
      mainWindow.webContents.send('metadata:complete', result)
    })
  
})

ipcMain.on('conversion:start', (event, videos) => {
  const data = videos.videos
  const voideosNames = Object.keys(data)
  console.log(videos.videos, 'allVideos')
  _.each(voideosNames, item => {
    const outputDirectory = data[item].path.split(data[item].name)[0]
    const outputName = data[item].name.split('.')[0]
    const outputPath = `${outputDirectory}${outputName}.${data[item].format}`

    console.log(outputPath)
    ffmpeg(data[item].path)
      .output(outputPath)
      .on('end', () => console.log("complete"))
      .run()
  })
})