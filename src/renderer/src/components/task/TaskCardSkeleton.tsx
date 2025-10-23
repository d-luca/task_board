import { JSX } from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function TaskCardSkeleton(): JSX.Element {
	return (
		<Card className="p-4">
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 space-y-2">
					{/* Title */}
					<Skeleton className="h-5 w-3/4" />

					{/* Priority dot and labels */}
					<div className="flex items-center gap-2">
						<Skeleton className="size-3 rounded-full" />
						<Skeleton className="h-5 w-16 rounded-full" />
						<Skeleton className="h-5 w-16 rounded-full" />
					</div>

					{/* Checklist and due date */}
					<div className="flex items-center gap-3 pt-1">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-20" />
					</div>
				</div>

				{/* Delete button placeholder */}
				<Skeleton className="size-5 rounded" />
			</div>
		</Card>
	);
}
