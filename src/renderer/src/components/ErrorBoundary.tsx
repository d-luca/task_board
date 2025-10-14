import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

/**
 * React doesn't currently provide a hook-based API for error boundaries
 * getDerivedStateFromError and componentDidCatch are only available in class components
 */
export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("Uncaught error:", error, errorInfo);
	}

	private handleReset = (): void => {
		this.setState({ hasError: false, error: null });
		window.location.reload();
	};

	public render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className="bg-background flex h-screen items-center justify-center p-4">
					<Card className="w-full max-w-md p-6">
						<div className="flex flex-col items-center gap-4 text-center">
							<div className="bg-destructive/10 rounded-full p-3">
								<AlertCircle className="text-destructive h-8 w-8" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">Something went wrong</h2>
								<p className="text-muted-foreground mt-2">
									An unexpected error occurred. Please try reloading the application.
								</p>
							</div>
							{this.state.error && (
								<details className="w-full">
									<summary className="text-muted-foreground cursor-pointer text-sm hover:underline">
										Error details
									</summary>
									<pre className="bg-muted text-muted-foreground mt-2 max-h-32 overflow-auto rounded-md p-2 text-left text-xs">
										{this.state.error.toString()}
									</pre>
								</details>
							)}
							<div className="flex gap-2">
								<Button onClick={this.handleReset}>Reload Application</Button>
							</div>
						</div>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
