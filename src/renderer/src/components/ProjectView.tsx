import { Archive, Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { KanbanBoard } from "./kanban";
import { useStore } from "../store/useStore";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { JSX } from "react";

interface ProjectViewProps {
	currentProject: Project;
	onOpenEditProjectDialog: () => void;
	onCreateTask: () => void;
	onEditTask: (task: Task) => void;
}

export function ProjectView({
	currentProject,
	onOpenEditProjectDialog,
	onCreateTask,
	onEditTask,
}: ProjectViewProps): JSX.Element {
	const { archiveProject, deleteProject } = useStore();

	const handleEditProject = (): void => {
		onOpenEditProjectDialog();
	};

	const handleArchiveProject = async (): Promise<void> => {
		if (window.confirm(`Archive project "${currentProject.name}"?`)) {
			await archiveProject(currentProject._id);
		}
	};

	const handleDeleteProject = async (): Promise<void> => {
		if (
			window.confirm(
				`Delete project "${currentProject.name}"? This will also delete all tasks in this project.`,
			)
		) {
			await deleteProject(currentProject._id);
		}
	};
	return (
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

			<KanbanBoard onCreateTask={onCreateTask} onEditTask={onEditTask} />
		</div>
	);
}
