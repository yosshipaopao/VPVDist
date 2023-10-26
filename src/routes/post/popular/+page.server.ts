import type { PageServerLoad } from './$types';
import { posts, contents } from '$lib/schema';
import { and, asc, desc, eq, like, or, type SQLWrapper, type SQL } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const popular = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			version: posts.version,
			thumbnail: contents.thumbnail
		})
		.from(posts)
		.leftJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
		.orderBy(desc(posts.download))
		.limit(20);
	return {
		popular
	};
}) satisfies PageServerLoad;
