import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";
import { app, BrowserWindow, ipcMain } from "electron";

import path from "path";

const rootHtml = path.resolve(app.getAppPath(), "index.html");

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    resizable: false,
    // maxWidth: 800,
    // minWidth: 800,
    // maxHeight: 600,
    // minHeight: 600,
    frame: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(rootHtml);

  win.webContents.openDevTools({ mode: "detach" });

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on("quit", () => {
  app.quit();
});
