import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
	_id: string;
	projectId: mongoose.Types.ObjectId;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "done";
	priority: "low" | "medium" | "high";
	labels?: string[];
	dueDate?: Date;
	checklist?: Array<{
		id: string;
		text: string;
		completed: boolean;
	}>;
	position: number;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 2000,
		},
		status: {
			type: String,
			enum: ["todo", "in-progress", "done"],
			default: "todo",
			index: true,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		labels: {
			type: [String],
			default: [],
		},
		dueDate: {
			type: Date,
		},
		checklist: [
			{
				id: {
					type: String,
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				completed: {
					type: Boolean,
					default: false,
				},
			},
		],
		position: {
			type: Number,
			required: true,
			default: 0,
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Compound indexes for efficient queries
TaskSchema.index({ projectId: 1, status: 1, position: 1 });
TaskSchema.index({ projectId: 1, isArchived: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ title: "text", description: "text" });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
