import { create } from "zustand";
import { toast } from "sonner";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { TaskStatus, TaskPriority } from "../types/task";

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
		// Optimistic update - create temporary project
		const tempId = `temp-${Date.now()}`;
		const tempProject: Project = {
			_id: tempId,
			name: data.name || "New Project",
			description: data.description || "",
			icon: data.icon || "📋",
			color: data.color || "blue",
			isArchived: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		set((state) => ({
			projects: [tempProject, ...state.projects],
			currentProjectId: tempId,
		}));

		try {
			const project = (await window.api.project.create(data)) as Project;
			// Replace temp project with real one
			set((state) => ({
				projects: state.projects.map((p) => (p._id === tempId ? project : p)),
				currentProjectId: project._id,
			}));
			toast.success("Project created successfully!");
			return project;
		} catch (error) {
			// Rollback optimistic update
			set((state) => ({
				projects: state.projects.filter((p) => p._id !== tempId),
				currentProjectId: state.projects[0]?._id || null,
			}));
			console.error("Failed to create project:", error);
			toast.error("Failed to create project. Please try again.");
			throw error;
		}
	},

	updateProject: async (id, data) => {
		// Store original for rollback
		const original = get().projects.find((p) => p._id === id);
		if (!original) {
			toast.error("Project not found");
			return;
		}

		// Optimistic update
		set((state) => ({
			projects: state.projects.map((p) =>
				p._id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p,
			),
		}));

		try {
			const updated = (await window.api.project.update(id, data)) as Project;
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? updated : p)),
			}));
			toast.success("Project updated successfully!");
		} catch (error) {
			// Rollback
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? original : p)),
			}));
			console.error("Failed to update project:", error);
			toast.error("Failed to update project. Please try again.");
			throw error;
		}
	},

	deleteProject: async (id) => {
		// Store original for rollback
		const original = get().projects.find((p) => p._id === id);
		const originalCurrentId = get().currentProjectId;
		if (!original) {
			toast.error("Project not found");
			return;
		}

		// Optimistic update
		set((state) => ({
			projects: state.projects.filter((p) => p._id !== id),
			currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
		}));

		try {
			await window.api.project.delete(id);
			toast.success("Project deleted successfully!");
		} catch (error) {
			// Rollback
			set((state) => ({
				projects: [...state.projects, original].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
				currentProjectId: originalCurrentId,
			}));
			console.error("Failed to delete project:", error);
			toast.error("Failed to delete project. Please try again.");
			throw error;
		}
	},

	archiveProject: async (id) => {
		// Store original for rollback
		const original = get().projects.find((p) => p._id === id);
		if (!original) {
			toast.error("Project not found");
			return;
		}

		// Optimistic update
		set((state) => ({
			projects: state.projects.map((p) =>
				p._id === id ? { ...p, isArchived: true, updatedAt: new Date().toISOString() } : p,
			),
		}));

		try {
			const updated = (await window.api.project.archive(id)) as Project;
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? updated : p)),
			}));
			toast.success("Project archived successfully!");
		} catch (error) {
			// Rollback
			set((state) => ({
				projects: state.projects.map((p) => (p._id === id ? original : p)),
			}));
			console.error("Failed to archive project:", error);
			toast.error("Failed to archive project. Please try again.");
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
		// Optimistic update - create temporary task
		const tempId = `temp-${Date.now()}`;
		const tempTask: Task = {
			_id: tempId,
			projectId: data.projectId || get().currentProjectId || "",
			title: data.title || "New Task",
			description: data.description || "",
			status: data.status || TaskStatus.TODO,
			priority: data.priority || TaskPriority.MEDIUM,
			labels: data.labels || [],
			position: get().tasks.filter((t) => t.status === (data.status || TaskStatus.TODO)).length,
			isArchived: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		set((state) => ({
			tasks: [...state.tasks, tempTask],
		}));

		try {
			const task = (await window.api.task.create(data)) as Task;
			// Replace temp task with real one
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === tempId ? task : t)),
			}));
			toast.success("Task created successfully!");
			return task;
		} catch (error) {
			// Rollback
			set((state) => ({
				tasks: state.tasks.filter((t) => t._id !== tempId),
			}));
			console.error("Failed to create task:", error);
			toast.error("Failed to create task. Please try again.");
			throw error;
		}
	},

	updateTask: async (id, data) => {
		// Store original for rollback
		const original = get().tasks.find((t) => t._id === id);
		if (!original) {
			toast.error("Task not found");
			return;
		}

		// Optimistic update
		set((state) => ({
			tasks: state.tasks.map((t) =>
				t._id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t,
			),
		}));

		try {
			const updated = (await window.api.task.update(id, data)) as Task;
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
			}));
			toast.success("Task updated successfully!");
		} catch (error) {
			// Rollback
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === id ? original : t)),
			}));
			console.error("Failed to update task:", error);
			toast.error("Failed to update task. Please try again.");
			throw error;
		}
	},

	deleteTask: async (id) => {
		// Store original for rollback
		const original = get().tasks.find((t) => t._id === id);
		if (!original) {
			toast.error("Task not found");
			return;
		}

		// Optimistic update
		set((state) => ({
			tasks: state.tasks.filter((t) => t._id !== id),
		}));

		try {
			await window.api.task.delete(id);
			toast.success("Task deleted successfully!");
		} catch (error) {
			// Rollback
			set((state) => ({
				tasks: [...state.tasks, original].sort((a, b) => a.position - b.position),
			}));
			console.error("Failed to delete task:", error);
			toast.error("Failed to delete task. Please try again.");
			throw error;
		}
	},

	updateTaskPosition: async (id, status, position) => {
		// Store original for rollback
		const original = get().tasks.find((t) => t._id === id);
		if (!original) {
			return;
		}

		// Optimistic update
		set((state) => ({
			tasks: state.tasks.map((t) =>
				t._id === id
					? {
							...t,
							status: status as Task["status"],
							position,
							updatedAt: new Date().toISOString(),
						}
					: t,
			),
		}));

		try {
			const updated = (await window.api.task.updatePosition(id, status, position)) as Task;
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
			}));
		} catch (error) {
			// Rollback
			set((state) => ({
				tasks: state.tasks.map((t) => (t._id === id ? original : t)),
			}));
			console.error("Failed to update task position:", error);
			toast.error("Failed to move task. Please try again.");
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
