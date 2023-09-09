import type { PageServerLoad } from './$types';
import { users,posts,contents } from '$lib/schema';
import { and, desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params,locals }) => {
	const id = params.id;
	const user = await locals.db.select({
		uid: users.uid,
		name: users.name,
		image: users.image
	}).from(users).where(eq(users.uid, id)).get();
	if (!user) return error(404, 'User not found.');

	const post=await locals.db.select({
		id:posts.id,
		title:posts.title,
		thumbnail:contents.thumbnail,
	}).from(posts).where(eq(posts.authorId,id)).leftJoin(contents,and(eq(posts.id,contents.post),eq(posts.version,contents.version))).orderBy(desc(posts.createdAt)).limit(5);

	return { user, post };
};