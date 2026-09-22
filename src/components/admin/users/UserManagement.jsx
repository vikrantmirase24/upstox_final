import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import UserCreateModal from "./UserCreateModal";
import UserEditModal from "./UserEditModal";
import UserList from "./UserList";
import UserViewModal from "./UserViewModal";

export default function UserManagement({ apiBase }) {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);

	const loadUsers = async () => {
		const response = await fetch(`${apiBase}/admin/users`);
		if (response.ok) {
			const data = await response.json();
			setUsers(Array.isArray(data) ? data : []);
		}
	};

	useEffect(() => {
		loadUsers();
	}, [apiBase]);

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this user?")) return;
		const response = await fetch(`${apiBase}/admin/users/${id}`, { method: "DELETE" });
		if (response.ok) loadUsers();
	};

	return (
		<div className="space-y-6 max-w-5xl mx-auto">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-bold text-white">User Management</h2>
					<p className="text-xs text-slate-400 mt-0.5">Manage client accounts and copy-trading settings.</p>
				</div>
				<button
					onClick={() => setIsCreateOpen(true)}
					className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
				>
					<UserPlus size={14} /> Onboard New User
				</button>
			</div>

			<div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-lg">
				<UserList
					users={users}
					onView={(user) => { setSelectedUser(user); setIsViewOpen(true); }}
					onEdit={(user) => { setSelectedUser(user); setIsEditOpen(true); }}
					onDelete={handleDelete}
				/>
			</div>

			<UserCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onUserCreated={loadUsers} apiBase={apiBase} />
			<UserEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onUserUpdated={loadUsers} user={selectedUser} apiBase={apiBase} />
			<UserViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} user={selectedUser} />
		</div>
	);
}
