import { ipcMain } from "electron";
import { projectService } from "../database/services/projectService";
import { taskService } from "../database/services/taskService";

export function setupIpcHandlers(): void {
	// Project handlers
	ipcMain.handle("project:create", async (_event, data) => {
		return await projectService.create(data);
	});

	ipcMain.handle("project:getAll", async (_event, includeArchived) => {
		return await projectService.findAll(includeArchived);
	});

	ipcMain.handle("project:getById", async (_event, id) => {
		return await projectService.findById(id);
	});

	ipcMain.handle("project:update", async (_event, id, data) => {
		return await projectService.update(id, data);
	});

	ipcMain.handle("project:delete", async (_event, id) => {
		return await projectService.delete(id);
	});

	ipcMain.handle("project:archive", async (_event, id) => {
		return await projectService.archive(id);
	});

	ipcMain.handle("project:unarchive", async (_event, id) => {
		return await projectService.unarchive(id);
	});

	ipcMain.handle("project:search", async (_event, searchTerm) => {
		return await projectService.search(searchTerm);
	});

	// Task handlers
	ipcMain.handle("task:create", async (_event, data) => {
		return await taskService.create(data);
	});

	ipcMain.handle("task:getByProject", async (_event, projectId, includeArchived) => {
		return await taskService.findByProject(projectId, includeArchived);
	});

	ipcMain.handle("task:getById", async (_event, id) => {
		return await taskService.findById(id);
	});

	ipcMain.handle("task:update", async (_event, id, data) => {
		return await taskService.update(id, data);
	});

	ipcMain.handle("task:delete", async (_event, id) => {
		return await taskService.delete(id);
	});

	ipcMain.handle("task:archive", async (_event, id) => {
		return await taskService.archive(id);
	});

	ipcMain.handle("task:updatePosition", async (_event, id, status, position) => {
		return await taskService.updatePosition(id, status, position);
	});

	ipcMain.handle("task:reorder", async (_event, projectId, status, taskIds) => {
		return await taskService.reorderTasks(projectId, status, taskIds);
	});

	ipcMain.handle("task:getByDueDate", async (_event, startDate, endDate) => {
		return await taskService.findByDueDate(new Date(startDate), new Date(endDate));
	});

	ipcMain.handle("task:search", async (_event, projectId, searchTerm) => {
		return await taskService.search(projectId, searchTerm);
	});
}
