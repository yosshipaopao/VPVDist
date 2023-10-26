import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
export const actions: Actions = {
	signout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await locals.lucia.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	}
};
