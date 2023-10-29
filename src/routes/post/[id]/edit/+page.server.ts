import type { PageServerLoad, Actions } from './$types';
import { posts, contents } from '$lib/schema';
import { and, eq, sql } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw error(302, '/signin');
	if (!session.user.emailVerified) throw redirect(302, '/email-verification');
	const post = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			description: contents.description,
			thumbnail: contents.thumbnail,
			file: contents.file
		})
		.from(posts)
		.where(and(eq(posts.id, params.id), eq(posts.authorId, session.user.userId)))
		.innerJoin(contents, and(eq(posts.version, contents.version), eq(posts.id, contents.post)))
		.get();
	if (!post) throw error(404, 'Post not found or you are not the author');
	return { post };
};

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw error(401, 'Unauthorized');
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');

		const post = await locals.db
			.select({ count: sql<number>`COUNT(*)` })
			.from(posts)
			.where(and(eq(posts.id, params.id), eq(posts.authorId, session.user.userId)))
			.get();
		if (!post) throw error(404, 'Post not found or you are not the author');
		await locals.db.delete(posts).where(eq(posts.id, params.id)).execute();
		await locals.db.delete(contents).where(eq(contents.post, params.id)).execute();
		return {
			success: true,
			delete: true
		};
	},
	edit: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw error(401, 'Unauthorized');
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');
		const post = await locals.db
			.select({
				authorId: posts.authorId,
				version: posts.version,
				title: posts.title,
				description: contents.description,
				thumbnail: contents.thumbnail,
				file: contents.file
			})
			.from(posts)
			.where(and(eq(posts.id, params.id), eq(posts.authorId, session.user.userId)))
			.innerJoin(contents, and(eq(posts.version, contents.version), eq(posts.id, contents.post)))
			.get();
		if (!post) throw error(404, 'Post not found or you are not the author');
		const formData = Object.fromEntries(await request.formData());
		const differences: {
			title?: string;
			description?: string;
			file?: string;
			thumbnail?: string;
		} = {};
		const id = params.id;
		const title = formData.title as string;
		if (title !== post.title) differences.title = title;
		const description = formData.description as string;
		if (description !== post.description) differences.description = description;
		const version = post.version + 1;
		const file = formData.file as string;
		if (file !== post.file) differences.file = file;
		const thumbnail = formData.thumbnail as string;
		if (thumbnail !== post.thumbnail) differences.thumbnail = thumbnail;

		console.log(differences);
		if (Object.keys(differences).length > 0) {
			await locals.db.insert(contents).values({
				post: id,
				version,
				thumbnail: differences.thumbnail ?? post.thumbnail,
				file: differences.file ?? post.file ?? '',
				description: differences.description ?? post.description ?? ''
			});
			await locals.db
				.update(posts)
				.set({
					version,
					title: differences.title ?? post.title
				})
				.where(eq(posts.id, id))
				.execute();
			return {
				success: true,
				id
			};
		}
		return {
			success: true,
			id
		};
	}
};
