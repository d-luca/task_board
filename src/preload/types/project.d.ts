export interface ProjectAPI {
	create: (data: unknown) => Promise<unknown>;
	getAll: (includeArchived?: boolean) => Promise<unknown>;
	getById: (id: string) => Promise<unknown>;
	update: (id: string, data: unknown) => Promise<unknown>;
	delete: (id: string) => Promise<unknown>;
	archive: (id: string) => Promise<unknown>;
	unarchive: (id: string) => Promise<unknown>;
	search: (searchTerm: string) => Promise<unknown>;
}
