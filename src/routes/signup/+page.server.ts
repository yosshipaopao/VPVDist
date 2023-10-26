import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { isValidEmail, sendEmailVerificationLink } from '$lib/server/email';
import { generateEmailVerificationToken } from '$lib/server/token';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');
		// basic check
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		if (password !== confirmPassword) return fail(400, { message: 'Passwords do not match' });
		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		try {
			const user = await locals.lucia.createUser({
				key: {
					providerId: 'email',
					providerUserId: email.toLowerCase(),
					password
				},
				attributes: {
					name: `user-${Math.floor(Math.random() * 1000000)}`,
					email,
					emailVerified: Number(false),
					image: '/images/default-icon.png'
				}
			});
			const session = await locals.lucia.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
			const token = await generateEmailVerificationToken(user.userId, locals.db);
			await sendEmailVerificationLink(email, token);
		} catch (e: any) {
			console.error(e);
			return fail(500, {
				message: e.message ?? 'An unknown error occurred'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/email-verification');
	}
};
