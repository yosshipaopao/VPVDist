import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!session.user.emailVerified) throw redirect(302, '/email-verification');
	return {
		userId: session.user.userId,
		email: session.user.email,
		name: session.user.name,
		image: session.user.image
	};
};
export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw error(401, 'Unauthorized');
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');
		const formData = await request.formData();
		const userId = formData.get('userId');
		const name = formData.get('username');
		const image = formData.get('image');
		if (typeof name !== 'string' || typeof image !== 'string' || typeof userId !== 'string')
			return fail(400, { message: 'Invalid form data' });

		if (!/^[a-zA-Z0-9_-]+$/.test(userId) || userId.length < 3 || userId.length > 32)
			return fail(400, { message: 'Invalid userId' });
		if (name.length < 3 || name.length > 32) return fail(400, { message: 'Invalid username' });

		if (name !== session.user.name || image !== session.user.image) {
			await locals.lucia.updateUserAttributes(session.user.userId, {
				name,
				image
			});
		}
		if (userId !== session.user.userId) {
			await locals.db
				.update(users)
				.set({ id: userId.toLowerCase() })
				.where(eq(users.id, session.user.userId));
			await locals.lucia.invalidateSession(session.sessionId);
			locals.auth.setSession(null);
			const newSession = await locals.lucia.createSession({
				userId,
				attributes: {}
			});
			locals.auth.setSession(newSession);
		}
		return {
			success: true
		};
	}
};
