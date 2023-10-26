import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { posts, contents } from '$lib/schema';
export const load:PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session?.user) throw error(401, 'Unauthorized');
	if (!session.user.emailVerified) throw redirect(302, '/email-verification');
	return {};
}
export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session?.user) throw error(401, 'Unauthorized');
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');
		const id = crypto.randomUUID().replaceAll('-', '').slice(0, 26);
		const formData = Object.fromEntries(await request.formData());

		const title = formData.title as string;
		const description = formData.description as string;
		const file = formData.file as string;
		const version = 1;
		const authorId = session.user.userId;
		const thumbnail = formData.thumbnail as string;

		const errors: string[] = [];
		if (title.length < 1) errors.push('title is required');
		if (file.length < 1) errors.push('file is required');
		if (errors.length > 0) {
			return fail(400, {
				errors,
				title,
				description,
				thumbnail,
				file
			});
		}
		await locals.db.insert(posts).values({
			id,
			title,
			version,
			authorId
		});
		await locals.db.insert(contents).values({
			post: id,
			version,
			thumbnail,
			file,
			description
		});
		return {
			success: true,
			id
		};
	}
};
