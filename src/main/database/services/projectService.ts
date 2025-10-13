import { Project, IProject } from "../models/Project";

export const projectService = {
	async create(data: Partial<IProject>): Promise<IProject> {
		try {
			const project = new Project(data);
			const saved = await project.save();
			return saved.toObject();
		} catch (error) {
			console.error("Error creating project:", error);
			throw error;
		}
	},

	async findAll(includeArchived = false): Promise<IProject[]> {
		try {
			const query = includeArchived ? {} : { isArchived: false };
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.find(query).sort({ updatedAt: -1 }).lean().exec();
		} catch (error) {
			console.error("Error fetching projects:", error);
			throw error;
		}
	},

	async findById(id: string): Promise<IProject | null> {
		try {
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.findById(id).lean().exec();
		} catch (error) {
			console.error("Error fetching project by id:", error);
			throw error;
		}
	},

	async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
		try {
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.findByIdAndUpdate(id, data, {
				new: true,
				runValidators: true,
			})
				.lean()
				.exec();
		} catch (error) {
			console.error("Error updating project:", error);
			throw error;
		}
	},

	async delete(id: string): Promise<IProject | null> {
		try {
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.findByIdAndDelete(id).lean().exec();
		} catch (error) {
			console.error("Error deleting project:", error);
			throw error;
		}
	},

	async archive(id: string): Promise<IProject | null> {
		try {
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.findByIdAndUpdate(id, { isArchived: true }, { new: true }).lean().exec();
		} catch (error) {
			console.error("Error archiving project:", error);
			throw error;
		}
	},

	async unarchive(id: string): Promise<IProject | null> {
		try {
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.findByIdAndUpdate(id, { isArchived: false }, { new: true }).lean().exec();
		} catch (error) {
			console.error("Error unarchiving project:", error);
			throw error;
		}
	},

	async search(searchTerm: string): Promise<IProject[]> {
		try {
			// @ts-expect-error - lean() returns plain object, perfect for IPC
			return await Project.find({
				$text: { $search: searchTerm },
				isArchived: false,
			})
				.sort({ score: { $meta: "textScore" } })
				.lean()
				.exec();
		} catch (error) {
			console.error("Error searching projects:", error);
			throw error;
		}
	},
};
