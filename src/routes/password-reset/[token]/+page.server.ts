import { fail, redirect } from '@sveltejs/kit';
import { isValidPasswordResetToken, validatePasswordResetToken } from '$lib/server/token';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { token } = params;
	const validToken = await isValidPasswordResetToken(token, locals.db);
	if (!validToken) throw redirect(302, '/password-reset');

	return {};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');
		if (typeof password !== 'string' || password.length < 6 || password.length > 255)
			return fail(400, {
				message: 'Invalid password'
			});
		if (password !== confirmPassword)
			return fail(400, {
				message: 'Passwords do not match'
			});
		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token, locals.db);
			let user = await locals.lucia.getUser(userId);
			await locals.lucia.invalidateAllUserSessions(user.userId);
			await locals.lucia.updateKeyPassword('email', user.email, password);
			if (!user.emailVerified) {
				user = await locals.lucia.updateUserAttributes(user.userId, {
					emailVerified: Number(true)
				});
			}
			const session = await locals.lucia.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			return fail(400, {
				message: 'Invalid or expired password reset link'
			});
		}
		throw redirect(302, '/');
	}
};
