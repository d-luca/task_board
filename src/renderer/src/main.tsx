import "./global.css";
import "./assets/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<ThemeProvider defaultTheme="system" storageKey="task-board-theme">
				<App />
				<Toaster />
			</ThemeProvider>
		</ErrorBoundary>
	</StrictMode>,
);
