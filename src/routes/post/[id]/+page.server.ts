import type { PageServerLoad } from './$types';
import { posts, contents, users } from '$lib/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const post = await locals.db
		.select({
			title: posts.title,
			description: contents.description,
			thumbnail: contents.thumbnail,
			download: posts.download,
			file: contents.file,
			version: contents.version,
			author: users.name,
			authorIcon: users.image,
			authorId: posts.authorId,
			createdAt: posts.createdAt,
			updatedAt: contents.updatedAt
		})
		.from(posts)
		.where(eq(posts.id, params.id))
		.leftJoin(contents, and(eq(contents.post, posts.id), eq(contents.version, posts.version)))
		.innerJoin(users, eq(posts.authorId, users.id))
		.get();
	if (!post) throw error(404, 'Post not found');
	return {
		post,
		id: params.id
	};
};
