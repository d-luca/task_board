import { useState, useEffect, useCallback, JSX } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/layout/Sidebar";
import { ProjectList } from "./components/ProjectList";
import { ProjectDialog } from "./components/project";
import { TaskDialog } from "./components/task";
import { ExportDialog } from "./components/export";
import { ImportDialog } from "./components/import";
import { EmptyState } from "./components/EmptyState";
import { ProjectView } from "./components/ProjectView";
import { useStore } from "./store/useStore";
import type { Task } from "./types/task";
import { TaskStatus, TaskPriority } from "./types/task";

function App(): JSX.Element {
	const [projectDialogOpen, setProjectDialogOpen] = useState(false);
	const [taskDialogOpen, setTaskDialogOpen] = useState(false);
	const [exportDialogOpen, setExportDialogOpen] = useState(false);
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [editingProject, setEditingProject] = useState(false);
	const {
		projects,
		currentProjectId,
		createProject,
		createTask,
		updateTask,
		updateProject,
		getCurrentProject,
	} = useStore();

	const currentProject = getCurrentProject();

	// Listen for menu/tray triggered events
	useEffect(() => {
		const unsubscribeTask = window.api.onOpenTaskDialog(() => {
			setEditingTask(null);
			setTaskDialogOpen(true);
		});

		const unsubscribeProject = window.api.onOpenProjectDialog(() => {
			setEditingProject(false);
			setProjectDialogOpen(true);
		});

		const unsubscribeExport = window.api.onOpenExportDialog(() => {
			setExportDialogOpen(true);
		});

		const unsubscribeImport = window.api.onOpenImportDialog(() => {
			setImportDialogOpen(true);
		});

		return () => {
			unsubscribeTask();
			unsubscribeProject();
			unsubscribeExport();
			unsubscribeImport();
		};
	}, []);

	const handleCreateProject = useCallback(
		async (data: { name: string; description?: string; color?: string; icon?: string }): Promise<void> => {
			if (editingProject && currentProject) {
				await updateProject(currentProject._id, data);
				setEditingProject(false);
			} else {
				await createProject(data);
			}
		},
		[editingProject, currentProject, updateProject, createProject],
	);

	const handleCreateTask = useCallback(
		async (data: {
			title: string;
			description?: string;
			status: TaskStatus;
			priority: TaskPriority;
			labels?: string;
			dueDate?: string;
		}): Promise<void> => {
			if (!currentProjectId) return;

			// Parse labels from comma-separated string
			const labels = data.labels
				? data.labels
						.split(",")
						.map((l) => l.trim())
						.filter((l) => l.length > 0)
				: [];

			if (editingTask) {
				await updateTask(editingTask._id, {
					title: data.title,
					description: data.description,
					status: data.status,
					priority: data.priority,
					labels,
					dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
				});
				setEditingTask(null);
			} else {
				await createTask({
					projectId: currentProjectId,
					title: data.title,
					description: data.description,
					status: data.status,
					priority: data.priority,
					labels,
					dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
				});
			}
		},
		[currentProjectId, editingTask, updateTask, createTask],
	);

	const handleEditTask = useCallback((task: Task): void => {
		setEditingTask(task);
		setTaskDialogOpen(true);
	}, []);

	const handleOnCreateTask = useCallback((): void => {
		setEditingTask(null);
		setTaskDialogOpen(true);
	}, []);

	const handleOpenEditProjectDialog = useCallback((): void => {
		setEditingProject(true);
		setProjectDialogOpen(true);
	}, []);

	return (
		<>
			<AppLayout
				sidebar={
					<Sidebar>
						<ProjectList onCreateProject={() => setProjectDialogOpen(true)} />
					</Sidebar>
				}
			>
				{projects.length === 0 ? (
					<EmptyState type="no-projects" onCreateProject={() => setProjectDialogOpen(true)} />
				) : !currentProjectId ? (
					<EmptyState type="no-project-selected" />
				) : currentProject ? (
					<ProjectView
						currentProject={currentProject}
						onOpenEditProjectDialog={handleOpenEditProjectDialog}
						onCreateTask={handleOnCreateTask}
						onEditTask={handleEditTask}
					/>
				) : null}
			</AppLayout>

			<ProjectDialog
				open={projectDialogOpen}
				onOpenChange={(open) => {
					setProjectDialogOpen(open);
					if (!open) setEditingProject(false);
				}}
				project={editingProject ? currentProject : undefined}
				onSubmit={handleCreateProject}
			/>

			{currentProjectId && (
				<TaskDialog
					open={taskDialogOpen}
					onOpenChange={(open) => {
						setTaskDialogOpen(open);
						if (!open) setEditingTask(null);
					}}
					task={editingTask || undefined}
					projectId={currentProjectId}
					onSubmit={handleCreateTask}
				/>
			)}

			<ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
			<ImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
		</>
	);
}

export default App;
