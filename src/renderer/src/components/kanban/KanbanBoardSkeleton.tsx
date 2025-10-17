import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TaskCardSkeleton } from "../task/TaskCardSkeleton";

export function KanbanBoardSkeleton(): React.ReactElement {
	return (
		<div className="flex h-full gap-4 p-6">
			{/* Three columns */}
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex w-80 flex-col">
					{/* Column header */}
					<Card className="mb-4 p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Skeleton className="size-2 rounded-full" />
								<Skeleton className="h-6 w-24" />
							</div>
							<Skeleton className="h-6 w-8 rounded-full" />
						</div>
					</Card>

					{/* Task cards */}
					<div className="space-y-3">
						{[...Array(2)].map((_, j) => (
							<TaskCardSkeleton key={j} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
