import type { PageServerLoad } from './$types';
import { users, posts, contents } from '$lib/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { and, desc } from 'drizzle-orm';
export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id;
	const user = await locals.db
		.select({
			name: users.name,
			image: users.image
		})
		.from(users)
		.where(eq(users.id, id))
		.get();
	if (!user) throw error(404, 'User not found.');
	const post = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			thumbnail: contents.thumbnail
		})
		.from(posts)
		.where(eq(posts.authorId, id))
		.orderBy(desc(posts.createdAt))
		.innerJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
		.limit(5);
	return {
		id,
		user,
		post
	};
};
