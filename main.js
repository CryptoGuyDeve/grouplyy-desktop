const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

// Handle Squirrel installer events (creates Desktop/Start Menu shortcuts on install)
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;
let splash;

function createWindow() {
  // Main app window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    // Use .ico for Windows to get correct taskbar/shortcut icon
    icon: path.join(__dirname, process.platform === "win32" ? "assets/icon.ico" : "assets/icon.png"),
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
    icon: path.join(__dirname, process.platform === "win32" ? "assets/icon.ico" : "assets/icon.png"),
  });

  splash.loadFile(path.join(__dirname, "splash.html"));

  setTimeout(() => {
    createWindow();
  }, 4000); // show splash for 4 seconds

  // Create default files in Documents on first run
  try {
    const userDataDir = app.getPath("userData");
    const firstRunFlagPath = path.join(userDataDir, "first-run-done");
    const isFirstRun = !fs.existsSync(firstRunFlagPath) || process.argv.includes("--squirrel-firstrun");

    if (isFirstRun) {
      const documentsDir = app.getPath("documents");
      const appDocsDir = path.join(documentsDir, "Grouplyy");
      if (!fs.existsSync(appDocsDir)) {
        fs.mkdirSync(appDocsDir, { recursive: true });
      }
      const readmePath = path.join(appDocsDir, "README.txt");
      if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(
          readmePath,
          "Welcome to Grouplyy!\n\nThis folder was created on first run.\n",
          { encoding: "utf8" }
        );
      }
      // Mark first run complete
      fs.writeFileSync(firstRunFlagPath, "done", { encoding: "utf8" });
    }
  } catch (error) {
    // Intentionally ignore non-critical first-run errors
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
