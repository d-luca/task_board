import { JSX } from "react";
import { Archive } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Project } from "../../types/project";

interface ProjectListItemProps {
	project: Project;
	isActive: boolean;
	onSelect: (projectId: string) => void;
}

export function ProjectListItem({ project, isActive, onSelect }: ProjectListItemProps): JSX.Element {
	return (
		<button
			onClick={() => onSelect(project._id)}
			className={cn(
				"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
				"hover:bg-accent hover:text-accent-foreground",
				isActive && "bg-accent text-accent-foreground font-medium",
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
			{project.isArchived && <Archive className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />}
		</button>
	);
}
