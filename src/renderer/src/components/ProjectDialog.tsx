import { JSX, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { Project } from "../types/project";

const projectSchema = z.object({
	name: z.string().min(1, "Project name is required").max(100, "Name must be less than 100 characters"),
	description: z.string().max(500, "Description must be less than 500 characters").optional(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color")
		.optional(),
	icon: z.string().max(10, "Icon must be less than 10 characters").optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	project?: Project | null;
	onSubmit: (data: ProjectFormData) => Promise<void>;
}

const defaultColors = [
	"#3b82f6", // blue
	"#ef4444", // red
	"#10b981", // green
	"#f59e0b", // amber
	"#8b5cf6", // purple
	"#ec4899", // pink
	"#06b6d4", // cyan
	"#f97316", // orange
];

const defaultIcons = ["📋", "📁", "💼", "🎯", "🚀", "⭐", "🔥", "💡"];

export function ProjectDialog({ open, onOpenChange, project, onSubmit }: ProjectDialogProps): JSX.Element {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
		setValue,
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: "",
			description: "",
			color: "#3b82f6",
			icon: "📋",
		},
	});

	// Reset form when project changes or dialog opens
	useEffect(() => {
		if (open) {
			if (project) {
				reset({
					name: project.name,
					description: project.description || "",
					color: project.color || "#3b82f6",
					icon: project.icon || "📋",
				});
			} else {
				reset({
					name: "",
					description: "",
					color: "#3b82f6",
					icon: "📋",
				});
			}
		}
	}, [open, project, reset]);

	const selectedColor = watch("color");
	const selectedIcon = watch("icon");

	const onSubmitForm = async (data: ProjectFormData): Promise<void> => {
		try {
			await onSubmit(data);
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to submit project:", error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
					<DialogDescription>
						{project ? "Update your project details below." : "Fill in the details to create a new project."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
					{/* Project Name */}
					<div className="space-y-2">
						<Label htmlFor="name">
							Project Name <span className="text-destructive">*</span>
						</Label>
						<Input id="name" placeholder="My Awesome Project" {...register("name")} />
						{errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="What is this project about?"
							rows={3}
							{...register("description")}
						/>
						{errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
					</div>

					{/* Icon Selector */}
					<div className="space-y-2">
						<Label>Icon</Label>
						<div className="flex flex-wrap gap-2">
							{defaultIcons.map((icon) => (
								<button
									key={icon}
									type="button"
									onClick={() => setValue("icon", icon)}
									className={`hover:bg-accent h-10 w-10 rounded-lg border-2 text-xl transition-all ${
										selectedIcon === icon ? "border-primary bg-accent scale-110" : "border-transparent"
									}`}
								>
									{icon}
								</button>
							))}
						</div>
					</div>

					{/* Color Selector */}
					<div className="space-y-2">
						<Label>Color</Label>
						<div className="flex flex-wrap gap-2">
							{defaultColors.map((color) => (
								<button
									key={color}
									type="button"
									onClick={() => setValue("color", color)}
									className={`h-10 w-10 rounded-lg border-2 transition-all ${
										selectedColor === color ? "border-foreground scale-110" : "border-transparent"
									}`}
									style={{ backgroundColor: color }}
								/>
							))}
						</div>
						{errors.color && <p className="text-destructive text-sm">{errors.color.message}</p>}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : project ? "Update Project" : "Create Project"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
