import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { posts, contents } from '$lib/schema';
import { and, eq } from 'drizzle-orm';

export const GET = (async ({ params, url, locals }) => {
	const id = params.id;
	const version = parseInt(url.searchParams.get('version') ?? '');
	if (!version || isNaN(version)) throw error(400, 'version is required or invalid');
	const post = await locals.db
		.select({
			download: posts.download,
			file: contents.file
		})
		.from(posts)
		.where(eq(posts.id, id))
		.leftJoin(contents, and(eq(posts.id, contents.post), eq(posts.version, contents.version)))
		.get();
	if (!post || !post.file) throw error(404, 'Post not found');
	await locals.db
		.update(posts)
		.set({ download: post.download + 1 })
		.where(eq(posts.id, id));

	throw redirect(302, post.file);
}) satisfies RequestHandler;
