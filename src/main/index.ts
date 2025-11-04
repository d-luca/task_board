import { app, shell, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { connectDatabase, disconnectDatabase } from "./database/connection";
import { setupIpcHandlers } from "./ipc/handlers";
import { logger } from "./utils/logger";
import * as fs from "fs";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// Path for storing window state
const windowStateFile = join(app.getPath("userData"), "window-state.json");

interface WindowState {
	width: number;
	height: number;
	x?: number;
	y?: number;
	isMaximized: boolean;
}

// Load window state from file
function loadWindowState(): WindowState {
	try {
		if (fs.existsSync(windowStateFile)) {
			const data = fs.readFileSync(windowStateFile, "utf-8");
			return JSON.parse(data);
		}
	} catch (error) {
		console.error("Error loading window state:", error);
	}
	// Default window state
	return {
		width: 1200,
		height: 800,
		isMaximized: false,
	};
}

// Save window state to file
function saveWindowState(): void {
	if (!mainWindow) return;

	try {
		const bounds = mainWindow.getBounds();
		const state: WindowState = {
			width: bounds.width,
			height: bounds.height,
			x: bounds.x,
			y: bounds.y,
			isMaximized: mainWindow.isMaximized(),
		};
		fs.writeFileSync(windowStateFile, JSON.stringify(state, null, 2));
	} catch (error) {
		console.error("Error saving window state:", error);
	}
}

function createTray(): void {
	// Create tray icon
	const trayIcon = nativeImage.createFromPath(icon);
	tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));

	// Create tray menu
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Show App",
			click: () => {
				if (mainWindow) {
					mainWindow.show();
					mainWindow.focus();
				}
			},
		},
		{ type: "separator" },
		{
			label: "New Task",
			accelerator: "CmdOrCtrl+N",
			click: () => {
				if (mainWindow) {
					mainWindow.show();
					mainWindow.focus();
					mainWindow.webContents.send("open-task-dialog");
				}
			},
		},
		{
			label: "New Project",
			accelerator: "CmdOrCtrl+Shift+N",
			click: () => {
				if (mainWindow) {
					mainWindow.show();
					mainWindow.focus();
					mainWindow.webContents.send("open-project-dialog");
				}
			},
		},
		{ type: "separator" },
		{
			label: "Quit",
			accelerator: "CmdOrCtrl+Q",
			click: () => {
				app.quit();
			},
		},
	]);

	tray.setToolTip("Task Board Manager");
	tray.setContextMenu(contextMenu);

	// Show window on tray icon click
	tray.on("click", () => {
		if (mainWindow) {
			if (mainWindow.isVisible()) {
				mainWindow.hide();
			} else {
				mainWindow.show();
				mainWindow.focus();
			}
		}
	});
}

function createApplicationMenu(): void {
	const template: Electron.MenuItemConstructorOptions[] = [
		{
			label: "File",
			submenu: [
				{
					label: "New Project",
					accelerator: "CmdOrCtrl+Shift+N",
					click: () => {
						mainWindow?.webContents.send("open-project-dialog");
					},
				},
				{
					label: "New Task",
					accelerator: "CmdOrCtrl+N",
					click: () => {
						mainWindow?.webContents.send("open-task-dialog");
					},
				},
				{ type: "separator" },
				{
					label: "Export Data",
					accelerator: "CmdOrCtrl+E",
					click: () => {
						mainWindow?.webContents.send("open-export-dialog");
					},
				},
				{
					label: "Import Data",
					accelerator: "CmdOrCtrl+I",
					click: () => {
						mainWindow?.webContents.send("open-import-dialog");
					},
				},
				{ type: "separator" },
				{
					label: "Quit",
					accelerator: "CmdOrCtrl+Q",
					click: () => {
						app.quit();
					},
				},
			],
		},
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{ role: "delete" },
				{ type: "separator" },
				{ role: "selectAll" },
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ role: "toggleDevTools" },
				{ type: "separator" },
				{ role: "resetZoom" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		{
			label: "Window",
			submenu: [
				{ role: "minimize" },
				{ role: "zoom" },
				{ type: "separator" },
				{
					label: "Hide to Tray",
					accelerator: "CmdOrCtrl+H",
					click: () => {
						mainWindow?.hide();
					},
				},
			],
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Learn More",
					click: async () => {
						await shell.openExternal("https://electronjs.org");
					},
				},
				{
					label: "Open Log File",
					click: () => {
						shell.showItemInFolder(logger.getLogPath());
					},
				},
				{
					label: "Open User Data Folder",
					click: () => {
						shell.openPath(app.getPath("userData"));
					},
				},
				{ type: "separator" },
				{
					label: "About",
					click: () => {
						const aboutMessage = `Task Board Manager\nVersion: ${app.getVersion()}\n\nA desktop application for managing tasks and projects.`;
						if (mainWindow) {
							// You could show a custom dialog here
							logger.info(aboutMessage);
						}
					},
				},
			],
		},
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

