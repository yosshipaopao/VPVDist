import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals,cookies }) => {
	const theme=cookies.get('theme');
	return {
		session: await locals.getSession(),
		theme
	};
}) satisfies LayoutServerLoad;