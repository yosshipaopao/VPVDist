import { redirect, fail } from '@sveltejs/kit';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendEmailVerificationLink } from '$lib/server/email';

import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_HOST } from '$env/static/public';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (session.user.emailVerified) throw redirect(302, '/');

	return {};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		if (session.user.emailVerified) {
			throw redirect(302, '/');
		}

		try {
			const token = await generateEmailVerificationToken(session.user.userId, locals.db);
			const { success, errors } = await sendEmailVerificationLink(session.user.email, token);
			if (!success) {
				console.log(session.user.email, `${PUBLIC_HOST}/email-verification/${token}`);
				return fail(500, {
					message: errors
				});
			}
			return {
				success: true
			};
		} catch {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
