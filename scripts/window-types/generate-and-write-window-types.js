const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs-extra')
const path = require('path')
const url = require('url')

ipcMain.on('window:events', (_e, events) => {
  const filePath = path.join('../../cli/types/window-actions.d.ts')

  const eventsString = events.map((event) => {
    return `  (action: 'window:${event}', fn: (event: Event) => void): void`
  }).join('\n')
  const contents = `// This file was generated by \`npm run generate-window-types\` (scripts/window-types/generate-window-types.js)
// Run \`npm run generate-window-types\` again to re-generate them

interface WindowActions {
${eventsString}
}
  `

  try {
    fs.outputFileSync(filePath, contents)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to write window-events.d.ts:', err.stack)
    process.exit(1)
  }

  process.exit(0)
})

app.on('ready', () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'window-types-ipc.js'),
      nodeIntegration: false,
    },
    show: false,
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'get-window-events.html'),
    protocol: 'file:',
    slashes: true,
  }))
})
