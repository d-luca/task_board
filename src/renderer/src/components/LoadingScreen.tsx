import { JSX, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
	message?: string;
	progress?: number;
}

export function LoadingScreen({ message = "Initializing...", progress }: LoadingScreenProps): JSX.Element {
	const [dots, setDots] = useState("");
	const [elapsedSeconds, setElapsedSeconds] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
			<div className="flex flex-col items-center gap-6 p-8">
				<Loader2 className="text-primary h-12 w-12 animate-spin" />
				<div className="max-w-md text-center">
					<h2 className="mb-2 text-2xl font-semibold">Task Board</h2>
					<p className="text-muted-foreground">
						{message}
						{dots}
					</p>
					{elapsedSeconds > 30 && (
						<p className="text-muted-foreground mt-4 text-sm">
							This is taking longer than usual. First-time setup requires downloading MongoDB binaries
							(~50-100 MB). Please be patient...
						</p>
					)}
					{elapsedSeconds > 120 && (
						<p className="mt-2 text-sm font-medium text-yellow-600 dark:text-yellow-500">
							Still working... If this continues for more than 5 minutes, please check your internet
							connection.
						</p>
					)}
					{progress !== undefined && progress > 0 && (
						<div className="mt-4 w-64">
							<div className="bg-secondary h-2 overflow-hidden rounded-full">
								<div
									className="bg-primary h-full transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<p className="text-muted-foreground mt-2 text-sm">{progress}%</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
