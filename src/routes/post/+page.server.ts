import type { PageServerLoad } from './$types';
import { posts, contents } from '$lib/schema';
import { and, desc, eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const promises = [];
	promises.push(
		locals.db
			.select({
				id: posts.id,
				title: posts.title,
				version: posts.version,
				thumbnail: contents.thumbnail
			})
			.from(posts)
			.innerJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
			.orderBy(desc(posts.createdAt))
			.limit(5)
	);
	promises.push(
		locals.db
			.select({
				id: posts.id,
				title: posts.title,
				version: posts.version,
				thumbnail: contents.thumbnail
			})
			.from(posts)
			.innerJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
			.orderBy(desc(posts.download))
			.limit(5)
	);

	const [recent, popular] = await Promise.all(promises);
	return {
		recent,
		popular
	};
}) satisfies PageServerLoad;
