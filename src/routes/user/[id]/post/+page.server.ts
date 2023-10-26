import type { PageServerLoad } from './$types';
import { posts, contents } from '$lib/schema';
import { and, desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id;

	const post = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			thumbnail: contents.thumbnail
		})
		.from(posts)
		.where(eq(posts.authorId, id))
		.leftJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
		.orderBy(desc(posts.createdAt))
		.all();

	return { post, id };
};
