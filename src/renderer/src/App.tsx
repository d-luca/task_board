import { useState, useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/layout/Sidebar";
import { ProjectList } from "./components/ProjectList";
import { ProjectDialog } from "./components/ProjectDialog";
import { TaskDialog } from "./components/TaskDialog";
import { ExportDialog } from "./components/ExportDialog";
import { ImportDialog } from "./components/ImportDialog";
import { EmptyState } from "./components/EmptyState";
import { KanbanBoard } from "./components/KanbanBoard";
import { KanbanBoardSkeleton } from "./components/skeletons/KanbanBoardSkeleton";
import { Button } from "./components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { MoreVertical, Edit, Archive, Trash2 } from "lucide-react";
import { useStore } from "./store/useStore";
import type { Task } from "./types/task";

function App(): React.JSX.Element {
	const [projectDialogOpen, setProjectDialogOpen] = useState(false);
	const [taskDialogOpen, setTaskDialogOpen] = useState(false);
	const [exportDialogOpen, setExportDialogOpen] = useState(false);
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [editingProject, setEditingProject] = useState(false);
	const {
		projects,
		currentProjectId,
		loadingProjects,
		loadingTasks,
		createProject,
		createTask,
		updateTask,
		updateProject,
		archiveProject,
		deleteProject,
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

	const handleCreateProject = async (data: {
		name: string;
		description?: string;
		color?: string;
		icon?: string;
	}) => {
		if (editingProject && currentProject) {
			await updateProject(currentProject._id, data);
			setEditingProject(false);
		} else {
			await createProject(data);
		}
	};

	const handleCreateTask = async (data: {
		title: string;
		description?: string;
		status: "todo" | "in-progress" | "done";
		priority: "low" | "medium" | "high";
		labels?: string;
		dueDate?: string;
	}) => {
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
	};

	const handleEditTask = (task: Task): void => {
		setEditingTask(task);
		setTaskDialogOpen(true);
	};

	const handleEditProject = (): void => {
		setEditingProject(true);
		setProjectDialogOpen(true);
	};

	const handleArchiveProject = async (): Promise<void> => {
		if (!currentProject) return;
		if (window.confirm(`Archive project "${currentProject.name}"?`)) {
			await archiveProject(currentProject._id);
		}
	};

	const handleDeleteProject = async (): Promise<void> => {
		if (!currentProject) return;
		if (
			window.confirm(
				`Delete project "${currentProject.name}"? This will also delete all tasks in this project.`,
			)
		) {
			await deleteProject(currentProject._id);
		}
	};

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
				) : (
					<div className="container mx-auto flex h-full flex-col p-8">
						<div className="mb-6 flex items-start justify-between">
							<div>
								<h1 className="flex items-center gap-3 text-3xl font-bold">
									<span>{currentProject?.icon || "📋"}</span>
									<span>{currentProject?.name}</span>
								</h1>
								{currentProject?.description && (
									<p className="text-muted-foreground mt-2">{currentProject.description}</p>
								)}
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={handleEditProject}>
										<Edit className="mr-2 h-4 w-4" />
										Edit Project
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleArchiveProject}>
										<Archive className="mr-2 h-4 w-4" />
										Archive Project
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleDeleteProject} className="text-destructive">
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Project
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<KanbanBoard
							onCreateTask={() => {
								setEditingTask(null);
								setTaskDialogOpen(true);
							}}
							onEditTask={handleEditTask}
						/>
					</div>
				)}
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
