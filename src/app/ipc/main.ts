import { getServers } from "dns";
import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { homedir } from "os";

ipcMain.on("quit-app", () => {
  app.quit();
});

ipcMain.on("minimize-app", () => {
  if (process.platform === "darwin") {
    app.hide();
    return;
  }
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on("maximize-app", () => {
  if (BrowserWindow.getFocusedWindow()?.isMaximized()) {
    BrowserWindow.getFocusedWindow()?.unmaximize();
  } else {
    BrowserWindow.getFocusedWindow()?.maximize();
  }
});

ipcMain.on("relaunch-app", () => {
  app.relaunch();
  app.exit(0);
});

ipcMain.on("getData", () => {
  fs.readFile(
    path.join(homedir(), "/.books/data.json"),
    "utf8",
    function (err: any, data: any) {
      if (err) {
        console.log("Error opening the file.");
      }
      const fileData = JSON.parse(data);
      return BrowserWindow.getFocusedWindow()?.webContents.send(
        "sentData",
        fileData
      );
    }
  );
});

ipcMain.on("manageBooks", (event, books) => {
  fs.writeFile(
    path.join(homedir(), "/.books/data.json"),
    JSON.stringify(books, null, 2),
    (err: any) => {
      if (err) {
        console.log("Error deleting the selected book!");
      }
    }
  );
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them in main.ts
