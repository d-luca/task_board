import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
	// Project API
	project: {
		create: (data: unknown) => ipcRenderer.invoke("project:create", data),
		getAll: (includeArchived?: boolean) => ipcRenderer.invoke("project:getAll", includeArchived),
		getById: (id: string) => ipcRenderer.invoke("project:getById", id),
		update: (id: string, data: unknown) => ipcRenderer.invoke("project:update", id, data),
		delete: (id: string) => ipcRenderer.invoke("project:delete", id),
		archive: (id: string) => ipcRenderer.invoke("project:archive", id),
		unarchive: (id: string) => ipcRenderer.invoke("project:unarchive", id),
		search: (searchTerm: string) => ipcRenderer.invoke("project:search", searchTerm),
	},
	// Task API
	task: {
		create: (data: unknown) => ipcRenderer.invoke("task:create", data),
		getByProject: (projectId: string, includeArchived?: boolean) =>
			ipcRenderer.invoke("task:getByProject", projectId, includeArchived),
		getById: (id: string) => ipcRenderer.invoke("task:getById", id),
		update: (id: string, data: unknown) => ipcRenderer.invoke("task:update", id, data),
		delete: (id: string) => ipcRenderer.invoke("task:delete", id),
		archive: (id: string) => ipcRenderer.invoke("task:archive", id),
		updatePosition: (id: string, status: string, position: number) =>
			ipcRenderer.invoke("task:updatePosition", id, status, position),
		reorder: (projectId: string, status: string, taskIds: string[]) =>
			ipcRenderer.invoke("task:reorder", projectId, status, taskIds),
		getByDueDate: (startDate: string, endDate: string) =>
			ipcRenderer.invoke("task:getByDueDate", startDate, endDate),
		search: (projectId: string, searchTerm: string) =>
			ipcRenderer.invoke("task:search", projectId, searchTerm),
	},
	// Export/Import API
	export: {
		toJSON: (options: unknown) => ipcRenderer.invoke("export:toJSON", options),
		toCSV: (options: unknown) => ipcRenderer.invoke("export:toCSV", options),
		createBackup: () => ipcRenderer.invoke("export:createBackup"),
		listBackups: () => ipcRenderer.invoke("export:listBackups"),
	},
	import: {
		fromJSON: (options: unknown) => ipcRenderer.invoke("import:fromJSON", options),
		restoreBackup: (backupPath: string) => ipcRenderer.invoke("import:restoreBackup", backupPath),
		selectFile: () => ipcRenderer.invoke("import:selectFile"),
	},
	// System events - listen for menu/tray actions
	onOpenTaskDialog: (callback: () => void) => {
		ipcRenderer.on("open-task-dialog", callback);
		return () => ipcRenderer.removeListener("open-task-dialog", callback);
	},
	onOpenProjectDialog: (callback: () => void) => {
		ipcRenderer.on("open-project-dialog", callback);
		return () => ipcRenderer.removeListener("open-project-dialog", callback);
	},
	onOpenExportDialog: (callback: () => void) => {
		ipcRenderer.on("open-export-dialog", callback);
		return () => ipcRenderer.removeListener("open-export-dialog", callback);
	},
	onOpenImportDialog: (callback: () => void) => {
		ipcRenderer.on("open-import-dialog", callback);
		return () => ipcRenderer.removeListener("open-import-dialog", callback);
	},
	// Database status
	onDatabaseStatus: (callback: (status: unknown) => void) => {
		ipcRenderer.on("database-status", (_event, status) => callback(status));
		return () => ipcRenderer.removeAllListeners("database-status");
	},
	getDatabaseStatus: () => ipcRenderer.invoke("database:getStatus"),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore (define in dts)
	window.electron = electronAPI;
	// @ts-ignore (define in dts)
	window.api = api;
}
