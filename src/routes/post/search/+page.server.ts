import type { PageServerLoad } from './$types';
import { posts, contents } from '$lib/schema';
import { and, asc, desc, eq, like, or, type SQLWrapper, type SQL } from 'drizzle-orm';

export const load = (async ({ url, locals }) => {
	const q = url.searchParams.get('q') ?? '';
	const orderBy = url.searchParams.get('orderBy') ?? 'created';
	const order = url.searchParams.get('order') ?? 'desc';
	let orderByQuery: SQLWrapper | undefined;
	let orderQuery: SQL<unknown> | undefined;
	switch (orderBy) {
		case 'created':
			orderByQuery = posts.createdAt;
			break;
		case 'updated':
			orderByQuery = contents.updatedAt;
			break;
		case 'download':
			orderByQuery = posts.download;
			break;
		default:
			orderByQuery = posts.createdAt;
	}
	switch (order) {
		case 'asc':
			orderQuery = asc(orderByQuery);
			break;
		case 'desc':
			orderQuery = desc(orderByQuery);
			break;
		default:
			orderQuery = desc(orderByQuery);
	}
	if (q === '') return { result: [], q, orderBy, order };
	const result = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			version: posts.version,
			thumbnail: contents.thumbnail
		})
		.from(posts)
		.where(or(like(posts.title, `%${q}%`), like(posts.id, `%${q}%`)))
		.leftJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
		.orderBy(orderQuery)
		.limit(20);
	return { result, q, orderBy, order };
}) satisfies PageServerLoad;
