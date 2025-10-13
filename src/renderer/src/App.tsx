import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/layout/Sidebar";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

function App(): React.JSX.Element {
	return (
		<AppLayout
			sidebar={
				<Sidebar>
					<div className="space-y-2">
						<h2 className="text-muted-foreground text-sm font-semibold">Projects</h2>
						<Button variant="outline" className="w-full justify-start">
							📁 Getting Started
						</Button>
					</div>
				</Sidebar>
			}
		>
			<div className="container mx-auto p-8">
				<Card>
					<CardHeader>
						<CardTitle>Welcome to Task Board Manager</CardTitle>
						<CardDescription>Phase 1 Setup Complete! 🎉</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<h3 className="font-semibold">✅ Completed Setup:</h3>
							<ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
								<li>Electron + React + TypeScript + Vite</li>
								<li>Tailwind CSS 4 configured</li>
								<li>shadcn/ui components installed</li>
								<li>Project structure created</li>
								<li>Type definitions added</li>
								<li>Utility functions ready</li>
							</ul>
						</div>
						<div className="flex gap-2">
							<Button>Primary Button</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="destructive">Destructive</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}

export default App;
