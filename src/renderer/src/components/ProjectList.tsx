import { JSX, useEffect } from "react";
import { Plus, Archive, FolderOpen, Loader2 } from "lucide-react";
import { useStore } from "../store/useStore";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { cn } from "../lib/utils";

interface ProjectListProps {
	onCreateProject: () => void;
}

export function ProjectList({ onCreateProject }: ProjectListProps): JSX.Element {
	const {
		projects,
		currentProjectId,
		showArchivedProjects,
		loadingProjects,
		loadProjects,
		setCurrentProject,
		toggleShowArchived,
		getVisibleProjects,
	} = useStore();

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	const visibleProjects = getVisibleProjects();

	if (loadingProjects) {
		return (
			<div className="flex flex-col gap-2 p-4">
				<div className="mb-2 flex items-center justify-between">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-8 w-8" />
				</div>
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="border-b p-4">
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Projects</h2>
					<Button size="sm" onClick={onCreateProject}>
						<Plus className="mr-1 h-4 w-4" />
						New
					</Button>
				</div>

				{/* Archive Toggle */}
				<Button
					variant={showArchivedProjects ? "secondary" : "ghost"}
					size="sm"
					className="w-full justify-start"
					onClick={toggleShowArchived}
				>
					<Archive className="mr-2 h-4 w-4" />
					{showArchivedProjects ? "Hide" : "Show"} Archived
				</Button>
			</div>

			{/* Project List */}
			<ScrollArea className="flex-1">
				<div className="p-2">
					{visibleProjects.length === 0 ? (
						<div className="flex flex-col items-center justify-center px-4 py-8 text-center">
							<FolderOpen className="text-muted-foreground mb-2 h-12 w-12" />
							<p className="text-muted-foreground text-sm">
								{projects.length === 0
									? "No projects yet. Create your first project to get started!"
									: "No archived projects"}
							</p>
						</div>
					) : (
						<div className="space-y-1">
							{visibleProjects.map((project, index) => (
								<button
									key={`project_${index}_${project._id}`}
									onClick={() => setCurrentProject(project._id)}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
										"hover:bg-accent hover:text-accent-foreground",
										currentProjectId === project._id && "bg-accent text-accent-foreground font-medium",
										project.isArchived && "opacity-60",
									)}
								>
									{/* Project Icon/Color */}
									<div
										className="h-3 w-3 flex-shrink-0 rounded-full"
										style={{ backgroundColor: project.color || "#3b82f6" }}
									/>

									{/* Project Info */}
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<span className="truncate">{project.icon || "📁"}</span>
											<span className="truncate">{project.name}</span>
										</div>
										{project.description && (
											<p className="text-muted-foreground mt-0.5 truncate text-xs">{project.description}</p>
										)}
									</div>

									{/* Archive Indicator */}
									{project.isArchived && (
										<Archive className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
									)}
								</button>
							))}
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Loading Overlay */}
			{loadingProjects && (
				<div className="bg-background/50 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
					<Loader2 className="text-primary h-8 w-8 animate-spin" />
				</div>
			)}
		</div>
	);
}
