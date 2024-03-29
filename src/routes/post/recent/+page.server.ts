import type { PageServerLoad } from './$types';
import { posts, contents } from '$lib/schema';
import { and, desc, eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const recent = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			version: posts.version,
			thumbnail: contents.thumbnail
		})
		.from(posts)
		.innerJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
		.orderBy(desc(posts.createdAt))
		.limit(20);
	return {
		recent
	};
}) satisfies PageServerLoad;
