import { JSX, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { ScrollArea } from "../ui/scroll-area";
import { ProjectListHeader } from "./ProjectListHeader";
import { ProjectListItem } from "./ProjectListItem";
import { ProjectListEmpty } from "./ProjectListEmpty";
import { ProjectListSkeleton } from "./ProjectListSkeleton";
import { ProjectListLoading } from "./ProjectListLoading";

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
		return <ProjectListSkeleton />;
	}

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<ProjectListHeader
				showArchivedProjects={showArchivedProjects}
				onCreateProject={onCreateProject}
				onToggleArchived={toggleShowArchived}
			/>

			{/* Project List */}
			<ScrollArea className="flex-1">
				<div className="p-2">
					{visibleProjects.length === 0 ? (
						<ProjectListEmpty hasProjects={projects.length > 0} />
					) : (
						<div className="space-y-1">
							{visibleProjects.map((project, index) => (
								<ProjectListItem
									key={`project_${index}_${project._id}`}
									project={project}
									isActive={currentProjectId === project._id}
									onSelect={setCurrentProject}
								/>
							))}
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Loading Overlay */}
			{loadingProjects && <ProjectListLoading />}
		</div>
	);
}
