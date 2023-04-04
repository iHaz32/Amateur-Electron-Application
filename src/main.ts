import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import Store from "electron-persist-secure/lib/store";
import { homedir } from "os";
import "./app/ipc/main";
import { booksData } from "../books.js";
import fs from "fs";
import path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Make sure to call this ONCE.
const createStores = (): void => {
  new Store({
    configName: "config", // The stores name
  });
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    // to disable the top bar / frame completely uncomment the next line -
    // if you do this you will have to set up a css class to allow certain parts of your app to be "draggable"
    frame: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools if in dev.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createStores();
  createWindow();
  fs.readFile(
    path.join(homedir(), "/.books/data.json"),
    "utf8",
    function (err: any, data: any) {
      if (err) {
        fs.mkdirSync(path.join(homedir(), "/.books"));
        fs.writeFile(
          path.join(homedir(), "/.books/data.json"),
          JSON.stringify(booksData, null, 2),
          (err: any) => {
            if (err) {
              console.log("Error writing the default book data to the file!");
            }
          }
        );
      }
    }
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
