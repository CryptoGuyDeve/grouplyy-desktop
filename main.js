const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;
let splash;

function createWindow() {
  // Main app window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    icon: path.join(__dirname, "assets/icon.png"), // ✅ taskbar icon
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("https://www.grouplyy.xyz/electron");

  mainWindow.once("ready-to-show", () => {
    if (splash) {
      splash.close();
    }
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Splash screen
  splash = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    icon: path.join(__dirname, "assets/icon.png"), // ✅ taskbar icon
  });

  splash.loadFile(path.join(__dirname, "splash.html"));

  setTimeout(() => {
    createWindow();
  }, 4000); // show splash for 4 seconds
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
