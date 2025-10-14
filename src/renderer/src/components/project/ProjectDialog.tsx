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
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { Project } from "../../types/project";
import { IconSelector } from "./IconSelector";
import { ColorSelector } from "./ColorSelector";
import { DEFAULT_COLORS, DEFAULT_ICONS } from "./constants";

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
					<div className="space-y-2">
						<Label htmlFor="name">
							Project Name <span className="text-destructive">*</span>
						</Label>
						<Input id="name" placeholder="My Awesome Project" {...register("name")} />
						{errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
					</div>

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

					<IconSelector
						selectedIcon={selectedIcon || "📋"}
						icons={DEFAULT_ICONS}
						onIconChange={(icon) => setValue("icon", icon)}
					/>

					<ColorSelector
						selectedColor={selectedColor || "#3b82f6"}
						colors={DEFAULT_COLORS}
						onColorChange={(color) => setValue("color", color)}
					/>
					{errors.color && <p className="text-destructive text-sm">{errors.color.message}</p>}

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
