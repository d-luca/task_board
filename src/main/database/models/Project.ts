import mongoose, { Schema, Document } from "mongoose";
import { TaskStatus, TaskPriority } from "./Task";

export interface IProject extends Document {
	_id: string;
	name: string;
	description?: string;
	color?: string;
	icon?: string;
	isArchived: boolean;
	settings?: {
		taskStatuses?: string[];
		defaultPriority?: TaskPriority;
	};
	createdAt: Date;
	updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		color: {
			type: String,
			default: "#3b82f6",
		},
		icon: {
			type: String,
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
		settings: {
			taskStatuses: {
				type: [String],
				default: Object.values(TaskStatus),
			},
			defaultPriority: {
				type: String,
				enum: Object.values(TaskPriority),
				default: TaskPriority.MEDIUM,
			},
		},
	},
	{
		timestamps: true,
	},
);

// Indexes for better query performance
ProjectSchema.index({ isArchived: 1, updatedAt: -1 });
ProjectSchema.index({ name: "text" });

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
