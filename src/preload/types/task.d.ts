export interface TaskAPI {
	create: (data: unknown) => Promise<unknown>;
	getByProject: (projectId: string, includeArchived?: boolean) => Promise<unknown>;
	getById: (id: string) => Promise<unknown>;
	update: (id: string, data: unknown) => Promise<unknown>;
	delete: (id: string) => Promise<unknown>;
	archive: (id: string) => Promise<unknown>;
	updatePosition: (id: string, status: string, position: number) => Promise<unknown>;
	reorder: (projectId: string, status: string, taskIds: string[]) => Promise<unknown>;
	getByDueDate: (startDate: string, endDate: string) => Promise<unknown>;
	search: (projectId: string, searchTerm: string) => Promise<unknown>;
}
