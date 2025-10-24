/* eslint-disable @typescript-eslint/no-explicit-any */
import { Task, ITask, TaskStatus } from "../models/Task";
import mongoose from "mongoose";

export const taskService = {
	async create(data: Partial<ITask>): Promise<ITask> {
		try {
			// Get the next position for the task in this column
			const maxPosition = await Task.findOne({
				projectId: data.projectId,
				status: data.status || TaskStatus.TODO,
			})
				.sort({ position: -1 })
				.select("position")
				.exec();

			const task = new Task({
				...data,
				position: maxPosition ? maxPosition.position + 1 : 0,
			});

			const saved = await task.save();
			const obj = saved.toObject();
			// Ensure _id and projectId are strings for IPC serialization
			return {
				...obj,
				_id: obj._id.toString(),
				projectId: obj.projectId.toString(),
			} as any;
		} catch (error) {
			console.error("Error creating task:", error);
			throw error;
		}
	},

	async findByProject(projectId: string, includeArchived = false): Promise<ITask[]> {
		try {
			const query: Record<string, unknown> = {
				projectId: new mongoose.Types.ObjectId(projectId),
			};
			if (!includeArchived) {
				query.isArchived = false;
			}

			const tasks = await Task.find(query).sort({ status: 1, position: 1 }).lean().exec();
			// Ensure _id and projectId are strings for IPC serialization
			return tasks.map((t: any) => ({
				...t,
				_id: t._id.toString(),
				projectId: t.projectId.toString(),
			})) as any;
		} catch (error) {
			console.error("Error fetching tasks by project:", error);
			throw error;
		}
	},

	async findById(id: string): Promise<ITask | null> {
		try {
			const task = await Task.findById(id).lean().exec();
			if (!task) return null;
			// Ensure _id and projectId are strings for IPC serialization
			return {
				...task,
				_id: (task._id as any).toString(),
				projectId: (task.projectId as any).toString(),
			} as any;
		} catch (error) {
			console.error("Error fetching task by id:", error);
			throw error;
		}
	},

	async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
		try {
			const task = await Task.findByIdAndUpdate(id, data, {
				new: true,
				runValidators: true,
			})
				.lean()
				.exec();
			if (!task) return null;
			// Ensure _id and projectId are strings for IPC serialization
			return {
				...task,
				_id: (task._id as any).toString(),
				projectId: (task.projectId as any).toString(),
			} as any;
		} catch (error) {
			console.error("Error updating task:", error);
			throw error;
		}
	},

	async delete(id: string): Promise<ITask | null> {
		try {
			const task = await Task.findByIdAndDelete(id).lean().exec();
			if (!task) return null;
			// Ensure _id and projectId are strings for IPC serialization
			return {
				...task,
				_id: (task._id as any).toString(),
				projectId: (task.projectId as any).toString(),
			} as any;
		} catch (error) {
			console.error("Error deleting task:", error);
			throw error;
		}
	},

	async archive(id: string): Promise<ITask | null> {
		try {
			const task = await Task.findByIdAndUpdate(id, { isArchived: true }, { new: true }).lean().exec();
			if (!task) return null;
			// Ensure _id and projectId are strings for IPC serialization
			return {
				...task,
				_id: (task._id as any).toString(),
				projectId: (task.projectId as any).toString(),
			} as any;
		} catch (error) {
			console.error("Error archiving task:", error);
			throw error;
		}
	},

	async updatePosition(id: string, newStatus: string, newPosition: number): Promise<ITask | null> {
		try {
			const task = await Task.findByIdAndUpdate(
				id,
				{ status: newStatus, position: newPosition },
				{ new: true },
			)
				.lean()
				.exec();
			if (!task) return null;
			// Ensure _id and projectId are strings for IPC serialization
			return {
				...task,
				_id: (task._id as any).toString(),
				projectId: (task.projectId as any).toString(),
			} as any;
		} catch (error) {
			console.error("Error updating task position:", error);
			throw error;
		}
	},

	async reorderTasks(
		projectId: string,
		status: string,
		taskIds: string[],
	): Promise<{ modifiedCount: number }> {
		try {
			const bulkOps = taskIds.map((id, index) => ({
				updateOne: {
					filter: { _id: new mongoose.Types.ObjectId(id), projectId },
					update: { position: index, status },
				},
			}));

			const result = await Task.bulkWrite(bulkOps);
			return { modifiedCount: result.modifiedCount };
		} catch (error) {
			console.error("Error reordering tasks:", error);
			throw error;
		}
	},

	async findByDueDate(startDate: Date, endDate: Date): Promise<ITask[]> {
		try {
			const tasks = await Task.find({
				dueDate: { $gte: startDate, $lte: endDate },
				isArchived: false,
			})
				.sort({ dueDate: 1 })
				.lean()
				.exec();
			// Ensure _id and projectId are strings for IPC serialization
			return tasks.map((t: any) => ({
				...t,
				_id: t._id.toString(),
				projectId: t.projectId.toString(),
			})) as any;
		} catch (error) {
			console.error("Error fetching tasks by due date:", error);
			throw error;
		}
	},

	async search(projectId: string, searchTerm: string): Promise<ITask[]> {
		try {
			const tasks = await Task.find({
				projectId: new mongoose.Types.ObjectId(projectId),
				$text: { $search: searchTerm },
				isArchived: false,
			})
				.sort({ score: { $meta: "textScore" } })
				.lean()
				.exec();
			// Ensure _id and projectId are strings for IPC serialization
			return tasks.map((t: any) => ({
				...t,
				_id: t._id.toString(),
				projectId: t.projectId.toString(),
			})) as any;
		} catch (error) {
			console.error("Error searching tasks:", error);
			throw error;
		}
	},
};
