/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project, IProject } from "../models/Project";

export const projectService = {
	async create(data: Partial<IProject>): Promise<IProject> {
		try {
			const project = new Project(data);
			const saved = await project.save();
			const obj = saved.toObject();
			// Ensure _id is a string for IPC serialization
			return { ...obj, _id: obj._id.toString() } as any;
		} catch (error) {
			console.error("Error creating project:", error);
			throw error;
		}
	},

	async findAll(includeArchived = false): Promise<IProject[]> {
		try {
			const query = includeArchived ? {} : { isArchived: false };
			const projects = await Project.find(query).sort({ updatedAt: -1 }).lean().exec();
			// Ensure _id is a string for IPC serialization
			return projects.map((p: any) => ({ ...p, _id: p._id.toString() })) as any;
		} catch (error) {
			console.error("Error fetching projects:", error);
			throw error;
		}
	},

	async findById(id: string): Promise<IProject | null> {
		try {
			const project = await Project.findById(id).lean().exec();
			if (!project) return null;
			// Ensure _id is a string for IPC serialization
			return { ...project, _id: (project._id as any).toString() } as any;
		} catch (error) {
			console.error("Error fetching project by id:", error);
			throw error;
		}
	},

	async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
		try {
			const project = await Project.findByIdAndUpdate(id, data, { new: true }).lean().exec();
			if (!project) return null;
			// Ensure _id is a string for IPC serialization
			return { ...project, _id: (project._id as any).toString() } as any;
		} catch (error) {
			console.error("Error updating project:", error);
			throw error;
		}
	},
	async delete(id: string): Promise<IProject | null> {
		try {
			const project = await Project.findByIdAndDelete(id).lean().exec();
			if (!project) return null;
			// Ensure _id is a string for IPC serialization
			return { ...project, _id: (project._id as any).toString() } as any;
		} catch (error) {
			console.error("Error deleting project:", error);
			throw error;
		}
	},

	async archive(id: string): Promise<IProject | null> {
		try {
			const project = await Project.findByIdAndUpdate(id, { isArchived: true }, { new: true }).lean().exec();
			if (!project) return null;
			// Ensure _id is a string for IPC serialization
			return { ...project, _id: (project._id as any).toString() } as any;
		} catch (error) {
			console.error("Error archiving project:", error);
			throw error;
		}
	},

	async unarchive(id: string): Promise<IProject | null> {
		try {
			const project = await Project.findByIdAndUpdate(id, { isArchived: false }, { new: true }).lean().exec();
			if (!project) return null;
			// Ensure _id is a string for IPC serialization
			return { ...project, _id: (project._id as any).toString() } as any;
		} catch (error) {
			console.error("Error unarchiving project:", error);
			throw error;
		}
	},

	async search(searchTerm: string): Promise<IProject[]> {
		try {
			const projects = await Project.find({
				$text: { $search: searchTerm },
				isArchived: false,
			})
				.sort({ score: { $meta: "textScore" } })
				.lean()
				.exec();
			// Ensure _id is a string for IPC serialization
			return projects.map((p: any) => ({ ...p, _id: p._id.toString() })) as any;
		} catch (error) {
			console.error("Error searching projects:", error);
			throw error;
		}
	},
};
