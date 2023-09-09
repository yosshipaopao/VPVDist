import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';
import { IMAGE_SECRET, IMAGE_URL } from '$env/static/private';

const unableUID=new Set<string>(
	[
		"setup",
		"search",
	]
)

export const actions: Actions = {
	async default({ request, locals }) {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const data = await request.formData();
		const name = data.get('name') as string;
		const uid = data.get('uid') as string;
		const icon = data.get('icon') as File;
		let iconURL;
		if(icon) {
			const sendForm = new FormData();
			sendForm.append('file',icon??new Blob());
			sendForm.append("secret",IMAGE_SECRET);
			const res=await fetch(new URL(session.user.id,IMAGE_URL).href,{
				method:'POST',
				body:sendForm
			});
			iconURL=new URL(session.user.id,IMAGE_URL).href;
		}

		//check format
		if (!name || !name.length || name.length < 5 || name.length > 50) {
			return fail(400, {
				name,
				uid,
				error: 'Name must be between 5 and 50 characters'
			});
		}
		if (!uid || !uid.length || uid.length < 5 || uid.length > 50) {
			return fail(400, {
				name,
				uid,
				error: 'UID must be between 5 and 50 characters'
			});
		}
		if(!/^[a-zA-Z0-9_-]+$/.test(uid)){
			return fail(400, {
				name,
				uid,
				error: 'UID must be alphanumeric'
			});
		}

		const promises: Promise<any>[] = [];
		const updates={};
		if (name !== session.user.name) {
			updates.name=name;
		}
		if (uid !== session.user.id) {
			const existing = await locals.db.select({ uid: users.id }).from(users).where(eq(users.uid, uid)).get();
			if (existing) {
				return fail(400, {
					name,
					uid,
					error: 'UID already exists'
				});
			} else if(unableUID.has(uid)){
				return fail(400, {
					name,
					uid,
					error: 'UID is not allowed'
				});
			} else {
				updates.uid=uid;
			}
		}
		if(iconURL) updates.image=iconURL;
		if(Object.keys(updates).length>0) await locals.db.update(users).set(updates).where(eq(users.uid, session.user.id)).execute();

		return {
			success: true
		};
	}
};