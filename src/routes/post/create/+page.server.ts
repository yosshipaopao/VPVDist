import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { posts, contents } from '$lib/schema';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const id = crypto.randomUUID().replaceAll('-', '').slice(0, 26);
		const formData = Object.fromEntries(await request.formData());

		const title = formData.title as string;
		const description = formData.description as string;
		const file = formData.file as string;
		const version = 1;
		const authorId = session.user.id;
		const thumbnail = formData.thumbnail as string;

		console.log(formData);

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