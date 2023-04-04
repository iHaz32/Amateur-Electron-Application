import { electron } from "process";
import { ipcRenderer, contextBridge } from "electron";
import "./bridges/main";

export const electronBridge = {
  send: (channel: string, data: object): void => {
    ipcRenderer.send(channel, data);
  },

  receive: (channel: string, func: any): void => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
};

contextBridge.exposeInMainWorld("electron", electronBridge);
