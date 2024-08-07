// types/admin.ts
export interface Admin {
	id: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	name: string;
	email: string;
	phone: string;
	password: string;
	role_id: number;
	status: string;
}