function registerGlobalShortcuts(): void {
	// Register global shortcuts
	globalShortcut.register("CmdOrCtrl+Shift+T", () => {
		if (mainWindow) {
			if (mainWindow.isVisible()) {
				mainWindow.hide();
			} else {
				mainWindow.show();
				mainWindow.focus();
			}
		}
	});

	console.log("Global shortcuts registered");
}

function createWindow(): void {
	// Load saved window state
	const windowState = loadWindowState();

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: windowState.width,
		height: windowState.height,
		x: windowState.x,
		y: windowState.y,
		show: false,
		autoHideMenuBar: false, // Show menu bar
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	// Restore maximized state
	if (windowState.isMaximized) {
		mainWindow.maximize();
	}

	mainWindow.on("ready-to-show", () => {
		mainWindow?.show();
		// Open DevTools in development
		if (is.dev) {
			mainWindow?.webContents.openDevTools();
		}
	});

	// Save window state when resized or moved
	mainWindow.on("resize", saveWindowState);
	mainWindow.on("move", saveWindowState);

	// Handle close event - minimize to tray instead of quitting
	mainWindow.on("close", (event) => {
		if (!isQuitting) {
			event.preventDefault();
			mainWindow?.hide();
		}
		return false;
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	logger.info("=".repeat(60));
	logger.info("Application starting...");
	logger.info(`Version: ${app.getVersion()}`);
	logger.info(`Platform: ${process.platform}`);
	logger.info(`Electron: ${process.versions.electron}`);
	logger.info(`Node: ${process.versions.node}`);
	logger.info(`User Data: ${app.getPath("userData")}`);
	logger.info(`Is Packaged: ${app.isPackaged}`);
	logger.info("=".repeat(60));

	// Set app user model id for windows
	electronApp.setAppUserModelId("com.electron");

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	// Create window first so user sees the app
	logger.info("Creating main window...");
	createWindow();

	// Initialize database connection (don't block window creation)
	logger.info("Starting database connection...");
	connectDatabase()
		.then(() => {
			logger.info("Database connected successfully");
		})
		.catch((error) => {
			logger.error("Failed to connect to database:", error);
			logger.error("The app will continue with limited functionality.");
		});

	// Setup IPC handlers for database operations
	logger.info("Setting up IPC handlers...");
	setupIpcHandlers();

	// Create application menu
	logger.info("Creating application menu...");
	createApplicationMenu();

	// Register global shortcuts
	logger.info("Registering global shortcuts...");
	registerGlobalShortcuts();

	// Create system tray
	logger.info("Creating system tray...");
	createTray();

	logger.info("Application started successfully");

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", async () => {
	// Don't quit, just hide to tray
	// App will quit when user selects Quit from tray menu
});

// Handle database cleanup on app quit
app.on("before-quit", async () => {
	logger.info("Application shutting down...");
	isQuitting = true;
	await disconnectDatabase();
	// Unregister global shortcuts
	globalShortcut.unregisterAll();
	logger.info("Application shut down complete");
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
