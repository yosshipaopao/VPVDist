import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';

const unableUID = new Set<string>(
	[
		'setup',
		'search',
		'api',
		'file',
		'image',
		'login',
		'logout',
		'auth',
		'auth-callback',
		'auth-logout',
		'auth-logout-callback',
		'auth-logout-redirect',
		'about',
		'privacy',
		'terms',
		'contact',
		'help',
		'admin'
	]
);

export const actions: Actions = {
	async default({ request, locals }) {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const data = await request.formData();
		const name = data.get('name') as string;
		const uid = data.get('uid') as string;
		const icon = data.get('icon') as string;
		//check name format
		if (!name || !name.length || name.length < 5 || name.length > 50) {
			return fail(400, {
				name,
				uid,
				error: 'Name must be between 5 and 50 characters'
			});
		}
		//check uid format
		if (!uid || !uid.length || uid.length < 5 || uid.length > 50) {
			return fail(400, {
				name,
				uid,
				error: 'UID must be between 5 and 50 characters'
			});
		}
		if (!/^[a-zA-Z0-9_-]+$/.test(uid)) {
			return fail(400, {
				name,
				uid,
				error: 'UID must be alphanumeric'
			});
		}
		if (unableUID.has(uid)) {
			return fail(400, {
				name,
				uid,
				error: 'UID is not allowed'
			});
		}

		const updates: {
			name?: string,
			id?: string,
			image?: string,
		} = {};

		if (name !== session.user.name) updates.name = name;
		if (icon !== session.user.image) updates.image = icon;
		if (uid !== session.user.id) {
			const existing = await locals.db.select({ id: users.id }).from(users).where(eq(users.id, uid)).get().then(x => !!x?.id);
			if (existing) throw error(409, 'UID already exists');
			updates.id = uid;
		}

		if (Object.keys(updates).length) {
			await locals.db.update(users).set(updates).where(eq(users.id, session.user.id)).execute();
		}
		return {
			success: true
		};
	}
};