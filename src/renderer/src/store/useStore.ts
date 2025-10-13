import { create } from "zustand";
import type { Project } from "../types/project";
import type { Task } from "../types/task";

interface StoreState {
	// Projects state
	projects: Project[];
	currentProjectId: string | null;
	showArchivedProjects: boolean;

	// Tasks state
	tasks: Task[];
	loadingProjects: boolean;
	loadingTasks: boolean;

	// Project actions
	loadProjects: () => Promise<void>;
	createProject: (data: Partial<Project>) => Promise<Project>;
	updateProject: (id: string, data: Partial<Project>) => Promise<void>;
	deleteProject: (id: string) => Promise<void>;
	archiveProject: (id: string) => Promise<void>;
	unarchiveProject: (id: string) => Promise<void>;
	setCurrentProject: (id: string | null) => void;
	toggleShowArchived: () => void;

	// Task actions
	loadTasks: (projectId: string) => Promise<void>;
	createTask: (data: Partial<Task>) => Promise<Task>;
	updateTask: (id: string, data: Partial<Task>) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	updateTaskPosition: (id: string, status: string, position: number) => Promise<void>;
	reorderTasks: (projectId: string, status: string, taskIds: string[]) => Promise<void>;

	// Computed getters
	getCurrentProject: () => Project | undefined;
	getVisibleProjects: () => Project[];
}

export const useStore = create<StoreState>((set, get) => ({
	// Initial state
	projects: [],
	currentProjectId: null,
	showArchivedProjects: false,
	tasks: [],
	loadingProjects: false,
	loadingTasks: false,

	// Project actions
	loadProjects: async () => {
		set({ loadingProjects: true });
		try {
			const { showArchivedProjects } = get();
			const projects = (await window.api.project.getAll(showArchivedProjects)) as Project[];
			set({ projects, loadingProjects: false });
		} catch (error) {
			console.error("Failed to load projects:", error);
			set({ loadingProjects: false });
		}
	},

	createProject: async (data) => {
		try {
			const project = (await window.api.project.create(data)) as Project;
			set((state) => ({
				projects: [project, ...state.projects],
				currentProjectId: project._id,
			}));
			return project;
		} catch (error) {
			console.error("Failed to create project:", error);
			throw error;
		}
	},

	updateProject: async (id, data) => {
		try {
			const updated = (await window.api.project.update(id, data)) as Project;
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? updated : p)),
			}));
		} catch (error) {
			console.error("Failed to update project:", error);
			throw error;
		}
	},

	deleteProject: async (id) => {
		try {
			await window.api.project.delete(id);
			set((state) => ({
				projects: state.projects.filter((p) => p._id !== id),
				currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
			}));
		} catch (error) {
			console.error("Failed to delete project:", error);
			throw error;
		}
	},

	archiveProject: async (id) => {
		try {
			const updated = (await window.api.project.archive(id)) as Project;
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? updated : p)),
			}));
		} catch (error) {
			console.error("Failed to archive project:", error);
			throw error;
		}
	},

	unarchiveProject: async (id) => {
		try {
			const updated = (await window.api.project.unarchive(id)) as Project;
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? updated : p)),
			}));
		} catch (error) {
			console.error("Failed to unarchive project:", error);
			throw error;
		}
	},

	setCurrentProject: (id) => {
		set({ currentProjectId: id, tasks: [] });
		if (id) {
			get().loadTasks(id);
		}
	},

	toggleShowArchived: () => {
		set((state) => ({ showArchivedProjects: !state.showArchivedProjects }));
		get().loadProjects();
	},

	// Task actions
	loadTasks: async (projectId) => {
		set({ loadingTasks: true });
		try {
			const tasks = (await window.api.task.getByProject(projectId, false)) as Task[];
			set({ tasks, loadingTasks: false });
		} catch (error) {
			console.error("Failed to load tasks:", error);
			set({ loadingTasks: false });
		}
	},

	createTask: async (data) => {
		try {
			const task = (await window.api.task.create(data)) as Task;
			set((state) => ({
				tasks: [...state.tasks, task],
			}));
			return task;
		} catch (error) {
			console.error("Failed to create task:", error);
			throw error;
		}
	},

	updateTask: async (id, data) => {
		try {
			const updated = (await window.api.task.update(id, data)) as Task;
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
			}));
		} catch (error) {
			console.error("Failed to update task:", error);
			throw error;
		}
	},

	deleteTask: async (id) => {
		try {
			await window.api.task.delete(id);
			set((state) => ({
				tasks: state.tasks.filter((t) => t._id !== id),
			}));
		} catch (error) {
			console.error("Failed to delete task:", error);
			throw error;
		}
	},

	updateTaskPosition: async (id, status, position) => {
		try {
			const updated = (await window.api.task.updatePosition(id, status, position)) as Task;
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
			}));
		} catch (error) {
			console.error("Failed to update task position:", error);
			throw error;
		}
	},

	reorderTasks: async (projectId, status, taskIds) => {
		try {
			await window.api.task.reorder(projectId, status, taskIds);
			// Reload tasks to get updated positions
			await get().loadTasks(projectId);
		} catch (error) {
			console.error("Failed to reorder tasks:", error);
			throw error;
		}
	},

	// Computed getters
	getCurrentProject: () => {
		const { projects, currentProjectId } = get();
		return projects.find((p) => p._id === currentProjectId);
	},

	getVisibleProjects: () => {
		const { projects, showArchivedProjects } = get();
		return showArchivedProjects ? projects : projects.filter((p) => !p.isArchived);
	},
}));
